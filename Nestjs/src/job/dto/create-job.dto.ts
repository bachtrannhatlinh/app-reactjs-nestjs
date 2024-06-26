import { Transform, Type } from "@nestjs/class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name:string;
}


export class CreateJobDto {
  @IsNotEmpty({message: "Name not empty"})
  name: string;

  @IsArray({message: 'skills is format array'})
  @IsNotEmpty({message: "Address not empty"})
  @IsString({each: true, message: "skill định dạng là string"})
  skills: [];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({message: "salary not empty"})
  salary: number;

  @IsNotEmpty({message: "quantity not empty"})
  quantity: number;

  @IsNotEmpty({message: "level not empty"})
  level: string;

  @IsNotEmpty({message: "description not empty"})
  description: string;

  @IsNotEmpty({message: "StartDate not empty"})
  @Transform(({value}) => new Date(value))
  @IsDate({message: 'startDate is format Date'})
  startDate: Date;

  @IsNotEmpty({message: "endDate not empty"})
  @Transform(({value}) => new Date(value))
  @IsDate({message: 'endDate is format Date'})
  endDate: Date;

  @IsNotEmpty({message: "isActive not empty"})
  @IsBoolean({message: "isActive is format boolean"})
  isActive: boolean
}
