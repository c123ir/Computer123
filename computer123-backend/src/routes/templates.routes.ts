// src/routes/templates.routes.ts

import { Router } from 'express';
// TemplatesController will be implemented later

const router = Router();

// Placeholder routes for now
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

export default router; 