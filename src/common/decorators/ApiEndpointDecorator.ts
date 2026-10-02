import { HttpStatus, Type, Version, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

type TApiEndpointOptions = {
  version?: string;
  summary: string;
  description?: string;
  type?: Type<unknown>;
  isArray?: boolean;
  isPaginated?: boolean;
  status?: HttpStatus;
};

const PAGINATION_META_SCHEMA = {
  type: 'object',
  properties: {
    total: { type: 'number', example: 42 },
    count: { type: 'number', example: 10 },
    offset: { type: 'number', example: 0 },
    limit: { type: 'number', example: 10 },
    currentPage: { type: 'number', example: 1 },
    totalPages: { type: 'number', example: 5 },
    hasNext: { type: 'boolean', example: true },
    hasPrevious: { type: 'boolean', example: false },
  },
};

export function ApiEndpoint(params: TApiEndpointOptions) {
  const {
    version = '1',
    summary,
    description,
    type,
    isArray = false,
    isPaginated = false,
    status = HttpStatus.OK,
  } = params;

  const list = isArray || isPaginated;

  let data: Record<string, unknown> = { nullable: true, example: null };

  if (type) {
    const ref = { $ref: getSchemaPath(type) };
    data = list ? { type: 'array', items: ref } : ref;
  }

  return applyDecorators(
    /**
     * API VERSION
     */
    Version(version),

    /**
     * Swagger UI API title and description
     */

    ApiOperation({ summary, description }),
    ...(type ? [ApiExtraModels(type)] : []),

    /**
     * Swagger UI API RESPONSE
     */

    ApiResponse({
      status,
      description: summary,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'number', example: status },
          timestamp: { type: 'string', format: 'date-time' },
          data,
          ...(isPaginated ? { meta: PAGINATION_META_SCHEMA } : {}),
        },
      },
    }),
  );
}
