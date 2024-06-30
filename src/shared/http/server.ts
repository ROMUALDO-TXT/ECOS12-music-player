import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { routes } from './routes';
import AppError from '@shared/errors/AppError';
import { isCelebrateError } from 'celebrate';
import { database } from 'src/database/database';
import * as fs from 'fs-extra';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (isCelebrateError(err)) {
    const values = err.details.values();

    let { message } = values.next().value.details[0];

    message = message.replace(`"`, ``).replace(`"`, ``);

    return res.status(400).json({
      status: 'error',

      message: message || 'no message',
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log({ err });

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

fs.ensureDirSync(`uploads/`);

database.initialize().then(() =>
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })
)
