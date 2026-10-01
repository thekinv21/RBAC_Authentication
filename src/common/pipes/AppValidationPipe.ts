import type { TApiErrorDetail } from '@/common/types';
import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

export const AppValidationPipe: new () => PipeTransform =
  createZodValidationPipe({
    createValidationException: (error: unknown) => {
      const errors: TApiErrorDetail[] =
        error instanceof ZodError
          ? error.issues.map((issue) => ({
              property: issue.path.join('.'),
              message: issue.message,
            }))
          : [];

      return new BadRequestException(errors);
    },
  });
