import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({timestamps: true})
export class Job {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  skills: string[];

  @Prop({type: Object})
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name:string;
    logo: string
  }

  @Prop()
  salary: number;

  @Prop()
  quantity: string;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean

  @Prop()
  location: string

  @Prop({type: Object})
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email:string;
  }

  @Prop({type: Object})
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email:string;
  }

  @Prop({type: Object})
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email:string;
  }

  @Prop()
  createdAt: string;

  @Prop()
  updateAt: string;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);