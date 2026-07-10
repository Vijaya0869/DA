import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  property_id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  created_at: Date;

  @Column({ nullable: false })
  updated_at: Date;
}
