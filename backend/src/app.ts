import express from 'express';
import cors from 'cors';
import routeRoutes from './routes/route.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/route', routeRoutes);

export default app;
