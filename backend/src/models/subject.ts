import {
  Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

@Table({ tableName: 'subjects' })
export class Subject extends Model<Subject> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string; // e.g., "Mathematics", "English Literature"

  @Column({ type: DataType.STRING, allowNull: false })
  code!: string; // e.g., "MATH101", "ENG201"

  @Column({ type: DataType.STRING, allowNull: false })
  category!: string; // e.g., "Core", "Elective", "Optional"

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  credits!: number; // Credit hours

  @Column({ type: DataType.STRING, allowNull: true })
  gradeLevel?: string; // e.g., "Grade 9", "Grade 10"

  @Column({ type: DataType.STRING, allowNull: true })
  department?: string; // e.g., "Science", "Arts", "Mathematics"

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  syllabus?: string; // Syllabus content or file path

  @Column({ type: DataType.STRING, allowNull: true })
  textbook?: string; // Textbook information

  @Column({ type: DataType.INTEGER, allowNull: true })
  maxStudents?: number; // Maximum students per class

  @Column({ type: DataType.TEXT, allowNull: true })
  prerequisites?: string; // Prerequisite subjects

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;
} 