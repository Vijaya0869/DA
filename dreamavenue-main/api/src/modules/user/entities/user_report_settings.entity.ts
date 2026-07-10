import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_report_settings')
export class UserReportSettings{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  report_name: string;

  @Column()
  section_name: string;

  @Column()
  selected: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
