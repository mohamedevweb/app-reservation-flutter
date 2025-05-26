import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
    Request,
} from '@nestjs/common';
import { ReservationsService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ReservationStatus, TimeSlot } from './entites/reservation.entity';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    // Endpoints publics
    @Post()
    async create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(createReservationDto);
    }

    @Get('availability/:date')
    async getAvailability(@Param('date') date: string) {
        return this.reservationsService.getAvailableSlots(date);
    }

    @Get('confirmation/:code')
    async findByConfirmationCode(@Param('code') confirmationCode: string) {
        return this.reservationsService.findByConfirmationCode(confirmationCode);
    }

    // Endpoints pour utilisateurs connectés
    @Get('my-reservations')
    @UseGuards(JwtAuthGuard)
    async getMyReservations(
        @Request() req,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Query('status') status?: ReservationStatus,
    ) {
        return this.reservationsService.findAll({
            userId: req.user.id,
            status,
            page,
            limit,
        });
    }

    @Get(':id/user')
    @UseGuards(JwtAuthGuard)
    async findOneForUser(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.reservationsService.findOne(id, req.user.id);
    }

    @Patch(':id/user')
    @UseGuards(JwtAuthGuard)
    async updateForUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateReservationDto: UpdateReservationDto,
        @Request() req,
    ) {
        return this.reservationsService.update(id, updateReservationDto, req.user.id);
    }

    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelReservation(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.reservationsService.cancel(id, req.user.id);
    }

    // Endpoints pour les administrateurs et hôtes
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async findAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 20,
        @Query('status') status?: ReservationStatus,
        @Query('date') date?: string,
    ) {
        return this.reservationsService.findAll({
            status,
            date,
            page,
            limit,
        });
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async getStats() {
        return this.reservationsService.getReservationStats();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateReservationDto: UpdateReservationDto,
    ) {
        return this.reservationsService.update(id, updateReservationDto);
    }

    @Patch(':id/confirm')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async confirm(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.confirm(id);
    }

    @Patch(':id/reject')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.HOST)
    async reject(
        @Param('id', ParseIntPipe) id: number,
        @Body('reason') reason?: string,
    ) {
        return this.reservationsService.reject(id, reason);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.remove(id);
    }

    // Endpoint utilitaire pour obtenir les créneaux horaires disponibles
    @Get('time-slots/available')
    getTimeSlots() {
        return {
            timeSlots: Object.values(TimeSlot),
            description: {
                lunch: Object.values(TimeSlot).filter(slot => slot.startsWith('1')),
                dinner: Object.values(TimeSlot).filter(slot => slot.startsWith('1')),
            }
        };
    }

    // Endpoint pour vérifier la disponibilité avant de créer une réservation
    @Post('check-availability')
    async checkAvailability(@Body() {
        date,
        timeSlot,
        numberOfGuests
    }: {
        date: string;
        timeSlot: TimeSlot;
        numberOfGuests: number;
    }) {
        const isAvailable = await this.reservationsService.checkAvailability(date, timeSlot, numberOfGuests);
        return { available: isAvailable };
    }
}