import { NotFoundException } from '@nestjs/common';

/**
 * Date transformation utilities
 */
export class DateUtils {
  /**
   * Converts string to Date object safely
   */
  static safeParseDate(dateString?: string | Date): Date {
    if (!dateString) return new Date();
    if (dateString instanceof Date) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateString}`);
    }
    return date;
  }

  /**
   * Formats date for API responses
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Checks if date is within range
   */
  static isDateInRange(date: Date, startDate?: Date, endDate?: Date): boolean {
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validates that an ID is positive integer
   */
  static validateId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }

  /**
   * Validates that an entity exists and throws NotFoundException if not
   */
  static validateExists<T>(
    entity: T | null | undefined,
    id: number | string,
    entityName: string,
  ): T {
    if (!entity) {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    return entity;
  }

  /**
   * Validates email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitizes string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }
}

/**
 * Query building utilities for Prisma
 */
export class QueryUtils {
  /**
   * Builds pagination options for Prisma
   */
  static buildPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  /**
   * Builds search where clause
   */
  static buildSearchWhere(fields: string[], searchTerm?: string) {
    if (!searchTerm) return {};

    const searchConditions = fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
    }));

    return { OR: searchConditions };
  }

  /**
   * Builds sort options
   */
  static buildSort(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') {
    if (!sortBy) return {};
    return { [sortBy]: sortOrder };
  }

  /**
   * Builds status filter
   */
  static buildStatusFilter(
    status?: 'active' | 'inactive' | 'all',
    statusField = 'status',
  ) {
    if (!status || status === 'all') return {};
    return { [statusField]: status === 'active' };
  }
}
