import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';
import { User } from './user';
import { Role } from './role';
import { Student } from './student';
import { Permission } from './permission';
import { UserPermission } from './userPermission';
import { Class } from './class';
import { Staff } from './staff';
import { Attendance } from './attendance';
import { Subject } from './subject';
import { Fee } from './fee';
import { FeePayment } from './feePayment';
import { Exam, ExamResult } from './exam';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  models: [Role, User, Student, Permission, UserPermission, Class, Staff, Attendance, Subject, Fee, FeePayment, Exam, ExamResult],
});

export { User, Role, Student, Permission, UserPermission, Class, Staff, Attendance, Subject, Fee, FeePayment, Exam, ExamResult };