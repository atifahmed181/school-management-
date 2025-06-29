import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';
import { User } from './user';
import { Role } from './role';
import { Student } from './student';
import { Permission } from './permission';
import { UserPermission } from './userPermission';
// … import other models

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  models: [Role, User, Student, Permission, UserPermission /*, …others*/],
});

export { User, Role, Student, Permission, UserPermission };