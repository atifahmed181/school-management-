import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt
} from 'sequelize-typescript';

@Table({ tableName: 'permissions' })
export class Permission extends Model<Permission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string; // e.g., 'students.create', 'classes.read'

  @Column({ type: DataType.STRING, allowNull: false })
  displayName!: string; // e.g., 'Create Students', 'Read Classes'

  @Column({ type: DataType.STRING, allowNull: false })
  category!: string; // e.g., 'students', 'classes', 'attendance', 'fees'

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;
} 