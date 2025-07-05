// src/modules/form-builder/services/database/factory.ts

import { DatabaseService } from './interface';
import { PostgreSQLService } from './postgresql.service';

export type DatabaseType = 'postgresql';

export class DatabaseServiceFactory {
  private static instance: DatabaseService | null = null;
  private static currentType: DatabaseType | null = null;

  static create(type: DatabaseType): DatabaseService {
    // Return existing instance if same type
    if (this.instance && this.currentType === type) {
      return this.instance;
    }

    // Create new instance
    switch (type) {
      case 'postgresql':
        this.instance = new PostgreSQLService();
        break;
      default:
        throw new Error(`Database type ${type} not supported`);
    }

    this.currentType = type;
    console.log(`📊 Database service switched to: ${type.toUpperCase()}`);
    
    return this.instance;
  }

  static getCurrentType(): DatabaseType | null {
    return this.currentType;
  }

  static reset(): void {
    this.instance = null;
    this.currentType = null;
  }
} 