import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true })
  username!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin!: boolean;

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
