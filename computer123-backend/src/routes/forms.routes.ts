// src/routes/forms.routes.ts

import express from 'express';
import { FormsController } from '../controllers/forms.controller';
import { validateForm as validateFormMiddleware } from '../middleware/validate.middleware';

const router = express.Router();
const formsController = new FormsController();

// Forms CRUD
router.get('/', formsController.getForms.bind(formsController));
router.get('/:id', formsController.getFormById.bind(formsController));
router.post('/create', validateFormMiddleware, formsController.createForm.bind(formsController));
router.put('/:id', validateFormMiddleware, formsController.updateForm.bind(formsController));
router.delete('/:id', formsController.deleteForm.bind(formsController));

// Form operations
router.post('/:id/clone', formsController.cloneForm.bind(formsController));
router.patch('/:id/status', formsController.updateFormStatus.bind(formsController));

export default router; 