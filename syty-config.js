/**
 * SymmaType Configuration File
 * ملف تكوين محرر النصوص SymmaType
 * البادئة: syty (اختصار SymmaType)
 */

// أزرار شريط الأدوات الأساسية - تصميم مبسط
const SYTY_TOOLBAR_BUTTONS = [
    // تنسيقات النص
    { label: 'عريض', command: 'bold', icon: 'format_bold', group: 'format' },
    { label: 'مائل', command: 'italic', icon: 'format_italic', group: 'format' },
    { label: 'تسطير', command: 'underline', icon: 'format_underlined', group: 'format' },
    { label: 'يتوسطه خط', command: 'strikethrough', icon: 'strikethrough_s', group: 'format' },
    { type: 'separator' },

    // الألوان
    { label: 'لون النص', command: 'textColor', icon: 'format_color_text', group: 'color' },
    { label: 'لون الخلفية', command: 'backgroundColor', icon: 'format_color_fill', group: 'color' },
    { type: 'separator' },

    // القوائم
    { label: 'قائمة نقطية', command: 'insertUnorderedList', icon: 'format_list_bulleted', group: 'list' },
    { label: 'قائمة رقمية', command: 'insertOrderedList', icon: 'format_list_numbered', group: 'list' },
    { type: 'separator' },

    // المحاذاة والمسافة
    { label: 'محاذاة لليمين', command: 'justifyRight', icon: 'format_align_right', group: 'align' },
    { label: 'محاذاة للوسط', command: 'justifyCenter', icon: 'format_align_center', group: 'align' },
    { label: 'محاذاة لليسار', command: 'justifyLeft', icon: 'format_align_left', group: 'align' },
    { label: 'ضبط النص', command: 'justifyFull', icon: 'format_align_justify', group: 'align' },
    { label: 'زيادة المسافة البادئة', command: 'indent', icon: 'format_indent_increase', group: 'align' },
    { label: 'تقليل المسافة البادئة', command: 'outdent', icon: 'format_indent_decrease', group: 'align' },
    { type: 'separator' },

    // إدراج
    { label: 'إدراج جدول', command: 'insertTable', icon: 'table_chart', group: 'insert' },
    { label: 'إدراج صورة', command: 'insertImage', icon: 'image', group: 'insert' },
    { label: 'إدراج رابط', command: 'createLink', icon: 'link', group: 'insert' },
    { label: 'إزالة رابط', command: 'unlink', icon: 'link_off', group: 'insert' },
    { label: 'فاصل خط', command: 'insertHR', icon: 'horizontal_rule', group: 'insert' },
    { type: 'separator' },

    // أدوات متقدمة
    { label: 'بحث واستبدال', command: 'findReplace', icon: 'find_replace', group: 'tools' },
    { type: 'separator' },

    // تاريخ
    { label: 'تراجع', command: 'undo', icon: 'undo', group: 'history' },
    { label: 'إعادة', command: 'redo', icon: 'redo', group: 'history' },
    { type: 'separator' },

    // تنظيف/معاينة
    { label: 'إزالة التنسيق', command: 'removeFormat', icon: 'format_clear', group: 'tools' },
    { label: 'مسح الكل', command: 'clearAll', icon: 'clear_all', group: 'tools' },
    { label: 'معاينة', command: 'showPreview', icon: 'preview', group: 'tools' },
    { label: 'عرض HTML', command: 'showHTML', icon: 'code', group: 'tools' }
];

// قائمة الخطوط مع Google Fonts
const SYTY_FONT_FAMILIES = [
    { name: 'الخط الافتراضي', value: 'inherit', css: 'inherit' },
    { name: 'Arial', value: 'arial', css: 'Arial, Helvetica, sans-serif' },
    { name: 'Times New Roman', value: 'times', css: '"Times New Roman", Times, serif' },
    { name: 'Cairo', value: 'cairo', css: 'Cairo, sans-serif', google: true },
    { name: 'Tajawal', value: 'tajawal', css: 'Tajawal, sans-serif', google: true },
    { name: 'Amiri', value: 'amiri', css: 'Amiri, serif', google: true },
    { name: 'Noto Sans Arabic', value: 'noto-sans-arabic', css: '"Noto Sans Arabic", sans-serif', google: true },
    { name: 'Almarai', value: 'almarai', css: 'Almarai, sans-serif', google: true },
    { name: 'Changa', value: 'changa', css: 'Changa, sans-serif', google: true },
    { name: 'Lateef', value: 'lateef', css: 'Lateef, serif', google: true },
    { name: 'Scheherazade New', value: 'scheherazade-new', css: '"Scheherazade New", serif', google: true }
];

// أحجام الخطوط المتنوعة
const SYTY_FONT_SIZES = [
    { name: 'صغير جداً', value: '10px' },
    { name: 'صغير', value: '12px' },
    { name: 'عادي', value: '14px' },
    { name: 'متوسط', value: '16px' },
    { name: 'كبير', value: '18px' },
    { name: 'كبير جداً', value: '20px' },
    { name: 'عملاق', value: '24px' },
    { name: 'ضخم', value: '28px' },
    { name: 'هائل', value: '32px' }
];

