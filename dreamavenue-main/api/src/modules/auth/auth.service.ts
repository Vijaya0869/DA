import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDTO } from 'src/mailer/email.dto';

interface SocialProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
  provider: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,

  ) { }

  async validateLocalUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async registerLocal(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const user = await this.userRepository.save({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      passwordHash,
      provider: 'local',
    });

    // Generate token
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword as User };
  }
  async validateOAuthLogin(
    profile: SocialProfile,
  ): Promise<{ accessToken: string; user: User }> {
    let user = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await this.userRepository.save({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
        provider: profile.provider,
      });
    } else {
      // Update existing user's information
      await this.userRepository.update(user.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
      });
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async validateUser(payload: any): Promise<User> {
    return this.userRepository.findOne({
      where: { id: payload.userId },
    });
  }

  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async validateCurrentPassword(email: string, enteredPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      return null;
    }
    const storedHash = user.passwordHash;
    const isPasswordValid = await bcrypt.compare(enteredPassword, storedHash);
    return isPasswordValid ? user : null;
  }

  async updateUser(user: User): Promise<User> {
    const updateResult = await this.userRepository.update({ id: user.id }, user);
    if (updateResult.affected === 0) {
      throw new UnauthorizedException('Failed to update user');
    }
    return user;
  }

  async getUserDetailsByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async getUserDetailsByVerificationKey(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { verification_key: email },
    });
  }

  async sendMail(emailDto: SendEmailDTO) {
    await this.mailerService.sendMail(emailDto);
  }
}
