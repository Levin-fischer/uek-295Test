// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // wichtig, wenn wir .env verwenden
    ConfigModule.forRoot({
      isGlobal: true, // wichtig, damit überall verfügbar
    }),

    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      synchronize: true,
      type: 'sqlite',
      database: ':memory:',
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
