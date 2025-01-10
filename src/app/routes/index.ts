import express from 'express';
import { config } from '@src/common';
import { apiRouter } from './api';

export const mainRouter = express.Router();

mainRouter.get('', async (req, res) => {
  res.json({ message: 'Hello' });
});

mainRouter.use(config.prefix, apiRouter);
