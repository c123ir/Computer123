"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forms_controller_1 = require("../controllers/forms.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = express_1.default.Router();
const formsController = new forms_controller_1.FormsController();
router.get('/', formsController.getForms.bind(formsController));
router.get('/:id', formsController.getFormById.bind(formsController));
router.post('/create', validate_middleware_1.validateForm, formsController.createForm.bind(formsController));
router.put('/:id', validate_middleware_1.validateForm, formsController.updateForm.bind(formsController));
router.delete('/:id', formsController.deleteForm.bind(formsController));
router.post('/:id/clone', formsController.cloneForm.bind(formsController));
router.patch('/:id/status', formsController.updateFormStatus.bind(formsController));
exports.default = router;
//# sourceMappingURL=forms.routes.js.map