import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoEntity } from './entities/todo.entity';
import { UserModule } from '../auth/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), UserModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
