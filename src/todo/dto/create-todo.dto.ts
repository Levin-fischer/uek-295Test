import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'M295 Projekt abschliessen' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  title!: string;

  @ApiProperty({
    example: 'Alle DTOs und Entities implementieren',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
