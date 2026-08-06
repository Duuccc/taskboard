import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';  

export const validate = (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: {
            code:    'VALIDATION_ERROR',
            message: 'Invalid request data',
            fields:  err.issues.map(e => ({
              field:   e.path.join('.'),
              message: e.message,
            })),
          },
        });
        return;
      }
      next(err);
    }
  };