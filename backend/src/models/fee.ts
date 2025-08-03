import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { FeePayment } from './feePayment';

@Table({ tableName: 'fees' })
export class Fee extends Model<Fee> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string; // e.g., Tuition, Library, Exam

  @Column({ type: DataType.STRING, allowNull: true })
  description?: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amount!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  @HasMany(() => FeePayment)
  payments!: FeePayment[];
} 