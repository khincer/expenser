import { FastifyInstance } from "fastify";
import { createPayment } from "../controllers/paymentController";

export const paymentRoutes = async (fastify: FastifyInstance ) => {
    fastify.post('/payments', createPayment);
}