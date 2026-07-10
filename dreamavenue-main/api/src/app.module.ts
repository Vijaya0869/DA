import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';
import { MasterModule } from './modules/master/master.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { MasterDataService } from './modules/common/master-data-service';
import { DataSource } from 'typeorm';
import KeyvRedis, { Keyv } from '@keyv/redis';
import * as process from 'node:process';
import { BullMqModule } from './modules/queue/bullmq.module';
import { QueueService } from './modules/queue/queue.service';
import { PropertyQueueProcessor } from './modules/queue/queue.processor';
import { LogViewerController } from './modules/log-viewer/log-viewer.controller';
import { LogViewerAuthMiddleware } from './core/logger/log-viewer-auth.middleware';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { StaticModule } from './static/static.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  controllers: [AppController, LogViewerController],
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    UserModule,
    PropertyModule,
    MasterModule,
    BullMqModule,
    AnalysisModule,
    StaticModule,
    ReportModule,
    CacheModule.register({
      store: new Keyv({
        store: new KeyvRedis(
          `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
        ), // Use correct Redis URL
      }),
      ttl: 60, // Cache expiry in seconds
    }),
  ],
  providers: [
    AppService,
    {
      provide: MasterDataService,
      useFactory: (dataSource: DataSource) => new MasterDataService(dataSource),
      inject: [DataSource],
    },
    QueueService,
    PropertyQueueProcessor,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogViewerAuthMiddleware)
      .forRoutes('/log-viewer', '/log-viewer.html');
  }
}
