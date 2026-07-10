import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('log-viewer')
export class LogViewerController {
  @Get()
  getLogs(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const logPath = path.join(
      __dirname,
      process.env.IS_BUILD ? '../../../logs' : '../../../../logs',
    );
    const files = fs.readdirSync(logPath).filter((f) => f.endsWith('.log'));
    const latestFile = files.sort().reverse()[0];

    if (!latestFile) return [];

    const data = fs.readFileSync(path.join(logPath, latestFile), 'utf8');
    const lines = data.split('\n').filter((line) => line.trim() !== '');
    let logs = lines.map((line) => JSON.parse(line)).reverse();

    if (q) {
      logs = logs.filter((log) =>
        JSON.stringify(log).toLowerCase().includes(q.toLowerCase()),
      );
    }

    const start = (page - 1) * limit;
    const paginated = logs.slice(start, start + +limit);

    return {
      total: logs.length,
      page: +page,
      limit: +limit,
      data: paginated,
    };
  }
}
