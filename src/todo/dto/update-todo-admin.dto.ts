import { IsBoolean } from 'class-validator';

export class UpdateTodoAdminDto {
  @IsBoolean()
  isClosed: boolean;
}
