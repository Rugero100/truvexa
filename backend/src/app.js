import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { publicRouter } from './routes/public.js';
import { sessionRouter } from './routes/session.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler } from './utils.js';
export function createApp() {
  const app = express(); app.disable('x-powered-by');
  const allowed = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000').split(',').map(x => x.trim());
  app.use(helmet());
  app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)), credentials: true }));
  app.use(express.json({ limit: '100kb' })); app.use(cookieParser());
  app.use((req, _res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers.origin && !allowed.includes(req.headers.origin)) return next(Object.assign(new Error('Origin not allowed.'), { status: 403 }));
    next();
  });
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'truvexa-api' }));
  app.use('/api', publicRouter); app.use('/api/auth', sessionRouter); app.use('/api/admin', adminRouter);
  app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
  app.use(errorHandler); return app;
}
