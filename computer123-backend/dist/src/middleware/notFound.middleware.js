"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const logger_1 = require("../utils/logger");
const notFound = (req, res) => {
    logger_1.Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        availableRoutes: {
            forms: '/api/forms',
            health: '/health'
        }
    });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.middleware.js.map