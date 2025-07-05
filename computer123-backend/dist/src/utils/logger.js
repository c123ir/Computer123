"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static log({ level, message, data }) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...(data && { data })
        };
        if (process.env.NODE_ENV === 'development') {
            console.log(JSON.stringify(logEntry, null, 2));
        }
        else {
            console.log(JSON.stringify(logEntry));
        }
    }
    static info(message, data) {
        this.log({ level: 'info', message, data });
    }
    static warn(message, data) {
        this.log({ level: 'warn', message, data });
    }
    static error(message, data) {
        this.log({ level: 'error', message, data });
    }
    static debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            this.log({ level: 'debug', message, data });
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map