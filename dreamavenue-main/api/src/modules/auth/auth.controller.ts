import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Render,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import * as process from 'node:process';
import { trimEndSlash } from '../common/util';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { SendEmailDTO } from 'src/mailer/email.dto';
import * as crypto from 'crypto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerLocal(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    // AuthGuard validates credentials and adds user to request
    return {
      accessToken: this.authService.generateToken(req.user),
      user: req.user,
    };
  }

  @Get('google')
  @ApiOperation({ summary: 'Initialize Google OAuth login' })
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    // Redirects to Facebook login page
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const accessToken = this.authService.generateToken(req.user);

    // Redirect to frontend with token
    // You should replace this URL with your frontend URL
    const frontEndUrl = trimEndSlash(process.env.FRONTEND_URL);
    res.redirect(`${frontEndUrl}/parseToken?token=${accessToken}`);
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: any, @Res() res: Response) {
    const accessToken = this.authService.generateToken(req.user);

    // Redirect to frontend with token
    // You should replace this URL with your frontend URL
    const frontEndUrl = trimEndSlash(process.env.FRONTEND_URL);
    res.redirect(`${frontEndUrl}/parseToken?token=${accessToken}`);
  }

  @Post('send_welcome_email')
  @ApiOperation({ summary: 'Send a welcome email with JWT token for verification' })
  async sendWelcomeEmail(@Body() emailDto: SendEmailDTO) {
    const email = emailDto.userEmail;
    const user = await this.authService.getUserDetailsByEmail(emailDto.userEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      emailDto.username = emailDto.username ? emailDto.username : `${user.firstName} ${user.lastName}`;
    }
    const inviteLinkToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    emailDto.subject = emailDto.subject ? emailDto.subject : 'Welcome to Dream Avenue';
    emailDto.from = emailDto.from ? emailDto.from : process.env.SMTP_DEFAULT_FROM;
    emailDto.inviteLink = `${process.env.APP_PATH}/auth/verify_email?token=${inviteLinkToken}`;
    emailDto.template = 'welcome-email.hbs';
    await this.authService.sendMail(emailDto);
  }


  @Post('send_reset_password_email')
  @ApiOperation({ summary: 'Send reset password email with JWT token' })
  async sendResetPasswordEmail(@Body() emailDto: SendEmailDTO) {
    const verificationKey = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = jwt.sign({ verificationKey }, process.env.JWT_SECRET, { expiresIn: '24h' });
    emailDto.subject = emailDto.subject ? emailDto.subject : 'Reset Your Password';
    emailDto.from = emailDto.from ? emailDto.from : process.env.SMTP_DEFAULT_FROM;
    emailDto.inviteLink = `${process.env.APP_PATH}/auth/reset_password_render?token=${resetPasswordToken}`;
    emailDto.template = 'resetpassword-email.hbs';

    const user = await this.authService.getUserDetailsByEmail(emailDto.userEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      emailDto.username = emailDto.username ? emailDto.username : `${user.firstName} ${user.lastName}`;
      user.verification_key = verificationKey;
      await this.authService.updateUser(user);
    }
    await this.authService.sendMail(emailDto);
  }

  @ApiExcludeEndpoint()
  @Get('verify_email')
  @ApiOperation({ summary: 'Verify user email using JWT token' })
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    let decodedEmail: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
      decodedEmail = decoded.email;
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }
    const user = await this.authService.getUserDetailsByEmail(decodedEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.is_verified) {
      throw new HttpException('Email is already verified', HttpStatus.BAD_REQUEST);
    }
    user.is_verified = true;
    await this.authService.updateUser(user);
    return res.redirect(process.env.FRONTEND_URL);
  }

  @ApiExcludeEndpoint()
  @Get('reset_password_render')
  @Render('resetPassword')
  async resetPasswordRender(@Query('token') token: string) {
    let verificationKey: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { verificationKey: string };
      verificationKey = decoded.verificationKey;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
    const user = await this.authService.getUserDetailsByVerificationKey(verificationKey);
    if (!user) {
      throw new HttpException('User not found or token is expired', HttpStatus.NOT_FOUND);
    }
    return { email: user.email, redirectUrl: process.env.APP_PATH };
  }

  @ApiExcludeEndpoint()
  @Post('reset_password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.authService.validateCurrentPassword(resetPasswordDto.email, resetPasswordDto.currentpassword);
    if (user) {
      const passwordHash = await bcrypt.hash(resetPasswordDto.newpassword, 10);
      user.passwordHash = passwordHash;
      user.verification_key = null;
      await this.authService.updateUser(user);
      return { message: 'Password Reset successful', type: 'success', redirectUrl: process.env.FRONTEND_URL };
    } else {
      return { message: 'Current Password is Invalid credentials, Correct your password and try again', type: 'error' };
    }
  }
}