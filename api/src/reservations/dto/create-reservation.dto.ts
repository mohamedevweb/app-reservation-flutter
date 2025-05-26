import { IsString, IsEmail, IsPhoneNumber, IsDateString, IsEnum, IsNumber, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
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

    @IsNumber()
    @Min(1)
    @Max(20)
    @Transform(({ value }) => parseInt(value))
    numberOfGuests: number;

    @IsOptional()
    @IsString()
    specialRequests?: string;

    @IsOptional()
    userId?: number;
}