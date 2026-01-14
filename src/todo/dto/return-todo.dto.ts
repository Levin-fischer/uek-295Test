import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ReturnTodoDto {
  @ApiProperty({ description: 'The unique identifier of the todo', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    description: 'The title of the todo',
    example: 'M295 Projekt',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'A detailed description of the task',
    example: 'DTOs und Entities für die Prüfung erstellenss',
    required: false,
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Status whether the todo is completed',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed!: boolean;

  @ApiProperty({ example: new Date() })
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @ApiProperty({ example: new Date() })
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;

  @ApiProperty({
    description: 'ID of the user who created this todo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  createdById!: number;

  @ApiProperty({
    description: 'ID of the user who last updated this todo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  updatedById!: number;
}
