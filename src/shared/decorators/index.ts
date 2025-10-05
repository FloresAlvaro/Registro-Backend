import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user from request
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);

/**
 * Decorator to extract pagination params
 */
export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { page = 1, limit = 10 } = request.query;

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      page: parseInt(page, 10),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      limit: parseInt(limit, 10),
    };
  },
);

/**
 * Decorator to extract sort params
 */
export const SortParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { sortBy, sortOrder = 'asc' } = request.query;

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    };
  },
);
