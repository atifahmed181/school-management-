import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, HasMany
} from 'sequelize-typescript';
import { User } from './user';
import { Class } from './class';

@Table({ tableName: 'staff' })
export class Staff extends Model<Staff> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  employeeId!: string; // Unique employee ID like "EMP001"

  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  middleName?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  dateOfBirth!: Date;

  @Column({ type: DataType.ENUM('male', 'female', 'other'), allowNull: false })
  gender!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phoneNumber!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  alternatePhone?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  state!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  postalCode!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  hireDate!: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  position!: string; // Teacher, Principal, Admin, etc.

  @Column({ type: DataType.STRING, allowNull: true })
  department?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  qualification?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  specialization?: string; // For teachers: Math, Science, etc.

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  salary?: number;

  @Column({ type: DataType.ENUM('active', 'inactive', 'on_leave', 'terminated'), defaultValue: 'active' })
  status!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  // Relations
  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Class)
  classes!: Class[];
} 