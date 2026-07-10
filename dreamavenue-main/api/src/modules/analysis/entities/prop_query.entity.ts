import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('prop_query')
export class PropQuery {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: true })
  response: string;
}
