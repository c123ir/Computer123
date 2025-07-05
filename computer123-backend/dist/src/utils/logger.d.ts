interface LogData {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data?: any;
    timestamp?: string;
}
export declare class Logger {
    static log({ level, message, data }: Omit<LogData, 'timestamp'>): void;
    static info(message: string, data?: any): void;
    static warn(message: string, data?: any): void;
    static error(message: string, data?: any): void;
    static debug(message: string, data?: any): void;
}
export {};
//# sourceMappingURL=logger.d.ts.map