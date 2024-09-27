import fastify from 'fastify';
import { paymentRoutes } from './routes/paymentRoutes';

const app = fastify({logger: true});

app.register(paymentRoutes);

const startServer = async() => {
    try {
        await app.listen({port: 3000});
        console.log('Server is running on port 3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
startServer();
