
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
  return this.userModel.findOne({ username }).exec();
}
async findByEmail(email: string): Promise<User | null> {
  return this.userModel.findOne({ email });
}

async create(userData: { username: string; email: string; password: string }) {
  const newUser = new this.userModel(userData);
  return await newUser.save();
}

}
