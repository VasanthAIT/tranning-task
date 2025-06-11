import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './modules/product.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailerModule } from './modules/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
// import { TasksModule } from './modules/task.module';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';
import { MailerController } from './controller/mailer.controller'; 

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://romanvasanth08:vasanth1210@cluster0.yy1fkb4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
     ConfigModule.forRoot({ isGlobal: true,  envFilePath: '.env',}),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      
    
     
    }),
    PostsModule,
    AuthModule,
    UsersModule,
    ProductModule,
    MailerModule,
   
    
    
    // TasksModule
  ],
      controllers: [MailerController], 
       providers: [MailerService],
       exports: [MailerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
