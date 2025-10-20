import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import {
  httpLogger,
  correlationId,
  requireBearer,
  validate,
  CreateOrderSchema
} from '../../../utils'; // pastikan huruf besar kecil sama persis

const app = express();
app.use(express.json());
app.use(httpLogger);
app.use(correlationId);
app.use(requireBearer);
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

// Simpan data order sementara di memori
const orders: any[] = [];

// Gunakan middleware validate untuk validasi body
app.post(
  '/orders',
  validate(CreateOrderSchema),
  (req: Request, res: Response, _next: NextFunction) => {
    const { productId, quantity } = (req as any).validated;

    const order = {
      id: randomUUID(),
      productId,
      quantity,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    res.status(201).json(order);
  }
);

export default app;
