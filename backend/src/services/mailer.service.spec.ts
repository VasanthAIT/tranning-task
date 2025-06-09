import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MailerService, ConfigService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email successfully', async () => {
    jest.spyOn<any, any>(service['transporter'], 'sendMail').mockResolvedValueOnce({});

    const result = await service.sendMailWithAttachments(
      'test@example.com',
      'Test Subject',
      '<p>Test Email</p>',
      [],
    );

    expect(result).toEqual({ message: 'Email sent successfully' });
  });

  it('should throw error if sendMail fails', async () => {
    jest.spyOn<any, any>(service['transporter'], 'sendMail').mockRejectedValueOnce(new Error('Mock error'));

    await expect(
      service.sendMailWithAttachments('test@example.com', 'Test', '<p>Body</p>', []),
    ).rejects.toThrow('Failed to send email');
  });
});
