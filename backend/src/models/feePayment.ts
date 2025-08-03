import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Student } from './student';
import { Fee } from './fee';

@Table({ tableName: 'fee_payments' })
export class FeePayment extends Model<FeePayment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Student)
  @Column({ field: 'student_id', type: DataType.INTEGER, allowNull: false })
  studentId!: number;

  @ForeignKey(() => Fee)
  @Column({ field: 'fee_id', type: DataType.INTEGER, allowNull: false })
  feeId!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amountPaid!: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  paymentDate!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  paymentMethod?: string; // e.g., Cash, Card, Bank Transfer

  @Column({ type: DataType.STRING, allowNull: true })
  remarks?: string;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  @BelongsTo(() => Student)
  student!: Student;

  @BelongsTo(() => Fee)
  fee!: Fee;
} 