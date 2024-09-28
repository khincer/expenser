import { FastifyInstance } from "fastify";
import { createPayment, getAllPayments, updatePayment } from "../controllers/paymentController";

export const paymentRoutes = async (fastify: FastifyInstance ) => {
    fastify.post('/payments', createPayment);
    fastify.get('/payments', getAllPayments);
    fastify.put('/payments/:id', updatePayment);
}