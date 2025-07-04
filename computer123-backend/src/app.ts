// src/app.ts - Express Application
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3990',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3995',
    version: '1.0.0'
  });
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    api: 'PostgreSQL Backend',
    timestamp: new Date().toISOString(),
    database: 'Connected' // Will be dynamic later
  });
});

// Basic API test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'PostgreSQL Backend is working!',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '3995'
  });
});

// Forms API endpoints (demo data for now)
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

// Form responses endpoints
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

// Stats endpoints
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

// Routes
import formsRoutes from './routes/forms.routes';
import menusRoutes from './routes/menus.routes';

app.use('/api/forms', formsRoutes);
app.use('/api/menus', menusRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;