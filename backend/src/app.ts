import express from 'express';
import cors from 'cors';
import routeRoutes from './routes/route.routes';
import { apiReference } from '@scalar/express-api-reference';
import { openapiSpec } from './openapi';

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api-docs',
  apiReference({
    spec: {
      content: openapiSpec,
    },
    theme: 'kepler'
  })
);

app.use('/route', routeRoutes);

export default app;
