import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from './mailer.controller';
import { MailerService } from '../services/mailer.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('MailerController', () => {
  let controller: MailerController;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMailWithAttachments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    controller = module.get<MailerController>(MailerController);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail()', () => {
    it('should send email with attachments', async () => {
      const mockBody = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<b>Hello</b>',
        attachments: [
          { filename: 'test.txt', path: './uploads/test.txt' },
        ],
      };

      const mockResult = { success: true };
      mockMailerService.sendMailWithAttachments.mockResolvedValue(mockResult);

      const result = await controller.sendEmail(mockBody);
      expect(result).toEqual(mockResult);
      expect(mockMailerService.sendMailWithAttachments).toHaveBeenCalledWith(
        mockBody.to,
        mockBody.subject,
        mockBody.html,
        mockBody.attachments,
      );
    });

    it('should throw an error if attachments are empty', async () => {
      const mockBody: any = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<b>Hello</b>',
        attachments: [],
      };

      await expect(controller.sendEmail(mockBody)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if attachments are undefined', async () => {
      const mockBody: any = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<b>Hello</b>',
       
      };

      await expect(controller.sendEmail(mockBody)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if attachments is not an array', async () => {
      const mockBody: any = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<b>Hello</b>',
        attachments: 'not-an-array',
      };

      await expect(controller.sendEmail(mockBody)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
