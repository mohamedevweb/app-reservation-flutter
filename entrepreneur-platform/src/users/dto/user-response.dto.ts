// src/users/dto/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  role: string;

  @Expose()
  interests: any[];

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
