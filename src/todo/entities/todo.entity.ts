import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
@Entity({ name: 'todo' })
export class TodoEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;
  @Column({ name: 'title', type: 'varchar', length: 50 })
  title!: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  description!: string | null;

  @Column({ name: 'is_closed', type: 'boolean', default: false })
  isClosed!: boolean;

  @Column({ name: 'created_by_id', type: 'int', nullable: true })
  createdById!: number | null;

  @Column({ name: 'updated_by_id', type: 'int', nullable: true })
  updatedById!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn({ name: 'version' })
  version!: number;
}
