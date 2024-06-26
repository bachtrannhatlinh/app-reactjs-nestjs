import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from '@/auth/decorator/customize';
import { IUser } from '@/users/users.interface';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ResponseMessage('Create a new job')
  async create(@Body() CreateUserDto: CreateJobDto, @User() user: IUser) {
    let newJob = await this.jobService.create(CreateUserDto, user);
    return {
      _id: newJob?._id,
      createAt: newJob?.createdAt,
    };
  }

  @Get()
  @ResponseMessage("Fetch List Company with paginate")
  async findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return await this.jobService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a job by id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a job by id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user:IUser) {
    return this.jobService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.jobService.remove(id, user);
  }
}
