import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { SeedService } from './seed.service';

import { UserEntity } from './user/entities/user.entity';
import { TodoEntity } from './todo/entities/todo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_DATABASE') ?? 'data/todo.db',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // WICHTIG: damit SeedService Repositories injizieren kann
    TypeOrmModule.forFeature([UserEntity, TodoEntity]),

    UserModule,
    TodoModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
