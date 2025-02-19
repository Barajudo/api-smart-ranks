import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
