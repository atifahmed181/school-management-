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

  @Column({ type: DataType.ENUM('male', 'female', 'other'), allowNull: true, defaultValue: 'male' })
  gender?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  bloodGroup?: string;

  // Academic Information
  @Column({ type: DataType.STRING, allowNull: false })
  studentId!: string; // Unique student ID like "2024-001"

  @Column({ type: DataType.STRING, allowNull: false })
  currentClass!: string; // e.g., "Grade 10A"

  @Column({ type: DataType.STRING, allowNull: true })
  section?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  rollNumber?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  admissionDate!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  previousSchool?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  admissionClass?: string;

  // Contact Information
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 'N/A' })
  address?: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 'N/A' })
  city?: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 'N/A' })
  state?: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 'N/A' })
  postalCode?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phoneNumber?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  alternatePhone?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  // Emergency Contact
  @Column({ type: DataType.STRING, allowNull: true })
  emergencyContactName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  emergencyContactPhone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  emergencyContactRelation?: string;

  // Parent/Guardian Information
  @Column({ type: DataType.STRING, allowNull: true })
  fatherName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherCnic?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherCell?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherOccupation?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fatherPhone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherName?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherCnic?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherCell?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherOccupation?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  motherPhone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  childNumber?: string;

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