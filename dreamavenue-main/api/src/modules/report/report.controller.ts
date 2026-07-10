import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  Get,
  Render,
  Query,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsArray, IsDefined, IsObject } from 'class-validator';
import puppeteer from 'puppeteer';
import { setTimeout } from 'node:timers/promises';
import { BaseController } from '../common/base.controller';
import { PropertyService } from '../property/property.service';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RentcastService } from '../analysis/rentcast.service';

export class GenerateReportDto {
  @IsDefined()
  @IsArray()
  sections: string[];

  @IsDefined()
  @IsObject()
  id: string;
}

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth('access-token')
export class ReportController extends BaseController {
  constructor(
    @Inject(REQUEST) private currenRequest: Request,
    private readonly reportService: ReportService,
    private readonly newJwtService: JwtService,
    private readonly propertyService: PropertyService,
    private readonly rentCastService: RentcastService,
  ) {
    super(currenRequest, newJwtService);
  }

  @Post('html')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GenerateReportDto })
  @ApiResponse({ status: 200, description: 'HTML report generated.' })
  async generateHtml(
    @Body() body: GenerateReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const property = await this.getContextInfo(body.id);
    if (!body.sections.includes('section2')) {
      body.sections.unshift('section2');
    }
    if (!body.sections.includes('section1')) {
      body.sections.unshift('section1');
    }
    const html = await this.reportService.generateReport(
      body.sections,
      property,
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Post('pdf')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GenerateReportDto })
  @ApiResponse({ status: 200, description: 'PDF report generated.' })
  @Post('pdf')
  @HttpCode(200)
  async generatePdf(
    @Body() body: { sections: string[]; id: any },
    @Res() res: Response,
  ) {
    const property = await this.getContextInfo(body.id);

    if (!body.sections.includes('section2')) {
      body.sections.unshift('section2');
    }
    if (!body.sections.includes('section1')) {
      body.sections.unshift('section1');
    }
    const html = await this.reportService.generateReport(
      body.sections,
      property,
    );
    const pdf = await this.reportService.exportToPdf(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }

  @Get('preview')
  @Render('report-preview')
  async getPreview(
    @Query('sections') sectionsQuery: string,
    @Query('id') propertyId: string,
  ) {
    const sections = sectionsQuery.split(',');
    if (!sections.includes('section2')) {
      sections.unshift('section2');
    }
    if (!sections.includes('section1')) {
      sections.unshift('section1');
    }
    const property = await this.getContextInfo(propertyId);
    const content = await this.reportService.renderSections(sections, property);
    return { content, property };
  }

  private async getContextInfo(propertyId: string) {
    const propertyDetails =
      await this.propertyService.getPropertyDetails(propertyId);
    if (
      propertyDetails // &&
      // propertyDetails.userId == this.getUserIdFromToken()
    ) {
      propertyDetails.sourceData =
        await this.rentCastService.getPropertyDataByAddressOrUniqueId(
          propertyDetails.full_address || propertyDetails.title,
          null,
        );
      return propertyDetails;
    }
    return null;
  }
}