// خيارات المسافة بين الأسطر
const SYTY_LINE_HEIGHTS = [
    { name: 'افتراضي', value: '1.6' },
    { name: 'مضغوط', value: '1.2' },
    { name: 'عادي', value: '1.5' },
    { name: 'متوسط', value: '1.8' },
    { name: 'واسع', value: '2' },
    { name: 'واسع جداً', value: '2.5' }
];

// خيارات اتجاه النص
const SYTY_TEXT_DIRECTIONS = [
    { name: 'من اليمين لليسار', value: 'rtl', icon: 'format_textdirection_r_to_l' },
    { name: 'من اليسار لليمين', value: 'ltr', icon: 'format_textdirection_l_to_r' }
];

// أنماط الكتل المبسطة - التركيز على الأساسيات
const SYTY_BLOCK_STYLES = [
    // الأنماط الأساسية
    { 
        name: 'فقرة عادية', 
        value: 'p', 
        tag: 'P', 
        description: 'نص عادي',
        category: 'basic',
        icon: 'text_fields'
    },
    
    // العناوين
    { 
        name: 'عنوان رئيسي', 
        value: 'h1', 
        tag: 'H1', 
        description: 'العنوان الأكبر',
        category: 'heading',
        icon: 'title'
    },
    { 
        name: 'عنوان ثانوي', 
        value: 'h2', 
        tag: 'H2', 
        description: 'عنوان متوسط',
        category: 'heading',
        icon: 'title'
    },
    { 
        name: 'عنوان فرعي', 
        value: 'h3', 
        tag: 'H3', 
        description: 'عنوان صغير',
        category: 'heading',
        icon: 'title'
    },

    // التنبيهات
    { 
        name: 'تنبيه معلوماتي', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-alert-info',
        description: 'معلومات مهمة',
        category: 'alert',
        icon: 'info'
    },
    { 
        name: 'تنبيه تحذيري', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-alert-warning',
        description: 'تحذير',
        category: 'alert',
        icon: 'warning'
    },
    { 
        name: 'تنبيه نجاح', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-alert-success',
        description: 'نجاح',
        category: 'alert',
        icon: 'check_circle'
    },
    { 
        name: 'تنبيه خطر', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-alert-danger',
        description: 'خطر',
        category: 'alert',
        icon: 'error'
    },

    // أنماط خاصة
    { 
        name: 'نص مميز', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-highlight',
        description: 'نص بارز',
        category: 'special',
        icon: 'star'
    },
    { 
        name: 'كود', 
        value: 'div', 
        tag: 'DIV', 
        className: 'syty-code',
        description: 'كود برمجي',
        category: 'special',
        icon: 'code'
    }
];

// فئات الأنماط
const SYTY_STYLE_CATEGORIES = {
    'basic': 'الأساسية',
    'heading': 'العناوين',
    'alert': 'التنبيهات',
    'special': 'خاصة'
};

// ألوان التصميم المبسط - درجات الأبيض والرمادي
const SYTY_THEME_COLORS = {
    // الخلفيات
    toolbar: '#f8f9fa',
    toolbarHover: '#e9ecef',
    toolbarActive: '#dee2e6',
    
    // الحدود
    border: '#dee2e6',
    borderHover: '#adb5bd',
    
    // النصوص
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#adb5bd',
    
    // الأيقونات
    iconDefault: '#6c757d',
    iconHover: '#495057',
    iconActive: '#212529',
    
    // الأزرار
    buttonDefault: '#ffffff',
    buttonHover: '#f8f9fa',
    buttonActive: '#e9ecef',
    
    // التنبيهات
    info: '#0dcaf0',
    warning: '#ffc107',
    success: '#198754',
    danger: '#dc3545'
};

// إعدادات المحرر
const SYTY_EDITOR_CONFIG = {
    // الكلاسات الأساسية
    classes: {
        container: 'syty-container',
        toolbar: 'syty-toolbar',
        editor: 'syty-editor',
        button: 'syty-btn',
        select: 'syty-select',
        separator: 'syty-separator',
        group: 'syty-group'
    },
    
    // الإعدادات الافتراضية
    defaults: {
        fontSize: '14px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        direction: 'rtl'
    },
    
    // رسائل النظام
    messages: {
        styleApplied: 'تم تطبيق النمط',
        styleRemoved: 'تم إزالة النمط',
        formatCleared: 'تم مسح التنسيق',
        linkAdded: 'تم إضافة الرابط',
        previewOpened: 'تم فتح المعاينة'
    }
};

