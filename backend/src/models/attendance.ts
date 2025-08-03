import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';
import { Student } from './student';
import { Staff } from './staff';
import { Class } from './class';

@Table({ tableName: 'attendance' })
export class Attendance extends Model<Attendance> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date!: Date;

  @Column({ type: DataType.ENUM('present', 'absent', 'late', 'excused', 'half_day'), allowNull: false })
  status!: string;

  @Column({ type: DataType.TIME, allowNull: true })
  checkInTime?: Date;

  @Column({ type: DataType.TIME, allowNull: true })
  checkOutTime?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  markedBy?: string; // User who marked the attendance

  // For student attendance
  @ForeignKey(() => Student)
  @Column({ field: 'student_id', type: DataType.INTEGER, allowNull: true })
  studentId?: number;

  @ForeignKey(() => Class)
  @Column({ field: 'class_id', type: DataType.INTEGER, allowNull: true })
  classId?: number;

  // For staff attendance
  @ForeignKey(() => Staff)
  @Column({ field: 'staff_id', type: DataType.INTEGER, allowNull: true })
  staffId?: number;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  // Relations
  @BelongsTo(() => Student)
  student?: Student;

  @BelongsTo(() => Staff)
  staff?: Staff;

  @BelongsTo(() => Class)
  class?: Class;
} 