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
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected'
    });
});
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});
app.get('/api/forms', async (req, res) => {
    try {
        res.json({
            success: true,
            data: [],
            message: 'Forms endpoint is working (empty for now)'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
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
                popularity: 95
            },
            {
                id: 'registration',
                name: 'فرم ثبت‌نام',
                description: 'ثبت‌نام در دوره‌ها یا رویدادها',
                category: 'آموزش',
                popularity: 88
            }
        ]
    });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});
async function connectToDatabase() {
    try {
        await database_1.prisma.$connect();
        console.log('✅ Connected to PostgreSQL database');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
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
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
    });
}
startServer();
//# sourceMappingURL=server.js.map