// ألوان النص والخلفية
const SYTY_TEXT_COLORS = [
    { name: 'أسود', value: '#000000', category: 'basic' },
    { name: 'أبيض', value: '#ffffff', category: 'basic' },
    { name: 'رمادي', value: '#6c757d', category: 'basic' },
    { name: 'أحمر', value: '#dc3545', category: 'basic' },
    { name: 'أزرق', value: '#0d6efd', category: 'basic' },
    { name: 'أخضر', value: '#198754', category: 'basic' },
    { name: 'أصفر', value: '#ffc107', category: 'basic' },
    { name: 'برتقالي', value: '#fd7e14', category: 'basic' },
    { name: 'بنفسجي', value: '#6f42c1', category: 'basic' },
    { name: 'وردي', value: '#d63384', category: 'basic' },
    
    // ألوان متقدمة
    { name: 'أحمر داكن', value: '#8b0000', category: 'advanced' },
    { name: 'أزرق داكن', value: '#000080', category: 'advanced' },
    { name: 'أخضر داكن', value: '#006400', category: 'advanced' },
    { name: 'بني', value: '#8b4513', category: 'advanced' },
    { name: 'ذهبي', value: '#ffd700', category: 'advanced' },
    { name: 'فضي', value: '#c0c0c0', category: 'advanced' }
];

const SYTY_BACKGROUND_COLORS = [
    { name: 'شفاف', value: 'transparent', category: 'basic' },
    { name: 'أبيض', value: '#ffffff', category: 'basic' },
    { name: 'رمادي فاتح', value: '#f8f9fa', category: 'basic' },
    { name: 'أصفر فاتح', value: '#fff3cd', category: 'basic' },
    { name: 'أزرق فاتح', value: '#cce7ff', category: 'basic' },
    { name: 'أخضر فاتح', value: '#d4edda', category: 'basic' },
    { name: 'أحمر فاتح', value: '#f8d7da', category: 'basic' },
    { name: 'بنفسجي فاتح', value: '#e2e3f3', category: 'basic' },
    
    // خلفيات متقدمة
    { name: 'كريمي', value: '#f5f5dc', category: 'advanced' },
    { name: 'وردي فاتح', value: '#ffe4e1', category: 'advanced' },
    { name: 'أخضر نعناعي', value: '#f0fff0', category: 'advanced' },
    { name: 'أزرق سماوي', value: '#e6f3ff', category: 'advanced' }
];

// إعدادات الجداول
const SYTY_TABLE_SETTINGS = {
    defaultRows: 3,
    defaultCols: 3,
    maxRows: 20,
    maxCols: 10,
    defaultBorder: '1px solid #dee2e6',
    defaultCellPadding: '8px',
    defaultWidth: '100%'
};

// إعدادات الصور
const SYTY_IMAGE_SETTINGS = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    defaultWidth: 'auto',
    defaultHeight: 'auto',
    maxWidth: '100%',
    quality: 0.8
};

// اختصارات لوحة المفاتيح المتقدمة
const SYTY_ADVANCED_SHORTCUTS = [
    { key: 'Ctrl+F', command: 'findReplace', description: 'بحث واستبدال' },
    { key: 'Ctrl+Shift+L', command: 'insertTable', description: 'إدراج جدول' },
    { key: 'Ctrl+Shift+I', command: 'insertImage', description: 'إدراج صورة' },
    { key: 'Ctrl+K', command: 'createLink', description: 'إدراج رابط' },
    { key: 'Ctrl+Shift+K', command: 'unlink', description: 'إزالة رابط' },
    { key: 'Ctrl+H', command: 'insertHR', description: 'فاصل خط' },
    { key: 'F7', command: 'spellCheck', description: 'تدقيق إملائي' },
    { key: 'Ctrl+Shift+C', command: 'textColor', description: 'لون النص' },
    { key: 'Ctrl+Shift+H', command: 'backgroundColor', description: 'لون الخلفية' }
];

// تصدير المتغيرات للاستخدام في الملفات الأخرى
if (typeof window !== 'undefined') {
    window.SYTY_CONFIG = {
        TOOLBAR_BUTTONS: SYTY_TOOLBAR_BUTTONS,
        FONT_FAMILIES: SYTY_FONT_FAMILIES,
        FONT_SIZES: SYTY_FONT_SIZES,
        TEXT_DIRECTIONS: SYTY_TEXT_DIRECTIONS,
        BLOCK_STYLES: SYTY_BLOCK_STYLES,
        STYLE_CATEGORIES: SYTY_STYLE_CATEGORIES,
        THEME_COLORS: SYTY_THEME_COLORS,
        EDITOR_CONFIG: SYTY_EDITOR_CONFIG,
        TEXT_COLORS: SYTY_TEXT_COLORS,
        BACKGROUND_COLORS: SYTY_BACKGROUND_COLORS,
        TABLE_SETTINGS: SYTY_TABLE_SETTINGS,
        IMAGE_SETTINGS: SYTY_IMAGE_SETTINGS,
        ADVANCED_SHORTCUTS: SYTY_ADVANCED_SHORTCUTS,
        LINE_HEIGHTS: SYTY_LINE_HEIGHTS
    };
} 