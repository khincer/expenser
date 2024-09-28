import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../models';
import { paymentSchema, updatePaymentSchema } from '../models/paymentModels';
import { any, z } from 'zod';
import { PaymentsQuery } from '../types/payment';

export const createPayment = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const validatedData = paymentSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: validatedData.userId,
        name: validatedData.name,
        amount: validatedData.amount,
        currency: validatedData.currency,
        dueDate: new Date(validatedData.dueDate),
        status: validatedData.status,
        paymentDate: validatedData.paymentDate
          ? new Date(validatedData.paymentDate)
          : null,
      },
    });

    return res.status(201).send(payment);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMesages = err.errors.map((err) => err.message);
      return res.status(400).send({ errors: errorMesages });
    }

    console.error('Failed tp create payment: ', err);
    return res.status(500).send({ error: 'Failed to create payment' });
  }
};

export const getAllPayments = async (
  req: FastifyRequest<{ Querystring: PaymentsQuery }>,
  res: FastifyReply,
) => {
  try {
    const {
      page = '1',
      pageSize = '10',
      status,
      currency,
      userId,
      sortBy = 'dueDate',
      sortOrder = 'asc',
      startDate,
      endDate,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(400).send({ error: 'Invalid page number' });
    }

    if (isNaN(pageSizeNumber) || pageSizeNumber <= 0) {
      return res.status(400).send({ error: 'Invalid page size' });
    }

    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (currency) {
      filters.currency = currency;
    }
    if (userId) {
      filters.userId = parseInt(userId, 10);
    }

    if (startDate || endDate) {
      filters.dueDate = {};
      if (startDate) {
        filters.dueDate.gte = new Date(startDate);
      }
      if (endDate) {
        filters.dueDate.lte = new Date(endDate);
      }
    }

    const payments = await prisma.payment.findMany({
      where: filters,
      include: {
        user: true,
      },
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalPayments = await prisma.payment.count({ where: filters });

    const totalPages = Math.ceil(totalPayments / pageSizeNumber);

    return res.status(200).send({
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalPages,
      totalPayments,
      payments,
    });
  } catch (error) {
    console.error('Failed to fetch payments: ', error);
    return res.status(500).send({ error: 'Failed to fetch payments' });
  }
};

export const updatePayment = async (
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  res: FastifyReply,
) => {
  try {
    const { id } = req.params;
    const validatedData = updatePaymentSchema.parse(req.body);

    const existingPayment = await prisma.payment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingPayment) {
      return res.status(404).send({ error: 'Payment not found' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: validatedData.name ?? existingPayment.name,
        amount: validatedData.amount ?? existingPayment.amount,
        currency: validatedData.currency ?? existingPayment.currency,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : existingPayment.dueDate,
        status: validatedData.status ?? existingPayment.status,
        paymentDate: validatedData.paymentDate
          ? new Date(validatedData.paymentDate)
          : existingPayment.paymentDate,
      },
    });

    return res.status(200).send(updatedPayment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message);
      return res.status(400).send({ errors: errorMessages });
    }

    console.error('Failed to update payment:', error);
    return res.status(500).send({ error: 'Failed to update payment' });
  }
};
