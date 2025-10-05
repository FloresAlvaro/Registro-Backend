/**
 * 🎯 Path Mapping Examples
 *
 * This file demonstrates how to use the new TypeScript path mappings
 * configured in tsconfig.json for cleaner and more maintainable imports.
 */

// ✅ Before (Old way with relative paths):
// import { BaseService } from '../../../shared/base/base.service';
// import { DateUtils, QueryUtils } from '../../../shared/utils/common.utils';
// import { PaginationDto } from '../../../shared/dto/base.dto';
// import { PrismaService } from '../../../prisma/prisma.service';

// ✅ After (New way with path mappings):
import { BaseService, DateUtils, QueryUtils, PaginationDto } from '@shared';

import { PrismaService } from '@prisma';

/**
 * 📋 Available Path Mappings:
 *
 * @shared/*     → src/shared/*
 * @shared       → src/shared/index
 * @config/*     → src/config/*
 * @config       → src/config/index
 * @modules/*    → src/modules/*
 * @academic/*   → src/modules/academic/*
 * @academic     → src/modules/academic/index
 * @users/*      → src/modules/users/*
 * @users        → src/modules/users/index
 * @relationships/* → src/modules/relationships/*
 * @relationships   → src/modules/relationships/index
 * @prisma/*     → src/prisma/*
 * @prisma       → src/prisma/index
 */

export class PathMappingExampleService extends BaseService<any, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Example', 'id');
  }

  getModel() {
    return this.prisma.user;
  }

  getIncludeOptions() {
    return {};
  }

  // Example method using imported utilities
  async findWithPagination(pagination: PaginationDto) {
    const { skip, take } = QueryUtils.buildPagination(
      pagination.page,
      pagination.limit,
    );

    const data = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data,
      meta: {
        ...pagination,
        total: await this.prisma.user.count(),
      },
    };
  }

  // Example using DateUtils
  formatUserDate(date: string | Date) {
    return DateUtils.safeParseDate(date);
  }
}

/**
 * 🚀 Benefits of Path Mappings:
 *
 * 1. ✅ Cleaner imports: No more '../../../' hell
 * 2. ✅ Better maintainability: Easy to refactor directory structure
 * 3. ✅ Improved readability: Clear intent with domain-based imports
 * 4. ✅ IDE support: Better autocomplete and navigation
 * 5. ✅ Consistent structure: Standardized import patterns across team
 *
 * 🎯 Usage Guidelines:
 *
 * - Use @shared for common utilities, DTOs, and base classes
 * - Use @config for application configuration
 * - Use domain aliases (@academic, @users, @relationships) for domain modules
 * - Use specific paths (@shared/utils/common.utils) when importing specific files
 * - Use barrel exports (@shared, @academic) when importing multiple items
 */

export default PathMappingExampleService;
