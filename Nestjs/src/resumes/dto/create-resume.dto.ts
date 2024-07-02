import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
  @IsNotEmpty({message: "email not empty"})
  email: string;

  @IsNotEmpty({message: "userId not empty"})
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({message: "url not empty"})
  url: string;

  @IsNotEmpty({message: "status not empty"})
  status: string;

  @IsNotEmpty({message: "companyId not empty"})
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({message: "jobId not empty"})
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'url not empty'})
  url: string

  @IsNotEmpty({ message: 'companyId not empty'})
  @IsMongoId({ message: 'companyId is a mongo id'})
  companyId: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'jobId not empty'})
  @IsMongoId({ message: 'jobId is a mongo id'})
  jobId: mongoose.Schema.Types.ObjectId
  
}
