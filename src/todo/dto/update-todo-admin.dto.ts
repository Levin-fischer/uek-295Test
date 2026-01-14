import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTodoAdminDto {
  @ApiProperty({
    description: 'Markiert das To-Do als erledigt (true) oder offen (false)',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed!: boolean;
}
