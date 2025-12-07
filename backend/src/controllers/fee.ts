import { Request, Response } from 'express';
import { Fee, FeePayment } from '../models';
import { Student } from '../models/student';

export class FeeController {
  // Create a new fee structure
  static async createFee(req: Request, res: Response) {
    try {
      const { name, description, amount } = req.body;
      if (!name || !amount) return res.status(400).json({ error: 'Name and amount are required' });
      const fee = await Fee.create({ name, description, amount: amount as any } as any);
      res.status(201).json({ fee });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  // Get all fees
  static async getFees(req: Request, res: Response) {
    try {
      const fees = await Fee.findAll();
      res.json({ fees });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  // Update a fee
  static async updateFee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, amount, isActive } = req.body;
      const fee = await Fee.findByPk(id);
      if (!fee) return res.status(404).json({ error: 'Fee not found' });
      await fee.update({ name, description, amount, isActive });
      res.json({ fee });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  // Delete a fee
  static async deleteFee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fee = await Fee.findByPk(id);
      if (!fee) return res.status(404).json({ error: 'Fee not found' });
      await fee.destroy();
      res.json({ message: 'Fee deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  // FeePayment CRUD
  static async createPayment(req: Request, res: Response) {
    try {
      const { studentId, feeId, amountPaid, paymentDate, paymentMethod, remarks } = req.body;
      if (!studentId || !feeId || !amountPaid || !paymentDate) return res.status(400).json({ error: 'Missing required fields' });
      const payment = await FeePayment.create({ studentId, feeId, amountPaid, paymentDate, paymentMethod, remarks } as any);
      res.status(201).json({ payment });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  static async getPayments(req: Request, res: Response) {
    try {
      const payments = await FeePayment.findAll({ include: [Student, Fee] });
      res.json({ payments });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  static async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await FeePayment.findByPk(id, { include: [Student, Fee] });
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      res.json({ payment });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }

  static async getPaymentsByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const payments = await FeePayment.findAll({ where: { studentId }, include: [Fee] });
      res.json({ payments });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: (err as any).message });
    }
  }
}