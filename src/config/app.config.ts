import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  port: number;
  environment: string;
  apiPrefix: string;
}

export interface DatabaseConfig {
  url: string;
  type: string;
}

export const appConfig = () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    type: process.env.DATABASE_TYPE || 'postgresql',
  },
});

export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig(): AppConfig {
    const config = this.configService.get<AppConfig>('app');
    if (!config) {
      throw new Error('App configuration not found');
    }
    return config;
  }

  get databaseConfig(): DatabaseConfig {
    const config = this.configService.get<DatabaseConfig>('database');
    if (!config) {
      throw new Error('Database configuration not found');
    }
    return config;
  }

  get port(): number {
    return this.appConfig.port;
  }

  get environment(): string {
    return this.appConfig.environment;
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }
}
