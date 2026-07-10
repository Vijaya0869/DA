import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('rehab_costs')
export class RehabCosts {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('double precision', { nullable: false })
  amount: number;

  @Column({ nullable: false })
  created_at: Date;

  @Column({ nullable: false })
  updated_at: Date;

  @Column({ nullable: false })
  property_id: string;

  @Column({ nullable: false })
  amount_type: string;

  @Column({ nullable: false })
  cost_type: string;

  @Column('numeric', { nullable: false })
  calculated_amount: number;

  @Column({ nullable: false })
  period_type: string;

  @Column({ nullable: false })
  no_of_periods: number;
}
