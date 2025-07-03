"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = exports.FormService = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const forms_routes_1 = __importDefault(require("./routes/forms.routes"));
const responses_routes_1 = __importDefault(require("./routes/responses.routes"));
const templates_routes_1 = __importDefault(require("./routes/templates.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
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
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/forms', forms_routes_1.default);
app.use('/api/responses', responses_routes_1.default);
app.use('/api/templates', templates_routes_1.default);
app.use(notFound_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
-- -
;
const client_1 = require("@prisma/client");
const PORT = process.env.PORT || 3995;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to PostgreSQL database');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
async function gracefulShutdown() {
    console.log('🔄 Shutting down gracefully...');
    await prisma.$disconnect();
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
    });
}
startServer();
-- -
;
const prisma = globalThis.__prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
exports.prisma = prisma;
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}
-- -
;
-- -
;
const client_2 = require("@prisma/client");
class FormService {
    async createForm(data) {
        const form = await prisma.form.create({
            data: {
                name: data.name,
                description: data.description,
                fields: data.fields,
                settings: data.settings,
                styling: data.styling,
                metadata: data.metadata,
                status: data.status,
                category: data.category,
                tags: data.tags || [],
                createdBy: data.metadata.createdBy,
            }
        });
        return this.transformFormFromDB(form);
    }
    async getFormById(id) {
        const form = await prisma.form.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { responses: true }
                }
            }
        });
        if (!form)
            return null;
        return this.transformFormFromDB(form);
    }
    async getForms(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.category) {
            where.category = filters.category;
        }
        if (filters.createdBy) {
            where.createdBy = filters.createdBy;
        }
        const orderBy = {};
        const sortBy = filters.sortBy || 'updatedAt';
        const sortOrder = filters.sortOrder || 'desc';
        if (sortBy === 'responses') {
            orderBy.responses = { _count: sortOrder };
        }
        else {
            orderBy[sortBy] = sortOrder;
        }
        const [forms, total] = await Promise.all([
            prisma.form.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { responses: true }
                    }
                }
            }),
            prisma.form.count({ where })
        ]);
        const transformedForms = forms.map(form => this.transformFormFromDB(form));
        return {
            success: true,
            data: transformedForms,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async updateForm(id, data) {
        try {
            const form = await prisma.form.update({
                where: { id },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.fields && { fields: data.fields }),
                    ...(data.settings && { settings: data.settings }),
                    ...(data.styling && { styling: data.styling }),
                    ...(data.metadata && { metadata: data.metadata }),
                    ...(data.status && { status: data.status }),
                    ...(data.category !== undefined && { category: data.category }),
                    ...(data.tags && { tags: data.tags }),
                    ...(data.metadata?.updatedBy && { updatedBy: data.metadata.updatedBy }),
                }
            });
            return this.transformFormFromDB(form);
        }
        catch (error) {
            if (error instanceof client_2.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteForm(id) {
        try {
            await prisma.form.delete({
                where: { id }
            });
            return true;
        }
        catch (error) {
            if (error instanceof client_2.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false;
            }
            throw error;
        }
    }
    async cloneForm(id, createdBy) {
        const originalForm = await this.getFormById(id);
        if (!originalForm)
            return null;
        const clonedData = {
            ...originalForm,
            name: `${originalForm.name} (کپی)`,
            status: 'DRAFT',
            metadata: {
                ...originalForm.metadata,
                createdBy,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };
        delete clonedData.id;
        delete clonedData.createdAt;
        delete clonedData.updatedAt;
        return await this.createForm(clonedData);
    }
    transformFormFromDB(dbForm) {
        return {
            id: dbForm.id,
            name: dbForm.name,
            description: dbForm.description,
            fields: dbForm.fields,
            settings: dbForm.settings,
            styling: dbForm.styling,
            metadata: {
                ...dbForm.metadata,
                ...(dbForm._count?.responses !== undefined && {
                    stats: {
                        ...dbForm.metadata.stats,
                        totalSubmissions: dbForm._count.responses
                    }
                })
            },
            status: dbForm.status,
            category: dbForm.category,
            tags: dbForm.tags,
            createdAt: dbForm.createdAt.toISOString(),
            updatedAt: dbForm.updatedAt.toISOString()
        };
    }
}
exports.FormService = FormService;
-- -
;
const form_service_1 = require("../services/form.service");
const formService = new form_service_1.FormService();
class FormsController {
    async getForms(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                status: req.query.status,
                category: req.query.category,
                createdBy: req.query.createdBy,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            };
            const result = await formService.getForms(filters);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getFormById(req, res, next) {
        try {
            const { id } = req.params;
            const form = await formService.getFormById(id);
            if (!form) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            res.json({
                success: true,
                data: form
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createForm(req, res, next) {
        try {
            const formData = {
                ...req.body,
                metadata: {
                    ...req.body.metadata,
                    createdBy: req.body.metadata?.createdBy || 'system',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    status: req.body.status || 'DRAFT'
                }
            };
            const form = await formService.createForm(formData);
            res.status(201).json({
                success: true,
                data: form,
                message: 'Form created successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateForm(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                ...req.body,
                metadata: {
                    ...req.body.metadata,
                    updatedAt: new Date().toISOString(),
                    updatedBy: req.body.metadata?.updatedBy || 'system'
                }
            };
            const form = await formService.updateForm(id, updateData);
            if (!form) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            res.json({
                success: true,
                data: form,
                message: 'Form updated successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteForm(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await formService.deleteForm(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            res.json({
                success: true,
                message: 'Form deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cloneForm(req, res, next) {
        try {
            const { id } = req.params;
            const { createdBy } = req.body;
            const clonedForm = await formService.cloneForm(id, createdBy || 'system');
            if (!clonedForm) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            res.status(201).json({
                success: true,
                data: clonedForm,
                message: 'Form cloned successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateFormStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, updatedBy } = req.body;
            const form = await formService.updateForm(id, {
                status,
                metadata: {
                    updatedBy: updatedBy || 'system',
                    updatedAt: new Date().toISOString()
                }
            });
            if (!form) {
                return res.status(404).json({
                    success: false,
                    error: 'Form not found'
                });
            }
            res.json({
                success: true,
                data: form,
                message: `Form ${status.toLowerCase()} successfully`
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FormsController = FormsController;
//# sourceMappingURL=app.js.map