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
const database_1 = require("./config/database");
const forms_routes_1 = __importDefault(require("./routes/forms.routes"));
const responses_routes_1 = __importDefault(require("./routes/responses.routes"));
const templates_routes_1 = __importDefault(require("./routes/templates.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3995;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3990',
    credentials: true
}));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        api: 'PostgreSQL Backend',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected'
    });
});
app.use('/api/forms', forms_routes_1.default);
app.use('/api/responses', responses_routes_1.default);
app.use('/api/templates', templates_routes_1.default);
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        port: PORT
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
app.use(error_middleware_1.errorHandler);
app.use(notFound_middleware_1.notFound);
async function connectToDatabase() {
    try {
        await database_1.prisma.$connect();
        console.log('✅ Connected to PostgreSQL database');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        console.log('⚠️  Running in demo mode without database');
        return false;
    }
}
async function gracefulShutdown() {
    console.log('🔄 Shutting down gracefully...');
    await database_1.prisma.$disconnect();
    process.exit(0);
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
async function startServer() {
    const dbConnected = await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
        if (dbConnected) {
            console.log('✅ Database: Connected');
        }
        else {
            console.log('⚠️  Database: Demo mode (no connection)');
        }
    });
}
startServer();
//# sourceMappingURL=server.js.map