/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: 'USER' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
