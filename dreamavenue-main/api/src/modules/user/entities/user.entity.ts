import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  picture: string;

  @Column()
  provider: string;

  @Column({ nullable: true })
  @Exclude() // Exclude from serialization
  passwordHash: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true, default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  @Exclude() // Exclude from serialization
  verification_key: string;
}