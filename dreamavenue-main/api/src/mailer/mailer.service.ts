import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { SendEmailDTO } from './email.dto';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) { }

  // Method to send an email
  async sendMail(emailDto: SendEmailDTO) {
    try {
      const response = await this.mailerService.sendMail({
        to: emailDto.to,
        subject: emailDto.subject,
        text: emailDto.plainText,
        html: emailDto.html,
        cc: emailDto.cc,
        bcc: emailDto.bcc,
        from: emailDto.from,
        replyTo: emailDto.replyTo,
        template: emailDto.template,
        context: {
          username: emailDto.username,
          inviteLink: emailDto.inviteLink,
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
      throw new Error('Failed to send email');
    }
  }
}