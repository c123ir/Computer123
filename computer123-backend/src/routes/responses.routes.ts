// src/routes/responses.routes.ts

import { Router } from 'express';
// ResponsesController will be implemented later

const router = Router();

// Placeholder routes for now
router.get('/', (req, res) => {
  res.json({ message: 'Responses endpoints - Coming soon!' });
});

export default router; 