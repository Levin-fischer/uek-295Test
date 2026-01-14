import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
})
export class TodoModule {}
