import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  create(@Body() postData: Partial<PostModel>) {
    return this.postsService.create(postData);
  }

  @Get('nest')
  findConsole() {
    return this.postsService.consoleLog();
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<PostModel>) {
    return this.postsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
