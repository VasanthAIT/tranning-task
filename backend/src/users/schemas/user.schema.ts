// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = User & Document & { _id: string }; // Fix here 👈

export const UserSchema = SchemaFactory.createForClass(User);
