import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches, IsEmail } from 'class-validator';

export class ResetPasswordDto {

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @MinLength(8, {
  //   message: 'Password should be at least 8 characters long',
  // })
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$@#%^&*?])[A-Za-z\d!$@#%^&*?]{8,}$/, {
  //   message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // })
  currentpassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password should be at least 8 characters long',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$@#%^&*?])[A-Za-z\d!$@#%^&*?]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newpassword: string;
}
