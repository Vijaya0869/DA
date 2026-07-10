import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class BulkUploadSession {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  file_name: string;

  @Column({ nullable: false })
  file_url: string;

  @Column({ nullable: false })
  total_records: number;

  @Column({ nullable: false })
  processed_records: number;

  @Column({ nullable: false })
  failed_records: number;

  @Column({ nullable: false })
  upload_type: string;

  @Column({ nullable: true })
  error_log: string;

  @Column({ nullable: false })
  created_at: Date;

  @Column({ nullable: false })
  updated_at: Date;
}
