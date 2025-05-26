// src/projects/entities/project.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Interest } from '../../interests/entities/interest.entity';
// Using type import to break circular dependency
import type { Investment } from '../../investments/entities/investment.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToMany(() => Interest)
  @JoinTable()
  categories: Interest[];

  @OneToMany('Investment', 'project')
  investments: Investment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
