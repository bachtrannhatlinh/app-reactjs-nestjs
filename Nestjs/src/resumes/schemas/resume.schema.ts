import { Company } from '@/companies/schemas/company.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({timestamps: true})
export class Resume {
  @Prop()
  name: string;

  @Prop()
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

  // @Prop()
  // companyId: mongoose.Schema.Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string

  @Prop()
  status: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})
  companyId: mongoose.Schema.Types.ObjectId

  @Prop({type: mongoose.Schema.Types.Array})
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId;
      email: string;
    }
  }[]

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);