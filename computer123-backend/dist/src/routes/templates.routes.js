"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
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
exports.default = router;
//# sourceMappingURL=templates.routes.js.map