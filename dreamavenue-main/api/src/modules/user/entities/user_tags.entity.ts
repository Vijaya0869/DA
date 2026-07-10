import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_tags' })
export class UserTags {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  tags: string;
}
