import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { config } from '../config';
import { CreationOptional, InferAttributes } from 'sequelize';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const roleRec = await Role.findOne({ where: { name: role } });
    if (!roleRec) {
      return res.status(400).json({ message: `Invalid role: ${role}. Available roles: admin, teacher, user` });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, roleId: roleRec.id } as any);
    await user.save();
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ msg: 'Wrong credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    res.json({ token, role: user.role.name });
  } catch (err) {
    next(err);
  }
};