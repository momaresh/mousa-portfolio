import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.projectTechnology.deleteMany()
  await prisma.projectHighlight.deleteMany()
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.education.deleteMany()
  await prisma.service.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.integration.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.admin.deleteMany()

  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.create({
    data: {
      email: 'admin@mousamarsh.com',
      password: hashedPassword,
      name: 'Mousa Marsh',
    },
  })

  await prisma.profile.create({
    data: {
      name: 'Mousa Abdulhafiz Qaid Marsh',
      nameAr: 'موسى عبدالحافظ قائد مارش',
      title: 'Accountant & Financial Operations',
      titleAr: 'محاسب والعمليات المالية',
      subtitle:
        'Accounting, financial reporting, sales support, and branch operations — Mutakamil Plus & Onyx Pro.',
      subtitleAr:
        'محاسبة وتقارير مالية ودعم مبيعات وتشغيل فروع — باستخدام المتكامل بلس وأونكس برو.',
      bio: 'I seek a role in accounting or sales where I can apply my Information Technology background and practical experience to support the organization\'s goals with accurate financial work and reliable ERP workflows.',
      bioAr:
        'أسعى للحصول على وظيفة في مجال المحاسبة أو المبيعات لأتمكن من توظيف خبراتي الأكاديمية في تقنية المعلومات وخبراتي العملية بما يساهم في تحقيق أهداف المنشأة.',
      email: 'mousamarsh111@gmail.com',
      phone: '+966594136051',
      whatsapp: '+966594136051',
      linkedin: null,
      github: null,
      instagram: null,
      facebook: null,
      location: 'Bani Ali, Mudhaykhirah, Ibb — Yemen',
      locationAr: 'بني علي — مذيخرة — إب، اليمن',
      yearsOfExp: 7,
      projectsCount: 7,
      available: true,
      avatarUrl: '/images/avatar.jpg',
    },
  })

  const skills = [
    {
      name: 'Computer & accounting systems',
      nameAr: 'استخدام الكمبيوتر والأنظمة المحاسبية',
      level: 'Advanced',
      category: 'Accounting',
      categoryAr: 'المحاسبة',
      icon: 'monitor',
      sortOrder: 1,
    },
    {
      name: 'Financial Accounting',
      nameAr: 'المحاسبة المالية',
      level: 'Advanced',
      category: 'Accounting',
      categoryAr: 'المحاسبة',
      icon: 'calculator',
      sortOrder: 2,
    },
    {
      name: 'Financial Reporting',
      nameAr: 'إعداد التقارير المالية',
      level: 'Advanced',
      category: 'Accounting',
      categoryAr: 'المحاسبة',
      icon: 'file-text',
      sortOrder: 3,
    },
    {
      name: 'Internal Auditing',
      nameAr: 'التدقيق الداخلي',
      level: 'Advanced',
      category: 'Accounting',
      categoryAr: 'المحاسبة',
      icon: 'shield',
      sortOrder: 4,
    },
    {
      name: 'Mutakamil Plus',
      nameAr: 'المتكامل بلس',
      level: 'Advanced',
      category: 'Systems',
      categoryAr: 'الأنظمة',
      icon: 'database',
      sortOrder: 1,
    },
    {
      name: 'Onyx Pro',
      nameAr: 'أونكس برو',
      level: 'Advanced',
      category: 'Systems',
      categoryAr: 'الأنظمة',
      icon: 'layers',
      sortOrder: 2,
    },
    {
      name: 'Accounting software usage',
      nameAr: 'استخدام برامج المحاسبة',
      level: 'Advanced',
      category: 'Systems',
      categoryAr: 'الأنظمة',
      icon: 'laptop',
      sortOrder: 3,
    },
    {
      name: 'Arabic',
      nameAr: 'العربية',
      level: 'Advanced',
      category: 'Languages',
      categoryAr: 'اللغات',
      icon: 'languages',
      sortOrder: 1,
    },
    {
      name: 'English',
      nameAr: 'الإنجليزية',
      level: 'Intermediate',
      category: 'Languages',
      categoryAr: 'اللغات',
      icon: 'languages',
      sortOrder: 2,
    },
    {
      name: 'Teamwork',
      nameAr: 'العمل بروح الفريق',
      level: 'Advanced',
      category: 'Soft Skills',
      categoryAr: 'مهارات شخصية',
      icon: 'users',
      sortOrder: 1,
    },
    {
      name: 'Working under pressure',
      nameAr: 'القدرة على العمل تحت الضغط',
      level: 'Advanced',
      category: 'Soft Skills',
      categoryAr: 'مهارات شخصية',
      icon: 'zap',
      sortOrder: 2,
    },
    {
      name: 'Learning new work techniques',
      nameAr: 'تعلّم تقنيات جديدة في العمل',
      level: 'Advanced',
      category: 'Soft Skills',
      categoryAr: 'مهارات شخصية',
      icon: 'book',
      sortOrder: 3,
    },
    {
      name: 'Planning & organization',
      nameAr: 'التخطيط والتنظيم',
      level: 'Advanced',
      category: 'Soft Skills',
      categoryAr: 'مهارات شخصية',
      icon: 'check-circle',
      sortOrder: 4,
    },
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }

  await prisma.education.create({
    data: {
      degree: 'Bachelor of Information Technology',
      degreeAr: 'بكالوريوس تقنية معلومات',
      institution: 'Dhamar University — Faculty of Computers and Information Systems',
      institutionAr: 'جامعة ذمار — كلية الحاسوب ونظم المعلومات',
      description: 'Bachelor’s degree in Information Technology.',
      descriptionAr: 'بكالوريوس تقنية معلومات — كلية الحاسوب ونظم المعلومات.',
      startDate: '2011-01',
      endDate: '2015-01',
      isCurrent: false,
      location: 'Dhamar, Yemen',
      sortOrder: 1,
    },
  })

  const experiences = [
    {
      company: 'Al-Wakeel Al-Shamel (Games)',
      companyAr: 'الوكيل الشامل للألعاب',
      position: 'Branch Manager',
      positionAr: 'مسؤول فرع',
      description:
        'Branch manager in Jeddah — sales, operations management, and work on Onyx Pro.',
      descriptionAr:
        'مسؤول فرع في جدة — المبيعات وإدارة العمل واستخدام نظام الأونكس برو.',
      startDate: '2024-10',
      endDate: '2025-12',
      isCurrent: false,
      location: 'Jeddah, Saudi Arabia',
      type: 'fulltime',
      sortOrder: 1,
    },
    {
      company: 'Al-Wakeel Al-Shamel (Games)',
      companyAr: 'الوكيل الشامل للألعاب',
      position: 'Warehouse / Installation Worker',
      positionAr: 'عامل',
      description:
        'Loading, unloading, and installation work for the games department.',
      descriptionAr:
        'العمل في التحميل والتنزيل والتركيب لقسم الألعاب.',
      startDate: '2025-04',
      endDate: '2025-10',
      isCurrent: false,
      location: 'Jeddah, Saudi Arabia',
      type: 'fulltime',
      sortOrder: 2,
    },
    {
      company: 'Al-Ajji Foodstuffs',
      companyAr: 'العجي للمواد الغذائية',
      position: 'Accountant & Sales',
      positionAr: 'محاسب ومبيعات',
      description:
        'Accounting and sales support using Onyx Pro — Ibb / Al-Radmah.',
      descriptionAr:
        'محاسب ومبيعات باستخدام نظام الأونكس برو — إب / الرضمة.',
      startDate: '2024-03',
      endDate: '2024-04',
      isCurrent: false,
      location: 'Ibb — Al-Radmah, Yemen',
      type: 'fulltime',
      sortOrder: 3,
    },
    {
      company: 'Al-Khodeiri Exchange & General Trade',
      companyAr: 'الخضيري للصرافة والتجارة العامة',
      position: 'Accounts Auditor',
      positionAr: 'مراجع حسابات',
      description:
        'Year-end accounts auditor for Al-Khodeiri construction-materials branches (Aden and Al-Bayda).',
      descriptionAr:
        'مراجع حسابات سنوي عام لفروع الخضيري لمواد البناء (فرع عدن وفرع البيضاء).',
      startDate: '2020-01',
      endDate: '2023-01',
      isCurrent: false,
      location: 'Aden — Al-Bayda, Yemen',
      type: 'fulltime',
      sortOrder: 4,
    },
    {
      company: 'Al-Khodeiri Exchange & General Trade',
      companyAr: 'الخضيري للصرافة والتجارة العامة',
      position: 'Accounts & Purchasing Accountant',
      positionAr: 'محاسب',
      description:
        'Accounts and purchasing accountant for the construction-materials department, Al-Bayda branch, using Onyx Pro.',
      descriptionAr:
        'مسؤول على الحسابات والمشتريات لقسم مواد البناء — فرع البيضاء، باستخدام نظام الأونكس برو.',
      startDate: '2020-01',
      endDate: '2023-01',
      isCurrent: false,
      location: 'Al-Bayda, Yemen',
      type: 'fulltime',
      sortOrder: 5,
    },
    {
      company: 'Al-Khodeiri Exchange & General Trade',
      companyAr: 'الخضيري للصرافة والتجارة العامة',
      position: 'Accountant',
      positionAr: 'محاسب',
      description:
        'Accountant and administrator for the construction-materials department, Al-Bayda branch, using Mutakamil Plus.',
      descriptionAr:
        'العمل كمحاسب وإداري لقسم مواد البناء — فرع البيضاء، باستخدام نظام المتكامل بلس.',
      startDate: '2017-10',
      endDate: '2020-01',
      isCurrent: false,
      location: 'Al-Bayda, Yemen',
      type: 'fulltime',
      sortOrder: 6,
    },
    {
      company: 'Al-Khodeiri Hypermarket',
      companyAr: 'هايبر ماركت الخضيري',
      position: 'Hypermarket Accountant',
      positionAr: 'محاسب هايبر ماركت',
      description:
        'Establishing the accounting system and setting up work operations at Al-Khodeiri Hypermarket, Al-Bayda.',
      descriptionAr:
        'تأسيس النظام المحاسبي وتهيئة سير العمل في هايبر ماركت الخضيري — البيضاء.',
      startDate: '2017-04',
      endDate: '2017-10',
      isCurrent: false,
      location: 'Al-Bayda, Yemen',
      type: 'fulltime',
      sortOrder: 7,
    },
  ]

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp })
  }

  const services = [
    {
      title: 'Financial Accounting',
      titleAr: 'المحاسبة المالية',
      description: 'Day-to-day accounting for retail and commercial businesses.',
      descriptionAr: 'أعمال المحاسبة اليومية لمنشآت التجزئة والتجارة.',
      icon: 'calculator',
      features: JSON.stringify([
        'Journal entries and ledgers',
        'Account follow-up',
        'Retail & trade accounting',
        'Arabic documentation',
      ]),
      featuresAr: JSON.stringify([
        'القيود اليومية والدفاتر',
        'متابعة الحسابات',
        'محاسبة التجزئة والتجارة',
        'توثيق بالعربية',
      ]),
      sortOrder: 1,
    },
    {
      title: 'Purchasing Accounts',
      titleAr: 'حسابات المشتريات',
      description: 'Purchasing and inventory-related accounts on ERP systems.',
      descriptionAr: 'حسابات المشتريات والمخزون على أنظمة ERP.',
      icon: 'package',
      features: JSON.stringify([
        'Supplier accounts',
        'Purchase cycles',
        'Onyx Pro workflows',
        'Branch documentation',
      ]),
      featuresAr: JSON.stringify([
        'حسابات الموردين',
        'دورات المشتريات',
        'سير عمل أونكس برو',
        'توثيق الفروع',
      ]),
      sortOrder: 2,
    },
    {
      title: 'Financial Reporting',
      titleAr: 'التقارير المالية',
      description: 'Operational and financial reports for management follow-up.',
      descriptionAr: 'تقارير تشغيلية ومالية لمتابعة الإدارة.',
      icon: 'file-text',
      features: JSON.stringify([
        'Periodic reports',
        'Sales & accounts summaries',
        'Clear organized outputs',
      ]),
      featuresAr: JSON.stringify([
        'تقارير دورية',
        'ملخصات المبيعات والحسابات',
        'مخرجات واضحة ومنظمة',
      ]),
      sortOrder: 3,
    },
    {
      title: 'Internal Audit Support',
      titleAr: 'دعم التدقيق الداخلي',
      description: 'Year-end and routine account review support across branches.',
      descriptionAr: 'دعم مراجعة الحسابات الدورية ونهاية العام عبر الفروع.',
      icon: 'shield',
      features: JSON.stringify([
        'Document verification',
        'Branch account review',
        'Year-end audit support',
      ]),
      featuresAr: JSON.stringify([
        'التحقق من المستندات',
        'مراجعة حسابات الفروع',
        'دعم المراجعة السنوية',
      ]),
      sortOrder: 4,
    },
    {
      title: 'Sales Accounting Support',
      titleAr: 'دعم محاسبة المبيعات',
      description: 'Combined accounting and sales support in retail environments.',
      descriptionAr: 'دعم محاسبي ومبيعات في بيئات التجزئة.',
      icon: 'trending-up',
      features: JSON.stringify([
        'Sales documentation',
        'Customer account follow-up',
        'ERP sales workflows',
      ]),
      featuresAr: JSON.stringify([
        'توثيق المبيعات',
        'متابعة حسابات العملاء',
        'سير عمل المبيعات على ERP',
      ]),
      sortOrder: 5,
    },
    {
      title: 'Branch Operations',
      titleAr: 'تشغيل الفروع',
      description: 'Branch coordination for sales, accounts, and daily operations.',
      descriptionAr: 'تنسيق الفرع بين المبيعات والحسابات والتشغيل اليومي.',
      icon: 'building',
      features: JSON.stringify([
        'Branch oversight',
        'Sales–accounts alignment',
        'Team coordination',
      ]),
      featuresAr: JSON.stringify([
        'الإشراف على الفرع',
        'مواءمة المبيعات والحسابات',
        'تنسيق الفريق',
      ]),
      sortOrder: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  const integrations = [
    {
      name: 'Mutakamil Plus',
      nameAr: 'المتكامل بلس',
      description: 'Retail and commercial accounting on Mutakamil Plus.',
      descriptionAr: 'محاسبة التجزئة والتجارة على نظام المتكامل بلس.',
      icon: 'monitor',
      category: 'erp',
      sortOrder: 1,
    },
    {
      name: 'Onyx Pro',
      nameAr: 'أونكس برو',
      description: 'Accounts, purchasing, sales, and branch operations on Onyx Pro.',
      descriptionAr: 'الحسابات والمشتريات والمبيعات وتشغيل الفروع على أونكس برو.',
      icon: 'database',
      category: 'erp',
      sortOrder: 2,
    },
    {
      name: 'Microsoft Office',
      nameAr: 'مايكروسوفت أوفيس',
      description: 'Office tools for lists, reports, and daily documentation.',
      descriptionAr: 'أدوات مكتبية للقوائم والتقارير والتوثيق اليومي.',
      icon: 'file-spreadsheet',
      category: 'office',
      sortOrder: 3,
    },
  ]

  for (const item of integrations) {
    await prisma.integration.create({ data: item })
  }

  const stats = [
    { label: 'Years of experience', labelAr: 'سنوات خبرة', value: '7+', color: 'primary', sortOrder: 1 },
    { label: 'Practical roles', labelAr: 'أدوار عملية', value: '7', color: 'primary', sortOrder: 2 },
    { label: 'ERP systems', labelAr: 'أنظمة ERP', value: '2', color: 'primary', sortOrder: 3 },
    { label: 'Languages', labelAr: 'اللغات', value: 'AR / EN', color: 'primary', sortOrder: 4 },
  ]

  for (const stat of stats) {
    await prisma.stat.create({ data: stat })
  }

  console.log('Seed completed: Mousa Marsh (CV-accurate)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
