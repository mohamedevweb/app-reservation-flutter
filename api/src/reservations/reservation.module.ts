import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservation.service';
import { User } from 'src/users/entities/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Reservation, User])],
    controllers: [ReservationsController],
    providers: [ReservationsService],
    exports: [ReservationsService],
})
export class ReservationsModule { }