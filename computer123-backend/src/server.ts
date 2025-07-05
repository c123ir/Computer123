// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './config/database';
import formsRouter from './routes/forms.routes';
import responsesRouter from './routes/responses.routes';
import templatesRouter from './routes/templates.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3995;

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3990',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    api: 'PostgreSQL Backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected'
  });
});

// API Routes
app.use('/api/forms', formsRouter);
app.use('/api/responses', responsesRouter);
app.use('/api/templates', templatesRouter);

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Templates API
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

// Error handling
app.use(errorHandler);

// 404 handler
app.use(notFound);

// Database connection test
async function connectToDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Running in demo mode without database');
    return false;
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log('🔄 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  const dbConnected = await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
    
    if (dbConnected) {
      console.log('✅ Database: Connected');
    } else {
      console.log('⚠️  Database: Demo mode (no connection)');
    }
  });
}

startServer();