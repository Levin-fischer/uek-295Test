import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoAdminDto } from './dto/update-todo-admin.dto';

describe('TodoService', () => {
  let service: TodoService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOneBy: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };
  const mockTodo: TodoEntity = {
    id: 1,
    title: 'Test Todo Title',
    description: 'Test Description',
    isClosed: false,
    createdById: 1,
    updatedById: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repo = module.get(getRepositoryToken(TodoEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------- create ----------
  it('should create and save a todo', async () => {
    const dto: CreateTodoDto = {
      title: 'Valid Todo Title',
      description: 'Desc',
    };

    repo.create.mockReturnValue(mockTodo);
    repo.save.mockResolvedValue(mockTodo);

    const result = await service.create(100, 1, dto);

    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      createdById: 1,
      updatedById: 1,
      isClosed: false,
    });
    expect(repo.save).toHaveBeenCalledWith(mockTodo);
    expect(result).toBe(mockTodo);
  });

  // ---------- findAll ----------
  it('should return all todos for admin', async () => {
    repo.find.mockResolvedValue([mockTodo]);

    const result = await service.findAll(100, 1, true);

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockTodo]);
  });

  it('should return only open todos of user if not admin', async () => {
    repo.find.mockResolvedValue([mockTodo]);

    const result = await service.findAll(100, 1, false);

    expect(repo.find).toHaveBeenCalledWith({
      where: { createdById: 1, isClosed: false },
    });
    expect(result).toEqual([mockTodo]);
  });

  // ---------- findOne ----------
  it('should return todo if found and admin', async () => {
    repo.findOneBy.mockResolvedValue(mockTodo);

    const result = await service.findOne(100, 1, 99, true);

    expect(result).toBe(mockTodo);
  });

  it('should throw NotFoundException if todo not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(100, 99, 1, true)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException if user is not owner and not admin', async () => {
    repo.findOneBy.mockResolvedValue(mockTodo);

    await expect(service.findOne(100, 1, 999, false)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  // ---------- update ----------
  it('should update todo as admin', async () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: true };

    repo.findOneBy.mockResolvedValueOnce(mockTodo).mockResolvedValueOnce({
      ...mockTodo,
      isClosed: true,
      updatedById: 2,
    });

    repo.update.mockResolvedValue(undefined as any);

    const result = await service.update(100, 1, updateDto, 2, true);

    expect(repo.update).toHaveBeenCalledWith(1, {
      isClosed: true,
      updatedById: 2,
    });
    expect(result.isClosed).toBe(true);
    expect(result.updatedById).toBe(2);
  });

  it('should throw ForbiddenException if non-admin tries to set isClosed=false', async () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: false };

    await expect(
      service.update(100, 1, updateDto, 1, false),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should throw NotFoundException if todo not found after update', async () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: true };

    repo.findOneBy.mockResolvedValueOnce(mockTodo).mockResolvedValueOnce(null);

    repo.update.mockResolvedValue(undefined as any);

    await expect(
      service.update(100, 1, updateDto, 1, true),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  // ---------- remove ----------
  it('should remove todo and return it with updatedById', async () => {
    repo.findOneBy.mockResolvedValue(mockTodo);
    repo.remove.mockResolvedValue(mockTodo);

    const result = await service.remove(100, 1, 5);

    expect(repo.remove).toHaveBeenCalledWith(mockTodo);
    expect(result.updatedById).toBe(5);
  });
  it('should allow non-admin to close todo (isClosed = true)', async () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: true };

    repo.findOneBy
      .mockResolvedValueOnce(mockTodo) // findOne inside update
      .mockResolvedValueOnce({
        ...mockTodo,
        isClosed: true,
        updatedById: 1,
      });

    repo.update.mockResolvedValue(undefined as any);

    const result = await service.update(
      100,
      1,
      updateDto,
      1,
      false, // non-admin
    );

    expect(repo.update).toHaveBeenCalledWith(1, {
      isClosed: true,
      updatedById: 1,
    });

    expect(result.isClosed).toBe(true);
  });
  it('should allow admin to update todo with isClosed = false (short-circuit branch)', async () => {
    const updateDto: UpdateTodoAdminDto = { isClosed: false };

    repo.findOneBy.mockResolvedValueOnce(mockTodo).mockResolvedValueOnce({
      ...mockTodo,
      isClosed: false,
      updatedById: 99,
    });

    repo.update.mockResolvedValue(undefined as any);

    const result = await service.update(
      100,
      1,
      updateDto,
      99,
      true, // admin
    );

    expect(repo.update).toHaveBeenCalledWith(1, {
      isClosed: false,
      updatedById: 99,
    });

    expect(result.isClosed).toBe(false);
  });
  it('should allow non-admin to access own todo', async () => {
    const ownTodo: TodoEntity = {
      ...mockTodo,
      createdById: 1,
    };

    repo.findOneBy.mockResolvedValue(ownTodo);

    const result = await service.findOne(
      100,
      1,
      1, // userId = createdById
      false, // non-admin
    );

    expect(result).toBe(ownTodo);
  });
});
