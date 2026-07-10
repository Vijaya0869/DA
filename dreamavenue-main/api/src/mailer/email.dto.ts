import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendEmailDTO {

    @IsString()
    @ApiProperty({
        description: 'Recipient\'s email address',
        type: String,
        required: true,
    })
    to: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Subject of the email',
        type: String,
    })
    subject: string;

    @IsString()
    @ApiProperty({
        description: 'Username of the person receiving the email',
        type: String,
        required: true,
    })
    username: string;

    @IsString()
    @ApiProperty({
        description: 'Email address of the user receiving the email',
        type: String,
        required: true,
    })
    userEmail: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The invite or verification link (JWT token-based or any other)',
        type: String,
        required: false,
    })
    inviteLink: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'CC (Carbon Copy) recipients',
        type: String,
        required: false,
    })
    cc?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'BCC (Blind Carbon Copy) recipients',
        type: String,
        required: false,
    })
    bcc?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'From email address (optional)',
        type: String,
        required: false,
    })
    from?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Reply-to email address (optional)',
        type: String,
        required: false,
    })
    replyTo?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'HTML content of the email (optional)',
        type: String,
        required: false,
    })
    html?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Plain text content of the email (optional)',
        type: String,
        required: false,
    })
    plainText?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The email template name (optional)',
        type: String,
        required: false,
    })
    template?: string;
}