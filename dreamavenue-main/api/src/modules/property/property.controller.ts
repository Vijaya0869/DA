import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchCriteria } from '../../core/database/search.criteria';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseController } from '../common/base.controller';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import * as process from 'node:process';
import { CreateCostsDto } from './dto/create-costs.dto';
import * as fs from 'node:fs';
import { PropertySearchCriteria } from './dto/property-search-criteria';
import { QueueService } from '../queue/queue.service';
import { UpdateFinancingDto } from './dto/update-financing.dto';
import { CreateFinancingDto } from './dto/create-financing-dto';
import * as XLSX from 'xlsx/xlsx';
import { CreateRehabCostsDto } from './dto/create-rehab-costs.dto';
import { use } from 'passport';
@ApiTags('property')
@Controller('property')
@ApiBearerAuth('access-token')
export class PropertyController extends BaseController {
  constructor(
    @Inject(REQUEST) private currenRequest: Request,
    private readonly propertyService: PropertyService,
    private readonly newJwtService: JwtService,
    private readonly queueService: QueueService,
  ) {
    super(currenRequest, newJwtService);
  }

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    createPropertyDto.userId = this.getUserIdFromToken().toString();
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  async findAll(@Query() criteria: PropertySearchCriteria) {
    criteria.filters = criteria.filters || {};
    criteria.filters['"userId"'] = this.getUserIdFromToken();
    if (criteria.investmentStrategy) {
      criteria.filters['investment_strategy_id'] = criteria.investmentStrategy;
    }
    const properties = await this.propertyService.findMany(criteria);
    return [
      await this.propertyService.massageThumbnailImage(properties[0]),
      properties[1],
    ];
  }

  @Get('pull-property-details')
  async pullPropertyDetails(@Query('address') address: string) {
    const userId = this.getUserIdFromToken();
    const property = await this.propertyService.pullPropertyDetails(address);
    property.userId = userId;
    return property;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const prop = await this.propertyService.findOne(id);
    if (prop && prop.userId == this.getUserIdFromToken()) {
      return (await this.propertyService.massageThumbnailImage([prop]))[0];
    }
    return null;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.delete(id);
  }

  @Post('purchase-costs')
  @ApiBody({ type: [CreateCostsDto] })
  createPurchaseCosts(@Body() costsDto: CreateCostsDto[]) {
    return this.propertyService.createPurchaseCosts(costsDto);
  }

  @Get('details/:id')
  async getPropertyDetails(@Param('id') id: string) {
    const prop = await this.propertyService.getPropertyDetails(id);
    // if (prop && prop.userId == this.getUserIdFromToken()) {
    return prop;
    // }
    //  return null;
  }

  @Get('purchase-costs/:property_id')
  getPurchaseCosts(@Param('property_id') property_id: string) {
    return this.propertyService.getPurchaseCosts(property_id);
  }

  @Delete(':property_id/purchase-costs/:id')
  removePurchaseCosts(
    @Param('property_id') property_id: string,
    @Param('id') ids: string[],
  ) {
    return this.propertyService.removePurchaseCosts(property_id, ids);
  }

  @Delete(':property_id/selling-costs/:id')
  removeSellingCosts(
    @Param('property_id') property_id: string,
    @Param('id') ids: string[],
  ) {
    return this.propertyService.removeSellingCosts(property_id, ids);
  }

  @Delete(':property_id/closing-costs/:id')
  removeClosingCosts(
    @Param('property_id') property_id: string,
    @Param('id') ids: string[],
  ) {
    return this.propertyService.removeClosingCosts(property_id, ids);
  }

  @Delete(':property_id/rehab-costs/:id')
  removeRehabCosts(
    @Param('property_id') property_id: string,
    @Param('id') ids: string[],
  ) {
    return this.propertyService.removeRehabCosts(property_id, ids);
  }

  @Delete(':property_id/holding-costs/:id')
  removeHoldingCosts(
    @Param('property_id') property_id: string,
    @Param('id') ids: string[],
  ) {
    return this.propertyService.removeHoldingCosts(property_id, ids);
  }

