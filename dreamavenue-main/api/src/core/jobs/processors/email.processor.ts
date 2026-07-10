import { MailerService } from '../../../mailer/mailer.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as jwt from 'jsonwebtoken';
import { SendEmailDTO } from 'src/mailer/email.dto';

@Processor('email')
export class EmailProcessor {
  constructor(private readonly mailerService: MailerService) { }

  @Process('send')
  async handleSend(job: Job) {
    const { to, subject, content } = job.data;
    console.log(`Sending email to ${to}-${subject}-${content}`);
    await this.mailerService.sendMail({} as SendEmailDTO);
  }

  @Process('sendWelcomeEmail')
  async sendWelcomeEmail(emailDto: SendEmailDTO) {
    const email = emailDto.userEmail;
    const inviteLinkToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    emailDto.subject = emailDto.subject ? emailDto.subject : 'Welcome to Dream Avenue';
    emailDto.inviteLink = `${process.env.APP_PATH}/auth/verifyEmail?token=${inviteLinkToken}`;
    emailDto.template = 'welcome-email.hbs';
    await this.mailerService.sendMail(emailDto);
  }

  @Process('resetPasswordEmail')
  async resetPasswordEmail(emailDto: SendEmailDTO) {
    const email = emailDto.userEmail;
    const resetPasswordToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    emailDto.subject = emailDto.subject ? emailDto.subject : 'Reset Your Password';
    emailDto.inviteLink = `${process.env.APP_PATH}/auth/resetPasswordRender?token=${resetPasswordToken}`;
    emailDto.template = 'resetpassword-email.hbs';
    await this.mailerService.sendMail(emailDto);
  }
}