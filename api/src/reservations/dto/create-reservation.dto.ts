import {
    IsString,
    IsEmail,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    Min,
    Max,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TimeSlot } from '../entities/reservation.entity';

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsEmail()
    customerEmail: string;

    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @IsDateString()
    reservationDate: string;

    @IsEnum(TimeSlot)
    timeSlot: TimeSlot;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(20)
    numberOfGuests: number;

    @IsOptional()
    @IsString()
    specialRequests?: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
}
  