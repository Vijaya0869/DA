import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('financing')
export class Financing {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  loan_label: string;

  @Column({ nullable: true })
  financing_of_type_id: string;

  @Column({ nullable: true })
  property_id: string;

  @Column({ nullable: true })
  down_payment: number;

  @Column({ nullable: true })
  down_payment_type: string;

  @Column({ nullable: true })
  calc_down_payment: number;

  @Column('numeric', { nullable: true })
  amount: number;

  @Column('numeric', { nullable: true })
  calc_amount: number;

  @Column('numeric', { nullable: true })
  rehab_down_payment: number;

  @Column({ nullable: true })
  loan_type_id: string;

  @Column({ nullable: true, default: '$' })
  amount_type: string;

  @Column('numeric', { nullable: true })
  interest_rate: number;

  @Column({ nullable: true })
  loan_term: number;
}
