import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RegisterUserDocument = HydratedDocument<RegisterUser>;

@Schema()
export class RegisterUser {
  @Prop()
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

}

export const RegisterUserSchema = SchemaFactory.createForClass(RegisterUser);