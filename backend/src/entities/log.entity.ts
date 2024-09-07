import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  logId: string;

  @Column()
  message: string;

  @Column()
  timestampAdded: Date;
}
