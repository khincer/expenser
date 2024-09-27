import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../models';
import { paymentSchema } from '../models/paymentModels';
import { z } from 'zod';

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
    if(err instanceof z.ZodError){
        const errorMesages = err.errors.map((err)=> err.message)
        return res.status(400).send({ errors: errorMesages });
    }

    console.error('Failed tp create payment: ', err);
    return res.status(500).send({ error: 'Failed to create payment' });
  }
};
