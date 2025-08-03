import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Class } from './class';
import { Subject } from './subject';
import { Student } from './student';

@Table({ tableName: 'exams' })
export class Exam extends Model<Exam> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  examType!: string; // 'midterm', 'final', 'quiz', 'assignment'

  @ForeignKey(() => Class)
  @Column({ type: DataType.INTEGER, allowNull: false })
  classId!: number;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  examDate!: Date;

  @Column({ type: DataType.TIME, allowNull: false })
  startTime!: string;

  @Column({ type: DataType.TIME, allowNull: false })
  endTime!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalMarks!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  passingMarks!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  instructions?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  venue?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.STRING, defaultValue: 'scheduled' })
  status!: string; // 'scheduled', 'ongoing', 'completed', 'cancelled'

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  // Relations
  @BelongsTo(() => Class, 'classId')
  class?: Class;

  @BelongsTo(() => Subject, 'subjectId')
  subject?: Subject;

  @HasMany(() => ExamResult, 'examId')
  results?: ExamResult[];
}

@Table({ tableName: 'exam_results' })
export class ExamResult extends Model<ExamResult> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Exam)
  @Column({ type: DataType.INTEGER, allowNull: false })
  examId!: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  studentId!: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  marksObtained!: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  percentage!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  grade!: string; // 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string; // 'pass', 'fail'

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAbsent!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isReexam!: boolean;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;

  // Relations
  @BelongsTo(() => Exam, 'examId')
  exam?: Exam;

  @BelongsTo(() => Student, 'studentId')
  student?: Student;
} 