// src/user/dto/update-user-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

// special Admin datatype
export class UpdateUserAdminDto {
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  @IsNotEmpty()
  isAdmin!: boolean;
}
