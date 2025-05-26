import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReservationStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    NO_SHOW = 'no_show'
}

export enum TimeSlot {
    LUNCH_12_00 = '12:00',
    LUNCH_12_30 = '12:30',
    LUNCH_13_00 = '13:00',
    LUNCH_13_30 = '13:30',
    LUNCH_14_00 = '14:00',
    LUNCH_14_30 = '14:30',
    DINNER_18_00 = '18:00',
    DINNER_18_30 = '18:30',
    DINNER_19_00 = '19:00',
    DINNER_19_30 = '19:30',
    DINNER_20_00 = '20:00',
    DINNER_20_30 = '20:30',
    DINNER_21_00 = '21:00',
    DINNER_21_30 = '21:30'
}

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_name' })
    customerName: string;

    @Column({ name: 'customer_email' })
    customerEmail: string;

    @Column({ name: 'customer_phone' })
    customerPhone: string;

    @Column({ type: 'date' , name: 'reservation_date'})
    reservationDate: Date;

    @Column({
        type: 'enum',
        enum: TimeSlot,
        name: 'time_slot'
    })
    timeSlot: TimeSlot;

    @Column({ type: 'int', name: 'number_of_guests' })
    numberOfGuests: number;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status: ReservationStatus;

    @Column({ type: 'text', nullable: true, name: 'special_requests' })
    specialRequests: string;

    @Column({ type: 'text', nullable: true,  name: 'admin_notes' })
    adminNotes: string;

    @Column({ type: 'int', nullable: true, name: 'table_number' })
    tableNumber: number;

    @Column({ nullable: true,  name: 'confirmation_code' })
    confirmationCode: string;

    // Relation optionnelle avec l'utilisateur (si connecté)
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column({ type: 'uuid', nullable: true })
    userId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}