import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import { AppModule } from './app.module';

// 🔧 Dummy modules to avoid decorator issues from Mongoose schemas
@Module({})
class MockPostsModule {}

@Module({})
class MockProductModule {}

@Module({})
class MockAuthModule {}

@Module({})
class MockUsersModule {}

@Module({})
class MockMailerModule {}

describe('AppModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        // Import AppModule manually but override internal modules
        AppModule,
      ],
    })
      .overrideModule(require('./posts/posts.module').PostsModule)
      .useModule(MockPostsModule)
      .overrideModule(require('./modules/product.module').ProductModule)
      .useModule(MockProductModule)
      .overrideModule(require('./auth/auth.module').AuthModule)
      .useModule(MockAuthModule)
      .overrideModule(require('./users/users.module').UsersModule)
      .useModule(MockUsersModule)
      .overrideModule(require('./modules/mailer.module').MailerModule)
      .useModule(MockMailerModule)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
