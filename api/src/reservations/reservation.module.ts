import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservation.service';
import { ReservationsController } from './reservation.controller';
import { Reservation } from './entites/reservation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationsController],
    providers: [ReservationsService],
    exports: [ReservationsService],
})
export class ReservationsModule { }