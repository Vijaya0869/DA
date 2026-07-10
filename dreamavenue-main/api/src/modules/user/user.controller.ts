import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchCriteria } from '../../core/database/search.criteria';
import { UserViewModel } from './dto/user.view-model';
import { UserService } from './user.service';
import { BaseController } from '../common/base.controller';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserViewModelDto } from '../auth/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateUserReportSettingsDto } from './dto/update-user-report-settings.dto';
import { GetUserReportSettings } from './dto/get-user-report-settings.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('access-token')
export class UserController extends BaseController {
  constructor(
    @Inject(REQUEST) private currenRequest: Request,
    private readonly userService: UserService,
    private readonly newJwtService: JwtService,
  ) {
    super(currenRequest, newJwtService);
  }

  @ApiExcludeEndpoint()
  @Get('GetUsersList')
  @ApiOperation({ summary: 'Get users with pagination and search' })
  async getUsers(@Query() criteria: SearchCriteria) {
    const [users, total] = await this.userService.findMany(criteria);
    const getUserId = this.getUserIdFromToken();
    console.log('getUserId', getUserId);
    return {
      data: users.map((user) => UserViewModel.fromEntity(user)),
      total,
      pageNumber: criteria.pageNumber,
      pageSize: criteria.pageSize,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user details' })
  async me() {
    const getUserId = this.getUserIdFromToken();
    const userDetails = await this.userService.findOne(getUserId);
    return UserViewModel.fromEntity(userDetails);
  }

  @Put('update-me')
  @ApiOperation({ summary: 'Update current user details' })
  async updateMe(@Body() updateUserDto: UserViewModelDto) {
    const getUserId = this.getUserIdFromToken();
    const updatedUser = await this.userService.update(getUserId, updateUserDto);
    return UserViewModel.fromEntity(updatedUser);
  }

  @Post('upload-profile-picture')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file too large.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          console.error(`Rejected file type: ${file.mimetype}`); // ✅ Debugging info
          return cb(null, false); // ✅ User reject the file
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException(
        'Invalid file type. Allowed: JPG, PNG, BMP',
      );
    }
    const userId = this.getUserIdFromToken();
    const dto = new UserViewModel();
    dto.picture = file.path;
    const updatedUser = await this.userService.update(userId, dto);
    return {
      message: 'File uploaded successfully',
      userId,
      path: file.path,
    };
  }

  @Get('get-user-tags')
  @ApiOperation({ summary: 'Get current user tags' })
  async getUserTags() {
    const getUserId = this.getUserIdFromToken();
    return this.userService.getUserTags(getUserId);
  }

  @Get('get-user-report-settings')
  @ApiOperation({
    summary: 'Get current user report settings for given report name',
  })
  async getUserReportSettings(@Query() dto: GetUserReportSettings) {
    dto.user_id = this.getUserIdFromToken();
    return this.userService.getUserReportSettings(dto);
  }

  @Post('update-user-report-settings')
  @ApiOperation({
    summary: 'Get current user report settings for given report name',
  })
  async updateUserSettings(@Body() dto: UpdateUserReportSettingsDto) {
    dto.user_id = this.getUserIdFromToken();
    return this.userService.updateUserSettings(dto);
  }
}
