import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoAdminDto } from './dto/update-todo-admin.dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async create(
    corrId: number,
    userId: number,
    createTodoDto: CreateTodoDto,
  ): Promise<TodoEntity> {
    this.logger.log(`[${corrId}] Creating todo for user ${userId}`);

    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      createdById: userId,
      updatedById: userId,
      isClosed: false,
    });

    return await this.todoRepository.save(newTodo);
  }

  async findAll(
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<TodoEntity[]> {
    this.logger.log(`[${corrId}] Finding todosss (Admin: ${isAdmin})`);

    if (isAdmin) {
      return await this.todoRepository.find();
    }

    return await this.todoRepository.find({
      where: { createdById: userId, isClosed: false },
    });
  }

  async findOne(
    corrId: number,
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<TodoEntity> {
    this.logger.log(`[${corrId}] Finding todo ${id}`);

    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not foundss`);
    }

    if (!isAdmin && todo.createdById !== userId) {
      throw new ForbiddenException(
        `Todo with ID ${id} not found for this userss`,
      );
    }

    return todo;
  }

  async update(
    corrId: number,
    id: number,
    updateDto: UpdateTodoAdminDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<TodoEntity> {
    this.logger.log(`[${corrId}] Updating todo ${id}`);
    if (!isAdmin && !updateDto.isClosed) {
      throw new ForbiddenException();
    }

    await this.findOne(corrId, id, userId, true);

    await this.todoRepository.update(id, {
      ...updateDto,
      updatedById: userId,
    });

    const updatedTodo = await this.todoRepository.findOneBy({ id });

    if (!updatedTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found after updates`);
    }

    return updatedTodo;
  }

  async remove(
    corrId: number,
    id: number,
    userId: number,
  ): Promise<TodoEntity> {
    this.logger.log(`[${corrId}] Removing todo ${id}`);
    const todo = await this.findOne(corrId, id, userId, true);
    await this.todoRepository.remove(todo);
    todo.updatedById = userId;
    return todo;
  }
}
