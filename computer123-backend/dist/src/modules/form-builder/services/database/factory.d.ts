import { DatabaseService } from './interface';
export type DatabaseType = 'postgresql';
export declare class DatabaseServiceFactory {
    private static instance;
    private static currentType;
    static create(type: DatabaseType): DatabaseService;
    static getCurrentType(): DatabaseType | null;
    static reset(): void;
}
//# sourceMappingURL=factory.d.ts.map