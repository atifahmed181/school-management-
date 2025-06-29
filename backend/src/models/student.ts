import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, HasOne
} from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'students' })
export class Student extends Model<Student> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // Personal Information
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

  @Column({ type: DataType.STRING, allowNull: true })
  bloodGroup?: string;

  // Academic Information
  @Column({ type: DataType.STRING, allowNull: false })
  studentId!: string; // Unique student ID like "2024-001"

  @Column({ type: DataType.STRING, allowNull: false })
  currentClass!: string; // e.g., "Grade 10A"

  @Column({ type: DataType.STRING, allowNull: true })
  section?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rollNumber?: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  admissionDate!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  previousSchool?: string;

  // Contact Information
  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  state!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  postalCode!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phoneNumber!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  alternatePhone?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  // Emergency Contact
  @Column({ type: DataType.STRING, allowNull: false })
  emergencyContactName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  emergencyContactPhone!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  emergencyContactRelation?: string;

  // Parent/Guardian Information
  @Column({ type: DataType.STRING, allowNull: false })
  fatherName!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherOccupation?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherPhone?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  motherName!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherOccupation?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherPhone?: string;

  // Academic Status
  @Column({ type: DataType.ENUM('active', 'inactive', 'transferred', 'graduated', 'suspended'), defaultValue: 'active' })
  status!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  // Optional: Link to User account for login
  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.INTEGER, allowNull: true })
  userId?: number;

  @BelongsTo(() => User)
  user?: User;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;
} 