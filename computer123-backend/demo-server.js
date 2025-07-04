// Demo Backend Server (بدون Database)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3995;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3990',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'demo',
    port: PORT,
    version: '1.0.0-demo'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    api: 'PostgreSQL Backend (Demo Mode)',
    timestamp: new Date().toISOString(),
    database: 'Demo Mode - No Database Connected',
    mode: 'demo'
  });
});

// Basic API test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Demo Backend is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Forms API endpoints (demo data)
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'GET /api/health',
      'GET /api/test',
      'GET /api/forms',
      'POST /api/forms',
      'GET /api/forms/:id',
      'PUT /api/forms/:id',
      'DELETE /api/forms/:id',
      'GET /api/templates',
      'GET /api/forms/:id/responses',
      'POST /api/forms/:id/responses',
      'GET /api/stats'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo Backend Server running on port ${PORT}`);
  console.log(`📊 Mode: Demo (No Database)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🌐 CORS Origin: http://localhost:3990`);
  console.log('');
  console.log('✅ Ready to accept connections!');
}); 