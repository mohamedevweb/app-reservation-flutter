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

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column()
    customerPhone: string;

    @Column({ type: 'date' })
    reservationDate: Date;

    @Column({
        type: 'enum',
        enum: TimeSlot,
    })
    timeSlot: TimeSlot;

    @Column({ type: 'int' })
    numberOfGuests: number;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status: ReservationStatus;

    @Column({ type: 'text', nullable: true })
    specialRequests: string;

    @Column({ type: 'text', nullable: true })
    adminNotes: string;

    @Column({ type: 'int', nullable: true })
    tableNumber: number;

    @Column({ nullable: true })
    confirmationCode: string;

    // Relation optionnelle avec l'utilisateur (si connecté)
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column({ nullable: true })
    userId?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}