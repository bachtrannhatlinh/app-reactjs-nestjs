import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from '@/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job as JobM, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JobM.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      company,
      description,
      endDate,
      level,
      name,
      quantity,
      salary,
      skills,
      startDate,
      isActive,
      location
    } = createJobDto;

    let newJob = await this.jobModel.create({
      company,
      description,
      endDate,
      level,
      name,
      quantity,
      salary,
      skills,
      startDate,
      isActive,
      location,
      createdBy: {
        _id: user._id,
        createAt: user.email,
      },
    });
    return newJob;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = await this.jobModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort || {})
      .populate(population || [])
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';
    return await this.jobModel.findById(id)
  }

  async update(id: string, updateUserDto: UpdateJobDto, user: IUser) {
    try {
      const updatedjob = await this.jobModel
        .findByIdAndUpdate(
          id,
          {
            ...updateUserDto,
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        )
      if (!updatedjob) {
        throw new Error('Job not found');
      }
      return updatedjob;
    } catch (err) {
      throw new Error(err.message);
    }
  }


  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';

    await this.jobModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.jobModel.softDelete({
      _id: id,
    });
  }
}
