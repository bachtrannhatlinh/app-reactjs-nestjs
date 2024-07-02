import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema}]),
    ConfigModule
  ],
  exports: [JobService]
})
export class JobModule {}
