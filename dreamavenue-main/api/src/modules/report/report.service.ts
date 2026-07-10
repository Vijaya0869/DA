import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ReportService {
  private templatesPath = path.join(
    __dirname,
    '../../../modules/report',
    'templates',
  );

  async renderSection(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
    const raw = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(raw);
    return compiled(context);
  }

  async generateReport(sections: string[], context: any): Promise<string> {
    const combinedContent = await this.renderSections(sections, context);
    const baseTemplatePath = path.join(this.templatesPath, 'base.hbs');
    const baseRaw = await fs.readFile(baseTemplatePath, 'utf-8');
    const baseCompiled = Handlebars.compile(baseRaw);
    return baseCompiled({ content: combinedContent, context });
  }

  async renderSections(sections: string[], context: any): Promise<string> {
    let combinedContent = '';
    for (const section of sections) {
      const sectionHtml = await this.renderSection(section, context);
      combinedContent += sectionHtml;
    }
    return combinedContent;
  }

  async exportToPdf(html: string): Promise<any> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.setViewport({
      width: 800,
      height: 600,
    });
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 1, right: 1, bottom: 1, left: 1 },
    });
    await browser.close();
    return pdf;
  }
}
