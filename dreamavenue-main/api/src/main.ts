import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TelemetryService } from './monitoring/telemetry.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';
import { HttpLoggerMiddleware } from './core/logger/http-logger.middleware';
import { AllExceptionsFilter } from './core/filters/http-exception.filter';
import { HandlebarsFormatHelper } from './modules/common/helpers/handlebars.helper';
import * as expressHandlebars from 'express-handlebars';

async function bootstrap() {
  // Initialize OpenTelemetry
  TelemetryService.init();

  // const app = await NestFactory.create(AppModule); // Introduce hbs Package modified below line
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const hbs = expressHandlebars.create({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      json: (context) => JSON.stringify(context),
    },
  });
  new HandlebarsFormatHelper();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all  common methods
    allowedHeaders: '*', // Allow all headers
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Implicitly converts query strings to numbers
      },
    }),
  );

  app.use(new HttpLoggerMiddleware().use);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: '*', // Or specify your frontend URL
    methods: 'GET, ,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization, Content-Type',
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .setDescription('The NestJS Starter API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // This is the name of the security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.getHttpAdapter().get('/swagger.json', (req, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document));
  });

  // Redirect the root URL ("/") to the Swagger UI
  app.getHttpAdapter().get('/', (req, res: Response) => {
    res.redirect('/api'); // Redirect to Swagger UI
  });
  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
