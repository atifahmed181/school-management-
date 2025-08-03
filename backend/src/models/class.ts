import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';
import { Staff } from './staff';

export interface IClass {
  id?: number;
  name: string;
  gradeLevel: string;
  section: string;
  academicYear: string;
  capacity: number;
  currentEnrollment: number;
  teacherId?: number;
  description?: string;
  roomNumber?: string;
  schedule?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'classes' })
export class Class extends Model<Class> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  gradeLevel!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  section!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  academicYear!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  capacity!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  currentEnrollment!: number;

  @ForeignKey(() => Staff)
  @Column({ type: DataType.INTEGER, allowNull: true })
  teacherId?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  roomNumber?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  schedule?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  // Relations
  @BelongsTo(() => Staff, 'teacherId')
  teacher?: Staff;

  // Virtual fields for API responses
  get availableSeats(): number {
    return this.capacity - this.currentEnrollment;
  }

  get isFull(): boolean {
    return this.currentEnrollment >= this.capacity;
  }
} 