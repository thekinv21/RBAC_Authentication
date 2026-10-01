import { PageDto } from '@/common/dto';
import { TApiPaginatedResponse, TApiResponse } from '@/common/types';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';

type WrappedResponse = TApiResponse | TApiPaginatedResponse;

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor<
  unknown,
  WrappedResponse
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WrappedResponse> {
    if (context.getType() !== 'http') return next.handle();

    const { statusCode } = context.switchToHttp().getResponse<Response>();
    const base = () => ({
      success: true as const,
      statusCode,
      timestamp: new Date().toISOString(),
    });

    return next
      .handle()
      .pipe(
        map((result: unknown): WrappedResponse =>
          result instanceof PageDto
            ? { ...base(), data: result.items, meta: result.meta }
            : { ...base(), data: result ?? null },
        ),
      );
  }
}
