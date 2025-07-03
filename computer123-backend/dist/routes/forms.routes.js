"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.validateForm = exports.notFound = exports.errorHandler = void 0;
const express_1 = require("express");
const forms_controller_1 = require("../controllers/forms.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
const formsController = new forms_controller_1.FormsController();
router.get('/', formsController.getForms.bind(formsController));
router.get('/:id', formsController.getFormById.bind(formsController));
router.post('/', exports.validateForm, formsController.createForm.bind(formsController));
router.put('/:id', exports.validateForm, formsController.updateForm.bind(formsController));
router.delete('/:id', formsController.deleteForm.bind(formsController));
router.post('/:id/clone', formsController.cloneForm.bind(formsController));
router.patch('/:id/status', formsController.updateFormStatus.bind(formsController));
exports.default = router;
-- -
;
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Responses endpoints - Coming soon!' });
});
exports.default = router;
-- -
;
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        message: 'Templates endpoints - Coming soon!',
        templates: [
            {
                id: 'contact',
                name: 'فرم تماس با ما',
                category: 'عمومی',
                popularity: 95
            },
            {
                id: 'registration',
                name: 'فرم ثبت‌نام',
                category: 'آموزش',
                popularity: 88
            }
        ]
    });
});
exports.default = router;
-- -
;
const client_1 = require("@prisma/client");
const errorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Duplicate entry found';
                break;
            case 'P2025':
                statusCode = 404;
                message = 'Record not found';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Foreign key constraint failed';
                break;
            default:
                statusCode = 400;
                message = 'Database operation failed';
        }
    }
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query
        });
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack
        })
    });
};
exports.errorHandler = errorHandler;
-- -
;
const notFound = (req, res) => {
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
-- -
;
const validateForm = (req, res, next) => {
    const { name, fields } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Form name is required'
        });
    }
    if (!fields || !Array.isArray(fields)) {
        return res.status(400).json({
            success: false,
            error: 'Form fields must be an array'
        });
    }
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!field.id || !field.type || !field.label) {
            return res.status(400).json({
                success: false,
                error: `Field at index ${i} is missing required properties (id, type, label)`
            });
        }
    }
    if (name.length > 255) {
        return res.status(400).json({
            success: false,
            error: 'Form name cannot exceed 255 characters'
        });
    }
    next();
};
exports.validateForm = validateForm;
-- -
    interface;
LogData;
{
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data ?  : any;
    timestamp ?  : string;
}
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
-- -
    {
        "scripts": {
            "dev": "nodemon src/server.ts",
            "build": "tsc",
            "start": "node dist/server.js",
            "db:generate": "prisma generate",
            "db:migrate": "prisma migrate dev",
            "db:studio": "prisma studio",
            "db:seed": "tsx prisma/seed.ts",
            "db:reset": "prisma migrate reset",
            "lint": "eslint src/**/*.ts",
            "test": "jest",
            "type-check": "tsc --noEmit"
        }
    };
//# sourceMappingURL=forms.routes.js.map