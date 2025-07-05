"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3990',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '3995',
        version: '1.0.0'
    });
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        api: 'PostgreSQL Backend',
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});
app.get('/api/test', (req, res) => {
    res.json({
        message: 'PostgreSQL Backend is working!',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || '3995'
    });
});
app.get('/api/forms', (req, res) => {
    res.json({
        success: true,
        data: [],
        pagination: {
            page: 1,
            totalPages: 1,
            total: 0,
            limit: 20
        },
        message: 'Forms endpoint working (demo mode)'
    });
});
app.post('/api/forms', (req, res) => {
    const newForm = {
        id: 'form_' + Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'DRAFT'
    };
    res.status(201).json({
        success: true,
        data: newForm,
        message: 'Form created successfully (demo mode)'
    });
});
app.get('/api/forms/:id', (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.params.id,
            name: 'Demo Form',
            description: 'This is a demo form',
            fields: [],
            settings: {},
            styling: {},
            metadata: {},
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    });
});
app.put('/api/forms/:id', (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.params.id,
            ...req.body,
            updatedAt: new Date().toISOString()
        },
        message: 'Form updated successfully (demo mode)'
    });
});
app.delete('/api/forms/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Form deleted successfully (demo mode)'
    });
});
app.get('/api/templates', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'contact',
                name: 'فرم تماس با ما',
                description: 'فرم ساده برای ارتباط مشتریان',
                category: 'عمومی',
                popularity: 95,
                isActive: true
            },
            {
                id: 'registration',
                name: 'فرم ثبت‌نام',
                description: 'ثبت‌نام در دوره‌ها یا رویدادها',
                category: 'آموزش',
                popularity: 88,
                isActive: true
            },
            {
                id: 'feedback',
                name: 'فرم نظرسنجی',
                description: 'جمع‌آوری نظرات و پیشنهادات',
                category: 'بازاریابی',
                popularity: 76,
                isActive: true
            }
        ]
    });
});
app.get('/api/forms/:id/responses', (req, res) => {
    res.json({
        success: true,
        data: [],
        pagination: {
            page: 1,
            totalPages: 1,
            total: 0,
            limit: 20
        },
        message: 'Form responses endpoint working (demo mode)'
    });
});
app.post('/api/forms/:id/responses', (req, res) => {
    const newResponse = {
        id: 'response_' + Date.now(),
        formId: req.params.id,
        answers: req.body.answers || {},
        submitterInfo: req.body.submitterInfo || {},
        metadata: req.body.metadata || {},
        status: 'COMPLETED',
        submittedAt: new Date().toISOString()
    };
    res.status(201).json({
        success: true,
        data: newResponse,
        message: 'Response submitted successfully (demo mode)'
    });
});
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalForms: 0,
            totalResponses: 0,
            activeForms: 0,
            databaseSize: 0,
            performance: {
                averageQueryTime: 0,
                todayQueries: 0,
                recentErrors: 0
            }
        }
    });
});
const forms_routes_1 = __importDefault(require("./routes/forms.routes"));
const menus_routes_1 = __importDefault(require("./routes/menus.routes"));
app.use('/api/forms', forms_routes_1.default);
app.use('/api/menus', menus_routes_1.default);
app.use(notFound_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map