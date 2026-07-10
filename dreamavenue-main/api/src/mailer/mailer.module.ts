import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST, // SMTP host (Sendinblue)
        port: process.env.SMTP_PORT, // Port for sending email
        secure: false, // use TLS/SSL
        auth: {
          user: process.env.SMTP_USER, // SMTP user (Your email)
          pass: process.env.SMTP_PASSWORD, // SMTP password
        },
      },
      defaults: {
        from: process.env.SMTP_DEFAULT_FROM, // Default sender email address
      },
      template: {
        dir: path.join(__dirname, '../../', 'templates'), // dist/templates
        adapter: new HandlebarsAdapter(), // Using Handlebars as the template engine
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule { }