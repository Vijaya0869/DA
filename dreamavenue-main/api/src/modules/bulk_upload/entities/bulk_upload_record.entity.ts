import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class BulkUploadRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  session_id: string;

  @Column({ nullable: true })
  property_id: string;

  @Column({ nullable: false })
  raw_data: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: true })
  error_message: string;

  @Column({ nullable: false })
  row_number: number;

  @Column({ nullable: false })
  created_at: Date;

  @Column({ nullable: false })
  updated_at: Date;
}
