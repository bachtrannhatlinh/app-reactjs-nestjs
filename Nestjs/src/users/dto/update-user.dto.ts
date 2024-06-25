import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {IsNotEmpty} from 'class-validator'

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
  @IsNotEmpty({message: '_id not empty'})
  _id: string;
}