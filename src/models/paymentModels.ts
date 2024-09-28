import { z } from 'zod';

export const paymentSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be a positive number'),
  currency: z.enum(['Cordobas', 'Dollars']).refine(
    (val) => ['Cordobas', 'Dollars'].includes(val),
    {
      message: 'Currency must be either "Cordobas" or "Dollars"',
    }
  ),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message:
      'Due date must be a valid date string (e.g., "2024-09-20T00:00:00.000Z")',
  }),
  status: z.enum(['Pending', 'Completed']).refine(
    (val) => ['Pending', 'Completed'].includes(val),
    {
      message: 'Status must be either "Pending" or "Completed"',
    }
  ),
  paymentDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Payment date must be a valid date string if provided',
    }),
});


export const updatePaymentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  currency: z.enum(['Cordobas', 'Dollars']).optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Due date must be a valid date string (e.g., "2024-09-20T00:00:00.000Z")',
  }).optional(),
  status: z.enum(['Pending', 'Completed']).optional(),
  paymentDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
    message: 'Payment date must be a valid date string if provided',
  }),
});