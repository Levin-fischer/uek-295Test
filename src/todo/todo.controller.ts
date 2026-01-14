import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ReturnTodoDto } from './dto/return-todo.dto';
import { UpdateTodoAdminDto } from './dto/update-todo-admin.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/user/guards/auth.guard';
import { Request as ExpressRequest } from 'express';
import { IsAdmin, UserId } from '../auth/user/decorators';
import { CorrId } from '../decorators/corr-id.decorator';

interface RequestWithCorr extends ExpressRequest {
  correlationId: string;
  user: { id: number; isAdmin: boolean };
}

@ApiTags('todo')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create todo item' })
  @ApiCreatedResponse({ type: ReturnTodoDto })
  create(
    @Request() req: RequestWithCorr,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    const corrId = Number(req.correlationId);
    const userId = req.user.id;
    return this.todoService.create(corrId, userId, createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all todo items' })
  @ApiOkResponse({ type: ReturnTodoDto, isArray: true })
  @UseGuards(AuthGuard)
  findAll(@Request() req: RequestWithCorr) {
    const corrId = Number(req.correlationId);
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    return this.todoService.findAll(corrId, userId, isAdmin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single todo item by ID' })
  @ApiOkResponse({ type: ReturnTodoDto })
  @UseGuards(AuthGuard)
  findOne(
    @Request() req: RequestWithCorr,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const corrId = Number(req.correlationId);
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    return this.todoService.findOne(corrId, id, userId, isAdmin);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a todo item by ID' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  update(
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoAdminDto: UpdateTodoAdminDto,
  ) {
    return this.todoService.update(
      corrId,
      id,
      updateTodoAdminDto,
      userId,
      isAdmin,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a todo item by ID' })
  remove(
    @Request() req: RequestWithCorr,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    const corrId = Number(req.correlationId);
    const userId = req.user.id;
    return this.todoService.remove(corrId, id, userId);
  }
}
