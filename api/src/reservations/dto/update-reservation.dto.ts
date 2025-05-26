import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '../entites/reservation.entity';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;

    @IsOptional()
    @IsString()
    adminNotes?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    tableNumber?: number;
}