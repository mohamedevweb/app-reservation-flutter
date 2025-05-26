import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation, ReservationStatus, TimeSlot } from './entites/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
    private readonly maxCapacityPerSlot = 50; // Capacité totale du restaurant
    private readonly maxTableCapacity = 8; // Capacité max par table

    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ) { }

    async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
        const { reservationDate, timeSlot, numberOfGuests } = createReservationDto;

        // Vérifier que la date n'est pas dans le passé
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const requestedDate = new Date(reservationDate);

        if (requestedDate < today) {
            throw new BadRequestException('Cannot make reservations for past dates');
        }

        // Vérifier la disponibilité pour ce créneau
        const isAvailable = await this.checkAvailability(reservationDate, timeSlot, numberOfGuests);
        if (!isAvailable) {
            throw new ConflictException('No availability for this time slot');
        }

        // Générer un code de confirmation unique
        const confirmationCode = this.generateConfirmationCode();

        const reservation = this.reservationRepository.create({
            ...createReservationDto,
            reservationDate: new Date(reservationDate),
            confirmationCode,
            status: ReservationStatus.PENDING,
        });

        return await this.reservationRepository.save(reservation);
    }

    async findAll(filters?: {
        status?: ReservationStatus;
        date?: string;
        userId?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        reservations: Reservation[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { status, date, userId, page = 1, limit = 20 } = filters || {};

        const query = this.reservationRepository.createQueryBuilder('reservation')
            .leftJoinAndSelect('reservation.user', 'user');

        if (status) {
            query.andWhere('reservation.status = :status', { status });
        }

        if (date) {
            const searchDate = new Date(date);
            query.andWhere('DATE(reservation.reservationDate) = DATE(:date)', { date: searchDate });
        }

        if (userId) {
            query.andWhere('reservation.userId = :userId', { userId });
        }

        // Tri par date et heure de réservation
        query.orderBy('reservation.reservationDate', 'DESC')
            .addOrderBy('reservation.timeSlot', 'ASC');

        // Pagination
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const [reservations, total] = await query.getManyAndCount();
        const totalPages = Math.ceil(total / limit);

        return {
            reservations,
            total,
            page,
            totalPages,
        };
    }

    async findOne(id: number, userId?: number): Promise<Reservation> {
        const query = this.reservationRepository.createQueryBuilder('reservation')
            .leftJoinAndSelect('reservation.user', 'user')
            .where('reservation.id = :id', { id });

        // Si un userId est fourni, s'assurer que la réservation appartient à l'utilisateur
        if (userId) {
            query.andWhere('(reservation.userId = :userId OR reservation.userId IS NULL)', { userId });
        }

        const reservation = await query.getOne();

        if (!reservation) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }

        return reservation;
    }

    async findByConfirmationCode(confirmationCode: string): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOne({
            where: { confirmationCode },
            relations: ['user'],
        });

        if (!reservation) {
            throw new NotFoundException(`Reservation with confirmation code ${confirmationCode} not found`);
        }

        return reservation;
    }

    async update(id: number, updateReservationDto: UpdateReservationDto, userId?: number): Promise<Reservation> {
        const reservation = await this.findOne(id, userId);

        // Si la date ou l'heure change, vérifier la disponibilité
        if (updateReservationDto.reservationDate || updateReservationDto.timeSlot || updateReservationDto.numberOfGuests) {
            const newDate = updateReservationDto.reservationDate || reservation.reservationDate.toISOString().split('T')[0];
            const newTimeSlot = updateReservationDto.timeSlot || reservation.timeSlot;
            const newGuests = updateReservationDto.numberOfGuests || reservation.numberOfGuests;

            const isAvailable = await this.checkAvailability(newDate, newTimeSlot, newGuests, id);
            if (!isAvailable) {
                throw new ConflictException('No availability for this time slot');
            }
        }

        Object.assign(reservation, updateReservationDto);

        if (updateReservationDto.reservationDate) {
            reservation.reservationDate = new Date(updateReservationDto.reservationDate);
        }

        return await this.reservationRepository.save(reservation);
    }

    async cancel(id: number, userId?: number): Promise<Reservation> {
        const reservation = await this.findOne(id, userId);

        if (reservation.status === ReservationStatus.CANCELLED) {
            throw new BadRequestException('Reservation is already cancelled');
        }

        if (reservation.status === ReservationStatus.COMPLETED) {
            throw new BadRequestException('Cannot cancel a completed reservation');
        }

        reservation.status = ReservationStatus.CANCELLED;
        return await this.reservationRepository.save(reservation);
    }

    async confirm(id: number): Promise<Reservation> {
        const reservation = await this.findOne(id);

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Only pending reservations can be confirmed');
        }

        reservation.status = ReservationStatus.CONFIRMED;
        return await this.reservationRepository.save(reservation);
    }

    async reject(id: number, reason?: string): Promise<Reservation> {
        const reservation = await this.findOne(id);

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Only pending reservations can be rejected');
        }

        reservation.status = ReservationStatus.REJECTED;
        if (reason) {
            reservation.adminNotes = reason;
        }
        return await this.reservationRepository.save(reservation);
    }

    async checkAvailability(date: string, timeSlot: TimeSlot, numberOfGuests: number, excludeId?: number): Promise<boolean> {
        const reservationDate = new Date(date);

        const query = this.reservationRepository.createQueryBuilder('reservation')
            .where('DATE(reservation.reservationDate) = DATE(:date)', { date: reservationDate })
            .andWhere('reservation.timeSlot = :timeSlot', { timeSlot })
            .andWhere('reservation.status IN (:...statuses)', {
                statuses: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
            });

        if (excludeId) {
            query.andWhere('reservation.id != :excludeId', { excludeId });
        }

        const existingReservations = await query.getMany();
        const totalGuests = existingReservations.reduce((sum, res) => sum + res.numberOfGuests, 0);

        return (totalGuests + numberOfGuests) <= this.maxCapacityPerSlot;
    }

    async getAvailableSlots(date: string): Promise<{
        timeSlot: TimeSlot;
        availableCapacity: number;
        isAvailable: boolean;
    }[]> {
        const reservationDate = new Date(date);

        const existingReservations = await this.reservationRepository.find({
            where: {
                reservationDate,
                status: ReservationStatus.CONFIRMED || ReservationStatus.PENDING,
            },
        });

        const slotCapacity = new Map<TimeSlot, number>();

        // Initialiser toutes les créneaux à capacité maximale
        Object.values(TimeSlot).forEach(slot => {
            slotCapacity.set(slot, this.maxCapacityPerSlot);
        });

        // Décrémenter la capacité pour chaque réservation existante
        existingReservations.forEach(reservation => {
            const currentCapacity = slotCapacity.get(reservation.timeSlot) || 0;
            slotCapacity.set(reservation.timeSlot, currentCapacity - reservation.numberOfGuests);
        });

        return Object.values(TimeSlot).map(timeSlot => ({
            timeSlot,
            availableCapacity: slotCapacity.get(timeSlot) || 0,
            isAvailable: (slotCapacity.get(timeSlot) || 0) > 0,
        }));
    }

    async getReservationStats(): Promise<{
        totalReservations: number;
        pendingReservations: number;
        confirmedReservations: number;
        todayReservations: number;
        upcomingReservations: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            totalReservations,
            pendingReservations,
            confirmedReservations,
            todayReservations,
            upcomingReservations,
        ] = await Promise.all([
            this.reservationRepository.count(),
            this.reservationRepository.count({ where: { status: ReservationStatus.PENDING } }),
            this.reservationRepository.count({ where: { status: ReservationStatus.CONFIRMED } }),
            this.reservationRepository.count({
                where: {
                    reservationDate: Between(today, tomorrow),
                    status: ReservationStatus.CONFIRMED,
                },
            }),
            this.reservationRepository.count({
                where: {
                    reservationDate: Between(today, new Date('2099-12-31')),
                    status: ReservationStatus.CONFIRMED,
                },
            }),
        ]);

        return {
            totalReservations,
            pendingReservations,
            confirmedReservations,
            todayReservations,
            upcomingReservations,
        };
    }

    private generateConfirmationCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async remove(id: number): Promise<void> {
        const reservation = await this.findOne(id);
        await this.reservationRepository.remove(reservation);
    }
}