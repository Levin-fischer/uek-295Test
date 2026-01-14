import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { TodoEntity } from './todo/entities/todo.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.userRepo.count();
    if (existing > 0) {
      this.logger.log('Seed skipped (users already exist)');
      return;
    }

    const admin = this.userRepo.create({
      username: 'admin',
      email: 'admin@local.test',
      password: await argon2.hash('admin'),
      isAdmin: true,
    });

    const user = this.userRepo.create({
      username: 'user',
      email: 'user@local.test',
      password: await argon2.hash('user'),
      isAdmin: false,
    });

    await this.userRepo.save([admin, user]);

    const todos = [
      this.todoRepo.create({
        user: admin,
        title: 'Open admin',
        description: 'Example of an open admin todo',
        isClosed: false,
      }),
      this.todoRepo.create({
        user: admin,
        title: 'Closed admin',
        description: 'Example of a closed admin todo',
        isClosed: true,
      }),
      this.todoRepo.create({
        user,
        title: 'Open user',
        description: 'Example of an open user todo',
        isClosed: false,
      }),
      this.todoRepo.create({
        user,
        title: 'Closed user',
        description: 'Example of a closed user todo',
        isClosed: true,
      }),
    ];

    await this.todoRepo.save(todos);

    this.logger.log('Seed done (2 users, 4 todos)');
  }
}