  @Post('holding-costs')
  @ApiBody({ type: [CreateCostsDto] })
  createHoldingCosts(@Body() costsDto: CreateCostsDto[]) {
    return this.propertyService.createHoldingCosts(costsDto);
  }

  @Get('holding-costs/:property_id')
  getHoldingCosts(@Param('property_id') property_id: string) {
    return this.propertyService.getHoldingCosts(property_id);
  }

  @Post('rehab-costs')
  @ApiBody({ type: [CreateRehabCostsDto] })
  createRehabCosts(@Body() costsDto: CreateRehabCostsDto[]) {
    return this.propertyService.createRehabCosts(costsDto);
  }

  @Get('rehab-costs/:property_id')
  getRehabCosts(@Param('property_id') property_id: string) {
    return this.propertyService.getRehabCosts(property_id);
  }

  @Post('selling-costs')
  @ApiBody({ type: [CreateCostsDto] })
  createSellingCosts(@Body() costsDto: CreateCostsDto[]) {
    return this.propertyService.createSellingCosts(costsDto);
  }

  @Get('selling-costs/:property_id')
  getSellingCosts(@Param('property_id') property_id: string) {
    return this.propertyService.getSellingCosts(property_id);
  }

  @Post('closing-Costs')
  @ApiBody({ type: [CreateCostsDto] })
  createClosingCosts(@Body() costsDto: CreateCostsDto[]) {
    return this.propertyService.createClosingCosts(costsDto);
  }

  @Get('closing-costs/:property_id')
  getClosingCosts(@Param('property_id') property_id: string) {
    return this.propertyService.getClosingCosts(property_id);
  }

  @Get('documents/:property_id')
  getDocuments(@Param('property_id') property_id: string) {
    return this.propertyService.getDocuments(property_id);
  }

