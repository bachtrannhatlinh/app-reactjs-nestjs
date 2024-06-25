import { Type } from "@nestjs/class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name:string;
}

export class CreateUserDto {
  @IsNotEmpty({message: "name not empty"})
  name:string;

  @IsEmail({}, {message: "Email not correct format"})
  @IsNotEmpty({message: "Email not empty"})
  email: string;

  @IsNotEmpty({message: "Password not empty"})
  password: string;

  @IsNotEmpty({message: "Age not empty"})
  age: number

  @IsNotEmpty({message: "Gender not empty"})
  gender: string

  @IsNotEmpty({message: "Address not empty"})
  address: string

  @IsNotEmpty({message: "Role not empty"})
  role: number

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({message: "name not empty"})
  name:string;

  @IsEmail({}, {message: "Email not correct format"})
  @IsNotEmpty({message: "Email not empty"})
  email: string;

  @IsNotEmpty({message: "Password not empty"})
  password: string;

  @IsNotEmpty({message: "Age not empty"})
  age: number

  @IsNotEmpty({message: "Gender not empty"})
  gender: string

  @IsNotEmpty({message: "Address not empty"})
  address: string
}