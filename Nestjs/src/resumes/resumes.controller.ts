import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from '@/auth/decorator/customize';
import { IUser } from '@/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    let newResume = await this.resumesService.create(createResumeDto, user);
    return {
      _id: newResume?._id,
      createAt: newResume?.createdAt,
    };
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Resume with paginate")
  async findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return await this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('update resume by user')
  update(@Param('id') id: string, @Body("status") status: string, @User() user:IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  async remove(@Param('id') id: string, @User() user:IUser) {
    return await this.resumesService.remove(id, user);
  }

  @ResponseMessage('get resume by user')
  @Post('by-user')
  async getResumeByUser(@User() user: IUser) {
    return await this.resumesService.getResumeByUser(user)
  }
}
