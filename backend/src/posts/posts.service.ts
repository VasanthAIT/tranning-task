// src/posts/posts.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(data: Partial<Post>): Promise<Post> {
    const createdPost = new this.postModel(data);
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec(); // properly typed
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  consoleLog(): string {
    console.log('This is a log message from PostsService');
    return 'Logged successfully';
  }
}
