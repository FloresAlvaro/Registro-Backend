import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user from request
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Decorator to extract pagination params
 */
export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;

    return {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  },
);

/**
 * Decorator to extract sort params
 */
export const SortParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { sortBy, sortOrder = 'asc' } = request.query;

    return {
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    };
  },
);
