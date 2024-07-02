import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume as ResumeM, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(ResumeM.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto
    const { email, _id} = user

    let newResume = await this.resumeModel.create({
      url,
      companyId,
      jobId,
      email,
      userId: _id,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date,
          updatedBy: {
            _id,
            email
          }
        }
      ],
      createdBy: {
        _id,
        email
      }
    })

    return {
      _id: newResume._id,
      createdAt: newResume.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = await this.resumeModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort || {})
      .populate(population || [])
      .select(projection as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found resume';
    return await this.resumeModel.findById(id)
  }

  async update(_id: string, status: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("not found resume")
    }

    const updated = await this.resumeModel.updateOne(
      {_id},
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      }
    )

    return updated
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';

    await this.resumeModel.updateOne(
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
    return this.resumeModel.softDelete({
      _id: id,
    });
  }

  async getResumeByUser(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id
    })
  }
}
