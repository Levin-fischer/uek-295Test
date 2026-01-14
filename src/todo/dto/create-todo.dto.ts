import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(1000)
  description: string;
}
