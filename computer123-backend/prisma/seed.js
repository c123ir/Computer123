"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    await prisma.formResponse.deleteMany();
    await prisma.form.deleteMany();
    await prisma.formTemplate.deleteMany();
    console.log('🗑️ Cleaned existing data');
    const templates = await prisma.formTemplate.createMany({
        data: [
            {
                id: 'contact',
                name: 'فرم تماس با ما',
                description: 'فرم ساده برای ارتباط مشتریان با شامل نام، ایمیل، موضوع و پیام',
                category: 'عمومی',
                formData: {
                    name: 'فرم تماس با ما',
                    description: 'فرم ساده برای ارتباط مشتریان',
                    fields: [
                        {
                            id: 'name',
                            type: 'text',
                            label: 'نام و نام خانوادگی',
                            placeholder: 'نام خود را وارد کنید',
                            required: true,
                            validation: { minLength: 2, maxLength: 100 },
                            styling: { width: '100%' }
                        },
                        {
                            id: 'email',
                            type: 'email',
                            label: 'ایمیل',
                            placeholder: 'example@email.com',
                            required: true,
                            validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$' },
                            styling: { width: '100%' }
                        },
                        {
                            id: 'subject',
                            type: 'text',
                            label: 'موضوع',
                            placeholder: 'موضوع پیام خود را وارد کنید',
                            required: true,
                            validation: { minLength: 5, maxLength: 200 },
                            styling: { width: '100%' }
                        },
                        {
                            id: 'message',
                            type: 'textarea',
                            label: 'پیام',
                            placeholder: 'متن پیام خود را بنویسید...',
                            required: true,
                            validation: { minLength: 10, maxLength: 1000 },
                            styling: { width: '100%', height: '120px' }
                        }
                    ],
                    settings: {
                        submitButtonText: 'ارسال پیام',
                        showProgressBar: false,
                        allowSaveDraft: false
                    },
                    styling: {
                        backgroundColor: '#f8fafc',
                        textColor: '#1f2937',
                        primaryColor: '#3b82f6'
                    }
                },
                tags: ['تماس', 'عمومی'],
                popularity: 95,
                isActive: true,
                isBuiltIn: true,
                createdBy: 'system'
            },
            {
                id: 'registration',
                name: 'فرم ثبت‌نام',
                description: 'ثبت‌نام در دوره‌ها یا رویدادها با اطلاعات شخصی کامل',
                category: 'آموزش',
                formData: {
                    name: 'فرم ثبت‌نام',
                    description: 'ثبت‌نام در دوره‌های آموزشی',
                    fields: [
                        {
                            id: 'fullName',
                            type: 'text',
                            label: 'نام و نام خانوادگی',
                            required: true,
                            validation: { minLength: 3 },
                            styling: { width: '100%' }
                        },
                        {
                            id: 'email',
                            type: 'email',
                            label: 'ایمیل',
                            required: true,
                            validation: {},
                            styling: { width: '50%' }
                        },
                        {
                            id: 'phone',
                            type: 'tel',
                            label: 'شماره تماس',
                            required: true,
                            validation: { pattern: '^09[0-9]{9}$' },
                            styling: { width: '50%' }
                        },
                        {
                            id: 'course',
                            type: 'select',
                            label: 'دوره مورد نظر',
                            required: true,
                            options: [
                                { value: 'react', label: 'React Development' },
                                { value: 'nodejs', label: 'Node.js Backend' },
                                { value: 'python', label: 'Python Programming' }
                            ],
                            validation: {},
                            styling: { width: '100%' }
                        },
                        {
                            id: 'experience',
                            type: 'radio',
                            label: 'سطح تجربه',
                            required: true,
                            options: [
                                { value: 'beginner', label: 'مبتدی' },
                                { value: 'intermediate', label: 'متوسط' },
                                { value: 'advanced', label: 'پیشرفته' }
                            ],
                            validation: {},
                            styling: { width: '100%' }
                        }
                    ],
                    settings: {
                        submitButtonText: 'ثبت نام',
                        showProgressBar: true,
                        allowSaveDraft: true
                    },
                    styling: {
                        backgroundColor: '#f0fdf4',
                        textColor: '#065f46',
                        primaryColor: '#10b981'
                    }
                },
                tags: ['ثبت‌نام', 'آموزش'],
                popularity: 88,
                isActive: true,
                isBuiltIn: true,
                createdBy: 'system'
            },
            {
                id: 'feedback',
                name: 'نظرسنجی رضایت',
                description: 'دریافت نظرات و پیشنهادات مشتریان با امتیازدهی',
                category: 'نظرسنجی',
                formData: {
                    name: 'نظرسنجی رضایت مشتری',
                    description: 'نظر شما برای ما مهم است',
                    fields: [
                        {
                            id: 'satisfaction',
                            type: 'radio',
                            label: 'میزان رضایت کلی',
                            required: true,
                            options: [
                                { value: '5', label: 'بسیار راضی' },
                                { value: '4', label: 'راضی' },
                                { value: '3', label: 'متوسط' },
                                { value: '2', label: 'ناراضی' },
                                { value: '1', label: 'بسیار ناراضی' }
                            ],
                            validation: {},
                            styling: { width: '100%' }
                        },
                        {
                            id: 'recommend',
                            type: 'radio',
                            label: 'آیا ما را به دیگران توصیه می‌کنید؟',
                            required: true,
                            options: [
                                { value: 'yes', label: 'بله، حتماً' },
                                { value: 'maybe', label: 'احتمالاً' },
                                { value: 'no', label: 'خیر' }
                            ],
                            validation: {},
                            styling: { width: '100%' }
                        },
                        {
                            id: 'comments',
                            type: 'textarea',
                            label: 'نظرات و پیشنهادات',
                            placeholder: 'لطفاً نظرات خود را با ما در میان بگذارید...',
                            required: false,
                            validation: { maxLength: 500 },
                            styling: { width: '100%', height: '100px' }
                        }
                    ],
                    settings: {
                        submitButtonText: 'ارسال نظر',
                        showProgressBar: false,
                        allowSaveDraft: false
                    },
                    styling: {
                        backgroundColor: '#fefce8',
                        textColor: '#a16207',
                        primaryColor: '#eab308'
                    }
                },
                tags: ['نظرسنجی', 'رضایت'],
                popularity: 92,
                isActive: true,
                isBuiltIn: true,
                createdBy: 'system'
            }
        ]
    });
    console.log(`✅ Created ${templates.count} form templates`);
    const sampleForms = await prisma.form.createMany({
        data: [
            {
                name: 'فرم ثبت‌نام دوره برنامه‌نویسی',
                description: 'فرم ثبت‌نام برای دوره‌های آموزشی برنامه‌نویسی',
                fields: [
                    {
                        id: 'name',
                        type: 'text',
                        label: 'نام کامل',
                        required: true,
                        validation: { minLength: 2 },
                        styling: { width: '100%' }
                    },
                    {
                        id: 'email',
                        type: 'email',
                        label: 'ایمیل',
                        required: true,
                        validation: {},
                        styling: { width: '100%' }
                    }
                ],
                settings: {
                    submitButtonText: 'ثبت نام',
                    showProgressBar: true
                },
                styling: {
                    backgroundColor: '#f8fafc',
                    textColor: '#1f2937',
                    primaryColor: '#3b82f6'
                },
                metadata: {
                    createdBy: 'علی احمدی',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    status: 'published',
                    stats: {
                        totalViews: 150,
                        totalSubmissions: 42,
                        completionRate: 85
                    }
                },
                status: 'PUBLISHED',
                category: 'آموزش',
                tags: ['ثبت‌نام', 'دوره'],
                createdBy: 'علی احمدی'
            },
            {
                name: 'فرم نظرسنجی رضایت مشتری',
                description: 'نظرسنجی از رضایت مشتریان از خدمات ارائه شده',
                fields: [
                    {
                        id: 'rating',
                        type: 'radio',
                        label: 'امتیاز کلی',
                        required: true,
                        options: [
                            { value: '5', label: '5 - عالی' },
                            { value: '4', label: '4 - خوب' },
                            { value: '3', label: '3 - متوسط' },
                            { value: '2', label: '2 - ضعیف' },
                            { value: '1', label: '1 - بسیار ضعیف' }
                        ],
                        validation: {},
                        styling: { width: '100%' }
                    }
                ],
                settings: {
                    submitButtonText: 'ارسال نظر',
                    showProgressBar: false
                },
                styling: {
                    backgroundColor: '#f0fdf4',
                    textColor: '#065f46',
                    primaryColor: '#10b981'
                },
                metadata: {
                    createdBy: 'مریم کریمی',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    version: 1,
                    status: 'published',
                    stats: {
                        totalViews: 89,
                        totalSubmissions: 23,
                        completionRate: 92
                    }
                },
                status: 'PUBLISHED',
                category: 'نظرسنجی',
                tags: ['رضایت', 'مشتری'],
                createdBy: 'مریم کریمی'
            },
            {
                name: 'فرم درخواست پشتیبانی فنی',
                description: 'فرم ثبت درخواست پشتیبانی فنی و رفع مشکل',
                fields: [
                    {
                        id: 'issue',
                        type: 'textarea',
                        label: 'شرح مشکل',
                        required: true,
                        validation: { minLength: 10 },
                        styling: { width: '100%', height: '120px' }
                    }
                ],
                settings: {
                    submitButtonText: 'ارسال درخواست',
                    showProgressBar: false
                },
                styling: {
                    backgroundColor: '#fef2f2',
                    textColor: '#991b1b',
                    primaryColor: '#ef4444'
                },
                metadata: {
                    createdBy: 'حسن محمدی',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    status: 'draft',
                    stats: {
                        totalViews: 0,
                        totalSubmissions: 0,
                        completionRate: 0
                    }
                },
                status: 'DRAFT',
                category: 'پشتیبانی',
                tags: ['پشتیبانی', 'فنی'],
                createdBy: 'حسن محمدی'
            }
        ]
    });
    console.log(`✅ Created ${sampleForms.count} sample forms`);
    const forms = await prisma.form.findMany();
    if (forms.length > 0) {
        const responses = await prisma.formResponse.createMany({
            data: [
                {
                    formId: forms[0].id,
                    answers: {
                        name: 'احمد رضایی',
                        email: 'ahmad@example.com'
                    },
                    metadata: {
                        submittedAt: new Date().toISOString(),
                        duration: 120,
                        formVersion: 1
                    },
                    status: 'COMPLETED',
                    submitterInfo: {
                        ip: '192.168.1.100',
                        userAgent: 'Mozilla/5.0...'
                    }
                },
                {
                    formId: forms[1].id,
                    answers: {
                        rating: '5'
                    },
                    metadata: {
                        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        duration: 45,
                        formVersion: 1
                    },
                    status: 'COMPLETED',
                    submitterInfo: {
                        ip: '192.168.1.101'
                    }
                }
            ]
        });
        console.log(`✅ Created ${responses.count} sample responses`);
    }
    console.log('🎉 Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
-- -
    {
        "scripts": {
            "db:seed": "tsx prisma/seed.ts"
        }
    };
//# sourceMappingURL=seed.js.map