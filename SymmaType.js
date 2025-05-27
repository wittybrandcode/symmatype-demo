/**
 * SymmaType - محرر النصوص العربي المتطور
 * الإصدار 2.0 - هيكلية محسنة ومبسطة
 * 
 * @author SymmaType Team
 * @version 2.0.0
 * @license MIT
 */

(function() {
    'use strict';

    // معلومات المحرر
    const SYMMATYPE_INFO = {
        name: 'SymmaType',
        version: '2.0.0',
        description: 'محرر النصوص العربي المتطور',
        author: 'SymmaType Team',
        license: 'MIT'
    };

    // اكتشاف مسار ملف SymmaType.js تلقائياً
    var scripts = document.getElementsByTagName('script');
    var basePath = '';
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('SymmaType.js') !== -1) {
            basePath = src.substring(0, src.lastIndexOf('/') + 1);
            break;
        }
    }

    // مسار الملفات
    const SYMMATYPE_PATH = basePath;

    // قائمة الملفات المطلوبة - مبسطة ومحسنة
    const REQUIRED_FILES = [
        'syty-config.js',
        'syty-core.js', 
        'syty-editor-style.css',
        'syty-styles.css',
        'syty-history.js',
        'syty-keyboard.js',
        'syty-plugins.js',
        'syty-styles.js',
        'syty-stats.js',
        'syty-advanced.js',
        'syty-toolbar.js',
        'syty-editor.js'
    ];

    // متغيرات التحكم
    let isLoading = false;
    let isLoaded = false;
    let loadPromise = null;
    let editors = new Map();

    /**
     * تحميل ملف CSS
     */
    function loadCSS(file) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        if (basePath.endsWith('symmatype/')) {
            link.href = basePath + file.replace(/^symmatype\//, '');
        } else {
            link.href = basePath + file;
        }
        document.head.appendChild(link);
    }

    /**
     * تحميل ملف JavaScript
     */
    function loadJS(file) {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            if (basePath.endsWith('symmatype/')) {
                script.src = basePath + file.replace(/^symmatype\//, '');
            } else {
                script.src = basePath + file;
            }
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * تحميل Google Material Icons
     */
    function loadMaterialIcons() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        document.head.appendChild(link);
    }

    /**
     * تحميل خطوط Google العربية
     */
    function loadGoogleFonts() {
        const fonts = [
            'Cairo:wght@200;300;400;500;600;700;800;900',
            'Tajawal:wght@200;300;400;500;700;800;900',
            'Amiri:wght@400;700',
            'Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900',
            'Almarai:wght@300;400;700;800',
            'Changa:wght@200;300;400;500;600;700;800',
            'Lateef:wght@200;300;400;500;600;700;800',
            'Scheherazade+New:wght@400;500;600;700'
        ];
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${fonts.map(font => `family=${font}`).join('&')}&display=swap`;
        document.head.appendChild(link);
        
        console.log('✅ تم تحميل خطوط Google العربية');
    }

    /**
     * تحميل جميع الملفات المطلوبة
     */
    async function loadSymmaType() {
        if (isLoaded) return Promise.resolve();
        if (isLoading) return loadPromise;

        isLoading = true;
        console.log('🚀 بدء تحميل SymmaType...');

        loadPromise = (async () => {
            try {
                // تحميل Material Icons
                loadMaterialIcons();
                
                // تحميل خطوط Google العربية
                loadGoogleFonts();

                // تحميل الملفات بالترتيب
                for (const file of REQUIRED_FILES) {
                    const filePath = SYMMATYPE_PATH + file;
                    
                    if (file.endsWith('.css')) {
                        await loadCSS(filePath);
                        console.log(`✅ تم تحميل: ${file}`);
                    } else if (file.endsWith('.js')) {
                        await loadJS(filePath);
                        console.log(`✅ تم تحميل: ${file}`);
                    }
                }

                // التحقق من تحميل المكونات الأساسية
                if (!window.SYTY_CONFIG) {
                    throw new Error('فشل تحميل ملف التكوين');
                }
                if (!window.SytyCore) {
                    throw new Error('فشل تحميل الوظائف الأساسية');
                }
                if (!window.SytyEditor) {
                    throw new Error('فشل تحميل المحرر');
                }

                isLoaded = true;
                console.log('✅ تم تحميل SymmaType بنجاح!');
                
                // تهيئة المحررات الموجودة
                initializeExistingEditors();
                
                // إطلاق حدث التحميل
                document.dispatchEvent(new CustomEvent('symmatype:loaded', {
                    detail: SYMMATYPE_INFO
                }));

            } catch (error) {
                console.error('❌ خطأ في تحميل SymmaType:', error);
                throw error;
            } finally {
                isLoading = false;
            }
        })();

        return loadPromise;
    }

    /**
     * تهيئة المحررات الموجودة في الصفحة
     */
    function initializeExistingEditors() {
        // البحث عن جميع عناصر textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            // إضافة الكلاس إذا لم يكن موجوداً
            if (!textarea.classList.contains('SymmaType')) {
                textarea.classList.add('SymmaType');
            }
            // تفعيل التدقيق الإملائي دائماً
            textarea.setAttribute('spellcheck', 'true');
            // تفعيل المحرر إذا لم يكن مفعلاً
            if (!editors.has(textarea)) {
                createEditor(textarea);
            }
        });
        // البحث عن div#editor وإنشاء محرر تلقائياً
        const editorDiv = document.getElementById('editor');
        if (editorDiv && !editors.has(editorDiv)) {
            createEditor(editorDiv, {
                rtl: true,
                language: 'ar',
                theme: 'light',
                placeholder: 'ابدأ الكتابة هنا...'
            });
        }
    }

    /**
     * إنشاء محرر جديد
     */
    function createEditor(element, options = {}) {
        if (!isLoaded) {
            console.warn('SymmaType لم يتم تحميله بعد');
            return null;
        }

        if (editors.has(element)) {
            console.warn('المحرر موجود بالفعل لهذا العنصر');
            return editors.get(element);
        }

        try {
            // دمج الخيارات الافتراضية
            const defaultOptions = {
                debug: false,
                autoSave: true,
                placeholder: 'ابدأ الكتابة...'
            };

            const finalOptions = { ...defaultOptions, ...options };

            // إنشاء المحرر
            const editor = new SytyEditor(element, finalOptions);
            editors.set(element, editor);

            console.log('✅ تم إنشاء محرر SymmaType');
            return editor;

        } catch (error) {
            console.error('❌ خطأ في إنشاء المحرر:', error);
            return null;
        }
    }

    /**
     * تدمير محرر
     */
    function destroyEditor(element) {
        const editor = editors.get(element);
        if (editor) {
            editor.destroy();
            editors.delete(element);
            console.log('🗑️ تم تدمير المحرر');
        }
    }

    /**
     * الحصول على محرر من عنصر
     */
    function getEditor(element) {
        return editors.get(element) || null;
    }

    /**
     * الحصول على جميع المحررات
     */
    function getAllEditors() {
        return Array.from(editors.values());
    }

    /**
     * API عام لـ SymmaType
     */
    const SymmaTypeAPI = {
        // معلومات المحرر
        info: SYMMATYPE_INFO,
        
        // حالة التحميل
        get isLoaded() { return isLoaded; },
        get isLoading() { return isLoading; },
        
        // وظائف التحميل
        load: loadSymmaType,
        
        // وظائف المحرر
        create: createEditor,
        destroy: destroyEditor,
        get: getEditor,
        getAll: getAllEditors,
        
        // وظائف مساعدة
        version: SYMMATYPE_INFO.version,
        
        // تهيئة تلقائية
        auto: () => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadSymmaType);
            } else {
                loadSymmaType();
            }
        }
    };

    // تصدير API للنافذة
    window.SymmaType = SymmaTypeAPI;

    // تهيئة تلقائية عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadSymmaType();
        });
    } else {
        // الصفحة محملة بالفعل
        setTimeout(loadSymmaType, 0);
    }

    // رسالة ترحيب
    console.log(`
    ╔══════════════════════════════════════╗
    ║           SymmaType v${SYMMATYPE_INFO.version}            ║
    ║      محرر النصوص العربي المتطور       ║
    ║                                      ║
    ║  🚀 تم تحميل النظام بنجاح             ║
    ║  📝 جاهز لإنشاء المحررات              ║
    ║                                      ║
    ║  استخدم: SymmaType.create(element)   ║
    ╚══════════════════════════════════════╝
    `);

    // اجعل basePath متاحاً لباقي ملفات المحرر
    window.SYTY_BASE_PATH = basePath;

})(); 