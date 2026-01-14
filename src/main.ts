// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as yaml from 'yaml';
import { AppModule } from './app.module';
import { HttpMetaInterceptor } from './interceptors/http-meta-interceptor.service.interceptor';
import { globalPrefix, version } from './informations';
import { swaggerInfo } from './informations';
import { TodoEntity } from './todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  // Wir erstellen die NestJS-Anwendung basierend auf dem App-Modul.
  const app = await NestFactory.create(AppModule);
  const todoRepo = app.get<Repository<TodoEntity>>(
    getRepositoryToken(TodoEntity),
  );
  const configService = app.get(ConfigService);

  // Wir lesen den Port aus den Umgebungsvariablen aus, standardmäßig verwenden wir Port 3000.
  const port = configService.get<number>('PORT') || 3001;

  // interceptor statt middleware
  app.useGlobalInterceptors(new HttpMetaInterceptor());
  // globalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await createInitialTodos(todoRepo);

  // globalPrefix
  app.setGlobalPrefix(globalPrefix);

  // openApi setup
  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setContact(
      swaggerInfo.author.name,
      swaggerInfo.author.url,
      swaggerInfo.author.email,
    )
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // ✅ Spec-Endpunkte immer verfügbar
  app.use(`/${swaggerInfo.docPath}-json`, (_req: Request, res: Response) =>
    res.json(document),
  );
  app.use(`/${swaggerInfo.docPath}-yaml`, (_req: Request, res: Response) => {
    res.type('text/yaml').send(yaml.stringify(document));
  });

  SwaggerModule.setup(swaggerInfo.docPath, app, document);

  // Wir lassen die Anwendung auf dem definierten Port lauschen.
  await app.listen(port);

  // Wir verwenden den nestjs Logger, um eine Startmeldung auszugeben. Als zweiter Parameter wird der Kontext 'Bootstrap' übergeben.
  Logger.log(`NEST application successfully started`, bootstrap.name);
  Logger.debug(
    `Server in version: ${swaggerInfo.docPath} ist jetzt erreichbar unter http://localhost:${port}`,
    bootstrap.name,
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter http://localhost:${port}/${swaggerInfo.docPath}`,
    bootstrap.name,
  );
  async function createInitialTodos(todoRepo: Repository<TodoEntity>) {
    const now = new Date();

    const todos = [
      {
        title: 'OpenAdmin',
        description: 'Example of an open admin todo',
        isClosed: false,
        createdById: 1,
        updatedById: 1,
      },
      {
        title: 'ClosedAdmin',
        description: 'Example of a closed admin todo',
        isClosed: true,
        createdById: 1,
        updatedById: 1,
      },
      {
        title: 'OpenUser',
        description: 'Example of an open user todo',
        isClosed: false,
        createdById: 2,
        updatedById: 2,
      },
      {
        title: 'ClosedUser',
        description: 'Example of a closed user todo',
        isClosed: true,
        createdById: 2,
        updatedById: 2,
      },
    ];

    for (const todo of todos) {
      const todoEntity = todoRepo.create({
        title: todo.title,
        description: todo.description,
        isClosed: todo.isClosed,
        createdAt: now,
        updatedAt: now,
        createdById: todo.createdById,
        updatedById: todo.updatedById,
      });

      await todoRepo.save(todoEntity);
    }
  }
}
bootstrap().catch((err) => console.error(err));
