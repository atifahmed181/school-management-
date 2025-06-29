import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt
} from 'sequelize-typescript';
import { User } from './user';
import { Permission } from './permission';

@Table({ tableName: 'user_permissions' })
export class UserPermission extends Model<UserPermission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Permission)
  @Column({ field: 'permission_id', type: DataType.INTEGER, allowNull: false })
  permissionId!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isGranted!: boolean; // true = granted, false = denied

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Permission)
  permission!: Permission;

  @CreatedAt createdAt!: Date;
  @UpdatedAt updatedAt!: Date;
} 