  @Get(':property_id/documents/:id')
  @ApiOperation({ summary: 'Download document' })
  @ApiParam({
    name: 'property_id',
    type: 'string',
    description: 'ID of the property',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the document',
  })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async downloadDocument(
    @Param('property_id') property_id: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.getDocumentUrl(property_id, id);
    if (!fs.existsSync(response.url)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send file as a response
    return res.download(
      response.url,
      `Property_${property_id}_Document_${id}${response.name}`,
    );
  }

  @Get(':property_id/images/:id')
  @ApiOperation({ summary: 'Download document' })
  @ApiParam({
    name: 'property_id',
    type: 'string',
    description: 'ID of the property',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the document',
  })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async downloadImage(
    @Param('property_id') property_id: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.getImageUrl(property_id, id);
    if (!fs.existsSync(response.url)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send file as a response
    return res.download(
      response.url,
      `Property_${property_id}_Document_${id}${response.name}`,
    );
  }

  @Get('images/:property_id')
  getImages(@Param('property_id') property_id: string) {
    return this.propertyService.getImages(property_id);
  }

  @Post('document-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        filename: { type: 'string', example: 'myfile' },
        propertyId: { type: 'string', example: '123' },
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
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/bmp',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.documentEntity',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          console.error(`Rejected file type: ${file.mimetype}`); // ✅ Debugging info
          return cb(null, false); // ✅ Properly reject the file
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('filename') filename: string,
    @Body('propertyId') propertyId: string,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException(
        'Invalid file type. Allowed: DOCX, PDF, JPG, PNG, BMP',
      );
    }
    const dto = new CreateDocumentDto();
    dto.property_id = propertyId;
    dto.user_id = this.getUserIdFromToken();
    dto.url = file.path;
    dto.name = filename;
    await this.propertyService.createDocument(dto);
    return {
      message: 'File uploaded successfully',
      filename,
      propertyId,
      path: file.path,
    };
  }

  @Post('property-image-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        filename: { type: 'string', example: 'myfile' },
        propertyId: { type: 'string', example: '123' },
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
          return cb(null, false); // ✅ Properly reject the file
        }
        cb(null, true);
      },
    }),
  )
  async uploadPropertyImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('filename') filename: string,
    @Body('propertyId') propertyId: string,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException(
        'Invalid file type. Allowed: JPG, PNG, BMP',
      );
    }
    const dto = new CreateDocumentDto();
    dto.property_id = propertyId;
    dto.user_id = this.getUserIdFromToken();
    dto.url = file.path;
    dto.name = filename;
    await this.propertyService.createPropertyImage(dto);
    return {
      message: 'File uploaded successfully',
      filename,
      propertyId,
      path: file.path,
    };
  }

  @Patch('property-update-favorite/:id')
  async updateFavoriteProperty(
    @Param('id') id: string,
    @Query('is_favorite') is_favorite: boolean,
  ) {
    return this.propertyService.updateFavouriteProperty(id, is_favorite);
  }

  @Get('search/favorite')
  getAllfavouriteProperties(@Query() criteria: SearchCriteria) {
    criteria.filters = criteria.filters || {};
    criteria.filters['"userId"'] = this.getUserIdFromToken();
    criteria.filters['"is_favorite"'] = true;
    return this.propertyService.findMany(criteria);
  }

  @Post('add-to-queue')
  @ApiBody({ type: [CreateCostsDto] })
  bulkUpload(@Body() costsDto: CreateCostsDto[]) {
    return this.queueService.addJob(costsDto);
  }

  @Post('financing/create')
  @ApiBody({
    type: [CreateFinancingDto],
    description: 'Array of financing details to create',
  })
  createFinancing(@Body() createFinancingDtos: CreateFinancingDto[]) {
    return this.propertyService.createFinancing(createFinancingDtos);
  }

  @Get('financing/:property_id')
  async getFinancing(@Param('property_id') property_id: string) {
    return await this.propertyService.getFinancing(property_id);
  }

  @Patch('financing/:id')
  @ApiParam({ name: 'id', description: 'ID of the financing to be updated' })
  @ApiExtraModels(CreateFinancingDto)
  @ApiBody({
    schema: { allOf: [{ $ref: getSchemaPath(CreateFinancingDto) }] },
    description: 'Data for updating financing details',
  })
  updateFinancing(
    @Param('id') id: string,
    @Body() updateFinancingDto: UpdateFinancingDto,
  ) {
    return this.propertyService.updateFinancing(id, updateFinancingDto);
  }

  @Delete('financing/:id')
  removeFinancing(@Param('id') id: string) {
    return this.propertyService.deleteFinancing(id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload CSV/Excel file to create properties' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV or Excel file containing property data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPropertyFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileType = file.mimetype;
    if (
      fileType !== 'text/csv' &&
      !fileType.includes('excel') &&
      !fileType.includes('spreadsheet')
    ) {
      throw new BadRequestException('Only CSV or Excel files are allowed');
    }

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        throw new BadRequestException(
          'The file is empty or headers are missing',
        );
      }

      const [rawHeaders, ...rows] = jsonData;
      const headers = rawHeaders.map((header) => header?.toString().trim());

      if (headers.some((header) => !header)) {
        throw new BadRequestException('Invalid or empty headers detected');
      }

      const properties = rows
        .filter((r) => r.length)
        .map((row, rowIndex) => {
          if (row.length !== headers.length) {
            throw new BadRequestException(
              `Row ${rowIndex + 1} has missing or extra columns`,
            );
          }
          const property = {};
          headers.forEach((header, index) => {
            property[header] = row[index]?.toString().trim() || null;
          });
          return property;
        });

      const userId = this.getUserIdFromToken();
      properties.forEach((property) => {
        property.userId = userId;
      });
      await this.propertyService.bulkUpload(properties);

      return { message: 'File uploaded and data inserted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('File upload error:', error);
      throw new InternalServerErrorException(
        'Error processing the file',
        error.message,
      );
    }
  }
}
