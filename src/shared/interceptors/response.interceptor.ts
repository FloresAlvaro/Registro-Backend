import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: this.getSuccessMessage(request.method, request.route?.path),
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }

  private getSuccessMessage(method: string, path?: string): string {
    const operation = method?.toLowerCase();
    const resource = this.extractResourceFromPath(path);

    switch (operation) {
      case 'get':
        return `${resource} retrieved successfully`;
      case 'post':
        return `${resource} created successfully`;
      case 'put':
      case 'patch':
        return `${resource} updated successfully`;
      case 'delete':
        return `${resource} deleted successfully`;
      default:
        return 'Operation completed successfully';
    }
  }

  private extractResourceFromPath(path?: string): string {
    if (!path) return 'Resource';

    // Extract resource name from path like /api/users, /api/teachers/:id
    const segments = path.split('/').filter(Boolean);
    const resourceSegment = segments.find(
      (segment) => !segment.startsWith(':') && segment !== 'api',
    );

    if (!resourceSegment) return 'Resource';

    // Capitalize first letter and make singular if needed
    return (
      resourceSegment.charAt(0).toUpperCase() +
      resourceSegment.slice(1).replace(/s$/, '')
    );
  }
}
