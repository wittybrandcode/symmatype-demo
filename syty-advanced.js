/**
 * SymmaType Advanced Features
 * الوظائف المتقدمة للمحرر - الجداول والألوان والبحث
 * مطور وفق المعايير العالمية للمحررات الاحترافية
 */

class SytyAdvanced {
    constructor(editor) {
        this.editor = editor;
        this.colorPickers = new Map();
        this.searchModal = null;
        this.tableModal = null;
        this.currentSearch = {
            term: '',
            results: [],
            currentIndex: -1
        };
        
        // إعدادات دعم المتصفح
        this.browserSupport = null;
        this.forceHTMLMode = false;
        
        this.init();
    }

    /**
     * تهيئة الوظائف المتقدمة
     */
    init() {
        console.log('🚀 تهيئة الوظائف المتقدمة...');
        
        try {
            this.checkBrowserColorSupport();
            this.injectAdvancedStyles();
            this.createColorPickers();
            this.createSearchModal();
            this.createTableModal();
            this.bindAdvancedShortcuts();
            
            console.log('✅ تم تهيئة الوظائف المتقدمة بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تهيئة الوظائف المتقدمة:', error);
        }
    }

    /**
     * فحص دعم المتصفح للألوان
     */
    checkBrowserColorSupport() {
        this.browserSupport = {
            foreColor: document.queryCommandSupported('foreColor'),
            hiliteColor: document.queryCommandSupported('hiliteColor'),
            backColor: document.queryCommandSupported('backColor'),
            insertHTML: document.queryCommandSupported('insertHTML')
        };
        
        // إجبار استخدام HTML إذا لم تكن أوامر الخلفية مدعومة
        this.forceHTMLMode = !this.browserSupport.hiliteColor && !this.browserSupport.backColor;
        
        console.log('🔍 دعم المتصفح للألوان:', this.browserSupport);
        console.log('🔧 وضع HTML الإجباري:', this.forceHTMLMode);
    }

    /**
     * حقن أنماط CSS المتقدمة
     */
    injectAdvancedStyles() {
        const styleId = 'syty-advanced-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* أنماط منتقيات الألوان المحسنة */
            .syty-color-picker {
                position: fixed !important;
                z-index: 10000 !important;
                background: #ffffff;
                border: 1px solid #e1e5e9;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);
                min-width: 350px;
                max-width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(10px);
                animation: sytyColorPickerShow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
            }

            @keyframes sytyColorPickerShow {
                from {
                    opacity: 0;
                    transform: translateY(-15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .syty-color-section {
                margin-bottom: 16px;
            }

            .syty-color-section-title {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 12px;
                text-align: right;
                letter-spacing: 0.025em;
            }

            .syty-color-grid {
                display: grid !important;
                grid-template-columns: repeat(8, 1fr) !important;
                gap: 8px !important;
                margin-bottom: 16px;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .syty-color-item {
                width: 32px !important;
                height: 32px !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                display: block !important;
                position: relative;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            .syty-color-item:hover {
                transform: scale(1.15) !important;
                border-color: #3b82f6 !important;
                box-shadow: 0 6px 16px rgba(59,130,246,0.3) !important;
                z-index: 2;
            }

            .syty-color-item:active {
                transform: scale(1.05) !important;
            }

            .syty-color-item.transparent {
                background: repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 16px 16px !important;
            }

            .syty-custom-color-section {
                border-top: 1px solid #e5e7eb;
                padding-top: 16px;
                margin-top: 16px;
            }

            .syty-custom-color-wrapper {
                display: flex;
                gap: 12px;
                align-items: center;
                margin-bottom: 12px;
            }

            .syty-custom-color-input {
                flex: 1;
                height: 48px !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                background: #ffffff !important;
                transition: all 0.2s ease !important;
                outline: none !important;
            }

            .syty-custom-color-input:hover {
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important;
            }

            .syty-custom-color-input:focus {
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 4px rgba(59,130,246,0.2) !important;
            }

            .syty-apply-color-btn {
                padding: 10px 20px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(59,130,246,0.2);
            }

            .syty-apply-color-btn:hover {
                background: #2563eb;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59,130,246,0.3);
            }

            .syty-apply-color-btn:active {
                transform: translateY(0);
            }

            .syty-color-preview {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 13px;
                color: #6b7280;
                border: 1px solid #e5e7eb;
            }

            .syty-color-preview-box {
                width: 28px;
                height: 28px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                flex-shrink: 0;
            }

            /* أنماط الجداول المحسنة */
            .syty-table-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(4px);
            }

            .syty-table-modal.syty-show {
                display: flex;
                opacity: 1;
            }

            .syty-table-content {
                background: #ffffff;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .syty-table-modal.syty-show .syty-table-content {
                transform: scale(1);
            }

            .syty-table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid #f1f5f9;
            }

            .syty-table-title {
                font-size: 20px;
                font-weight: 700;
                color: #1e293b;
            }

            .syty-table-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .syty-table-close:hover {
                color: #1e293b;
                background: #f1f5f9;
            }

            .syty-form-group {
                margin-bottom: 20px;
            }

            .syty-form-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
            }

            .syty-form-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                color: #1f2937;
                transition: all 0.2s ease;
                outline: none;
            }

            .syty-form-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .syty-table-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }

            .syty-btn-primary {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .syty-btn-primary:hover {
                background: #2563eb;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .syty-btn-secondary {
                background: #f8fafc;
                color: #475569;
                border: 2px solid #e2e8f0;
                padding: 10px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .syty-btn-secondary:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }

            /* أنماط العناصر الملونة في المحرر المحسنة */
            .syty-editor span[data-syty-colored="true"] {
                display: inline !important;
                position: relative;
                transition: all 0.2s ease;
            }

            /* ألوان النص */
            .syty-editor span.syty-text-colored,
            .syty-editor span[data-syty-text-color],
            .syty-editor span[data-color-type="text"] {
                display: inline !important;
                color: var(--syty-text-color, inherit) !important;
            }

            /* ألوان الخلفية */
            .syty-editor span.syty-bg-colored,
            .syty-editor span[data-syty-bg-color],
            .syty-editor span[data-color-type="background"] {
                display: inline !important;
                background-color: var(--syty-bg-color, inherit) !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
                line-height: inherit !important;
                box-decoration-break: clone !important;
                -webkit-box-decoration-break: clone !important;
            }

            /* تأكيد أولوية الألوان */
            .syty-editor span[style*="background-color"]:not(.syty-bg-colored) {
                background-color: inherit !important;
            }

            .syty-editor span[style*="color"]:not(.syty-text-colored) {
                color: inherit !important;
            }

            /* أنماط الجداول المحسنة */
            .syty-editor .syty-table-wrapper {
                margin: 15px 0 !important;
                clear: both !important;
                display: block !important;
                width: 100% !important;
            }

            .syty-editor .syty-table {
                border-collapse: collapse !important;
                width: 100% !important;
                border: 2px solid #e1e5e9 !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                font-family: inherit !important;
                font-size: inherit !important;
                background: #ffffff !important;
            }

            .syty-editor .syty-table th,
            .syty-editor .syty-table td {
                border: 1px solid #e5e7eb !important;
                padding: 12px 16px !important;
                text-align: right !important;
                min-width: 100px !important;
                min-height: 40px !important;
                vertical-align: top !important;
                transition: background-color 0.2s ease !important;
            }

            .syty-editor .syty-table th {
                background-color: #f1f5f9 !important;
                font-weight: 600 !important;
                color: #374151 !important;
                border-bottom: 2px solid #d1d5db !important;
            }

            .syty-editor .syty-table tr:nth-child(even) td {
                background-color: #f9fafb !important;
            }

            .syty-editor .syty-table tr:hover td {
                background-color: #f3f4f6 !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ تم حقن أنماط CSS المتقدمة');
    }

    /**
     * إنشاء منتقيات الألوان
     */
    createColorPickers() {
        try {
            if (!window.SYTY_CONFIG || !SYTY_CONFIG.TEXT_COLORS || !SYTY_CONFIG.BACKGROUND_COLORS) {
                console.error('❌ إعدادات الألوان غير متوفرة');
                return;
            }

            // منتقي لون النص
            const textColorPicker = this.createColorPicker('text', SYTY_CONFIG.TEXT_COLORS);
            this.colorPickers.set('text', textColorPicker);
            console.log(`✅ تم إنشاء منتقي لون النص مع ${SYTY_CONFIG.TEXT_COLORS.length} لون`);

            // منتقي لون الخلفية
            const bgColorPicker = this.createColorPicker('background', SYTY_CONFIG.BACKGROUND_COLORS);
            this.colorPickers.set('background', bgColorPicker);
            console.log(`✅ تم إنشاء منتقي لون الخلفية مع ${SYTY_CONFIG.BACKGROUND_COLORS.length} لون`);

        } catch (error) {
            console.error('❌ خطأ في إنشاء منتقيات الألوان:', error);
        }
    }

    /**
     * إنشاء منتقي لون واحد
     */
    createColorPicker(type, colors) {
        const picker = document.createElement('div');
        picker.className = 'syty-color-picker';
        picker.style.display = 'none';
        
        // قسم الألوان المحددة مسبقاً
        const predefinedSection = document.createElement('div');
        predefinedSection.className = 'syty-color-section';
        
        const predefinedTitle = document.createElement('div');
        predefinedTitle.className = 'syty-color-section-title';
        predefinedTitle.textContent = type === 'text' ? 'ألوان النص' : 'ألوان الخلفية';
        
        const grid = document.createElement('div');
        grid.className = 'syty-color-grid';
        
        colors.forEach(color => {
            const item = document.createElement('div');
            item.className = 'syty-color-item';
            item.title = color.name || color.value;
            item.setAttribute('data-color', color.value);
            
            if (color.value === 'transparent') {
                item.classList.add('transparent');
            } else {
                item.style.backgroundColor = color.value;
            }

            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // التحقق من وجود تحديد قبل تطبيق اللون
                const selectedText = this.getSafeSelectedText();
                if (!selectedText) {
                    SytyCore.Messages.warning('يرجى تحديد النص أولاً قبل اختيار اللون');
                    this.hideColorPicker(type);
                    return;
                }
                
                console.log(`🎯 تطبيق لون: ${color.value} على النص: "${selectedText}"`);
                
                // تأثير بصري للنقر
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 100);
                
                this.applyColor(type, color.value);
                this.hideColorPicker(type);
            });

            grid.appendChild(item);
        });

        predefinedSection.appendChild(predefinedTitle);
        predefinedSection.appendChild(grid);
        
        // قسم اختيار لون مخصص
        const customSection = document.createElement('div');
        customSection.className = 'syty-custom-color-section';
        
        const customTitle = document.createElement('div');
        customTitle.className = 'syty-color-section-title';
        customTitle.textContent = 'لون مخصص';
        
        const customWrapper = document.createElement('div');
        customWrapper.className = 'syty-custom-color-wrapper';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'syty-custom-color-input';
        colorInput.value = '#000000';
        
        const applyBtn = document.createElement('button');
        applyBtn.className = 'syty-apply-color-btn';
        applyBtn.textContent = 'تطبيق';
        
        applyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const selectedText = this.getSafeSelectedText();
            if (!selectedText) {
                SytyCore.Messages.warning('يرجى تحديد النص أولاً قبل اختيار اللون');
                return;
            }
            
            this.applyColor(type, colorInput.value);
            this.hideColorPicker(type);
        });
        
        customWrapper.appendChild(colorInput);
        customWrapper.appendChild(applyBtn);
        
        // معاينة اللون
        const preview = document.createElement('div');
        preview.className = 'syty-color-preview';
        
        const previewBox = document.createElement('div');
        previewBox.className = 'syty-color-preview-box';
        previewBox.style.backgroundColor = colorInput.value;
        
        const previewText = document.createElement('span');
        previewText.textContent = `اللون المختار: ${colorInput.value}`;
        
        preview.appendChild(previewBox);
        preview.appendChild(previewText);
        
        // تحديث المعاينة عند تغيير اللون
        colorInput.addEventListener('input', (e) => {
            previewBox.style.backgroundColor = e.target.value;
            previewText.textContent = `اللون المختار: ${e.target.value}`;
        });
        
        customSection.appendChild(customTitle);
        customSection.appendChild(customWrapper);
        customSection.appendChild(preview);
        
        picker.appendChild(predefinedSection);
        picker.appendChild(customSection);
        
        document.body.appendChild(picker);
        return picker;
    }

    /**
     * الحصول على النص المحدد بطريقة آمنة
     */
    getSafeSelectedText() {
        try {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return '';
            
            const range = selection.getRangeAt(0);
            return range.toString().trim();
        } catch (error) {
            console.error('❌ خطأ في الحصول على النص المحدد:', error);
            return '';
        }
    }

    /**
     * التحقق من أن التحديد داخل المحرر
     */
    isSelectionInEditor(range) {
        try {
            return this.editor.element.contains(range.commonAncestorContainer) ||
                   this.editor.element.contains(range.startContainer) ||
                   this.editor.element.contains(range.endContainer);
        } catch (error) {
            return false;
        }
    }

    /**
     * عرض منتقي الألوان
     */
    showColorPicker(type, button) {
        const picker = this.colorPickers.get(type);
        if (!picker) {
            console.error(`❌ منتقي الألوان غير موجود: ${type}`);
            return;
        }

        // التحقق من وجود تحديد أولاً
        const selectedText = this.getSafeSelectedText();
        if (!selectedText) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً قبل اختيار اللون');
            return;
        }

        // إخفاء جميع المنتقيات الأخرى
        this.hideAllColorPickers();

        // تحديد موضع المنتقي
        const rect = button.getBoundingClientRect();
        picker.style.position = 'fixed';
        picker.style.top = `${rect.bottom + 10}px`;
        picker.style.left = `${rect.left}px`;
        picker.style.display = 'block';
        picker.style.zIndex = '10000';
        
        // التأكد من أن المنتقي لا يخرج من الشاشة
        setTimeout(() => {
            const pickerRect = picker.getBoundingClientRect();
            
            // تعديل الموضع الأفقي
            if (pickerRect.right > window.innerWidth) {
                picker.style.left = `${window.innerWidth - pickerRect.width - 20}px`;
            }
            if (pickerRect.left < 0) {
                picker.style.left = '20px';
            }
            
            // تعديل الموضع العمودي
            if (pickerRect.bottom > window.innerHeight) {
                picker.style.top = `${rect.top - pickerRect.height - 10}px`;
            }
            if (pickerRect.top < 0) {
                picker.style.top = '20px';
            }
        }, 10);

        // إضافة مستمع للنقر خارج المنتقي
        setTimeout(() => {
            const clickHandler = (e) => {
                if (!picker.contains(e.target) && e.target !== button) {
                    this.hideColorPicker(type);
                    document.removeEventListener('click', clickHandler);
                }
            };
            document.addEventListener('click', clickHandler);
        }, 100);

        console.log(`✅ تم عرض منتقي الألوان: ${type}`);
    }

    /**
     * إخفاء منتقي الألوان
     */
    hideColorPicker(type) {
        const picker = this.colorPickers.get(type);
        if (!picker) return;

        picker.style.display = 'none';
        console.log(`✅ تم إخفاء منتقي الألوان: ${type}`);
    }

    /**
     * إخفاء جميع منتقيات الألوان
     */
    hideAllColorPickers() {
        this.colorPickers.forEach((picker, type) => {
            this.hideColorPicker(type);
        });
    }

    /**
     * تطبيق اللون - مطور وفق المعايير العالمية
     */
    applyColor(type, color) {
        console.log(`🎨 تطبيق ${type} باللون: ${color}`);
        
        // التأكد من التركيز على المحرر
        this.editor.element.focus();
        
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً');
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        if (range.collapsed || !selectedText) {
            SytyCore.Messages.warning('يرجى تحديد نص للتلوين');
            return;
        }

        // التحقق من أن التحديد داخل المحرر
        if (!this.isSelectionInEditor(range)) {
            SytyCore.Messages.warning('يرجى تحديد نص داخل المحرر');
            return;
        }

        let success = false;
        
        try {
            if (type === 'text') {
                // لون النص - الطريقة المعيارية
                success = document.execCommand('foreColor', false, color);
                console.log(`🎯 foreColor result: ${success}`);
                
                if (!success) {
                    // طريقة احتياطية بـ HTML
                    this.applyColorWithHTML(type, color, range);
                    success = true;
                }
            } else if (type === 'background') {
                // لون الخلفية - تجربة طرق متعددة
                console.log(`🎯 محاولة تطبيق لون الخلفية: ${color}`);
                
                // الطريقة الأولى: hiliteColor
                if (this.browserSupport && this.browserSupport.hiliteColor) {
                    success = document.execCommand('hiliteColor', false, color);
                    console.log(`🔍 hiliteColor result: ${success}`);
                }
                
                // الطريقة الثانية: backColor
                if (!success && this.browserSupport && this.browserSupport.backColor) {
                    success = document.execCommand('backColor', false, color);
                    console.log(`🔍 backColor result: ${success}`);
                }
                
                // الطريقة الثالثة: HTML مباشر
                if (!success) {
                    console.log(`🔍 execCommand فشل، استخدام HTML...`);
                    this.applyColorWithHTML(type, color, range);
                    success = true;
                }
            }
            
            if (success) {
                SytyCore.Messages.success(`تم تطبيق ${type === 'text' ? 'لون النص' : 'لون الخلفية'}`);
                this.updateHistory();
            } else {
                throw new Error('فشل في تطبيق اللون');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تطبيق اللون:', error);
            SytyCore.Messages.error('فشل في تطبيق اللون');
        }
    }

    /**
     * تطبيق اللون باستخدام HTML مباشر
     */
    applyColorWithHTML(type, color, range) {
        try {
            // حفظ موضع المؤشر
            const selection = window.getSelection();
            const bookmark = this.createBookmark(selection);
            
            const selectedContent = range.extractContents();
            const selectedText = selectedContent.textContent || '';
            
            console.log(`🔧 تطبيق HTML للنص: "${selectedText}"`);
            
            // إنشاء عنصر span جديد مع أنماط محسنة
            const element = document.createElement('span');
            element.setAttribute('data-syty-colored', 'true');
            element.setAttribute('data-color-type', type);
            element.setAttribute('data-color-value', color);
            
            if (type === 'text') {
                // تطبيق لون النص مباشرة
                element.style.setProperty('color', color, 'important');
                element.setAttribute('data-syty-text-color', color);
                element.classList.add('syty-text-colored');
                console.log(`🎨 تعيين لون النص: ${color}`);
            } else if (type === 'background') {
                // تطبيق لون الخلفية مباشرة
                element.style.setProperty('background-color', color, 'important');
                element.style.setProperty('padding', '2px 4px', 'important');
                element.style.setProperty('border-radius', '3px', 'important');
                element.style.setProperty('display', 'inline', 'important');
                element.style.setProperty('line-height', 'inherit', 'important');
                element.style.setProperty('box-decoration-break', 'clone', 'important');
                element.style.setProperty('-webkit-box-decoration-break', 'clone', 'important');
                
                element.setAttribute('data-syty-bg-color', color);
                element.classList.add('syty-bg-colored');
                
                console.log(`🎨 تعيين لون الخلفية: ${color}`);
            }
            
            // إضافة المحتوى المحدد إلى العنصر
            element.appendChild(selectedContent);
            
            // إدراج العنصر في المكان المحدد
            range.insertNode(element);
            
            // استعادة التحديد
            this.restoreBookmark(bookmark);
            
            // فرض إعادة رسم المحرر
            this.forceEditorRefresh();
            
            console.log(`✅ تم تطبيق اللون بـ HTML: ${color}`);
            
        } catch (error) {
            console.error('❌ خطأ في تطبيق اللون بـ HTML:', error);
            throw error;
        }
    }

    /**
     * إنشاء bookmark لحفظ موضع المؤشر
     */
    createBookmark(selection) {
        if (selection.rangeCount === 0) return null;
        
        const range = selection.getRangeAt(0);
        return {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset,
            collapsed: range.collapsed
        };
    }

    /**
     * استعادة موضع المؤشر من bookmark
     */
    restoreBookmark(bookmark) {
        if (!bookmark) return;
        
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            
            range.setStart(bookmark.startContainer, bookmark.startOffset);
            range.setEnd(bookmark.endContainer, bookmark.endOffset);
            
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (error) {
            console.warn('⚠️ فشل في استعادة موضع المؤشر:', error);
        }
    }

    /**
     * فرض إعادة رسم المحرر
     */
    forceEditorRefresh() {
        try {
            // فرض إعادة حساب الأنماط
            const originalDisplay = this.editor.element.style.display;
            this.editor.element.style.display = 'none';
            this.editor.element.offsetHeight; // trigger reflow
            this.editor.element.style.display = originalDisplay || '';
            
            // إطلاق أحداث تحديث متعددة
            this.editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            this.editor.element.dispatchEvent(new Event('change', { bubbles: true }));
            
            // تحديث إحصائيات المحرر
            if (this.editor.statsManager) {
                this.editor.statsManager.updateStats();
            }
            
            // تطبيق الأنماط الموحدة
            this.applyUnifiedStyles();
            
            console.log('✅ تم فرض إعادة رسم المحرر');
        } catch (error) {
            console.warn('⚠️ فشل في إعادة رسم المحرر:', error);
        }
    }

    /**
     * تطبيق الأنماط الموحدة على جميع العناصر في المحرر
     * يضمن التطابق بين المحرر والمعاينة (WYSIWYG)
     */
    applyUnifiedStyles() {
        try {
            const editor = this.editor.element;
            if (!editor) return;

            // تطبيق الأنماط على العناصر الملونة
            this.unifyColoredElements(editor);
            
            // تطبيق الأنماط على الجداول
            this.unifyTableElements(editor);
            
            // تطبيق الأنماط على العناوين
            this.unifyHeadingElements(editor);
            
            // تطبيق الأنماط على القوائم
            this.unifyListElements(editor);
            
            console.log('✅ تم تطبيق الأنماط الموحدة');
        } catch (error) {
            console.error('❌ خطأ في تطبيق الأنماط الموحدة:', error);
        }
    }

    /**
     * توحيد أنماط العناصر الملونة
     */
    unifyColoredElements(editor) {
        // توحيد عناصر النص الملونة
        const textElements = editor.querySelectorAll('span[color], font[color], span[style*="color"]');
        textElements.forEach(element => {
            const color = element.getAttribute('color') || 
                         element.style.color || 
                         getComputedStyle(element).color;
            
            if (color && color !== 'rgb(0, 0, 0)' && color !== '#000000' && color !== 'black') {
                element.className = 'syty-text-colored';
                element.setAttribute('data-syty-text-color', color);
                element.setAttribute('data-color-type', 'text');
                element.setAttribute('data-syty-colored', 'true');
                element.style.setProperty('--syty-text-color', color);
                element.style.color = color;
            }
        });

        // توحيد عناصر الخلفية الملونة
        const bgElements = editor.querySelectorAll('span[style*="background"], font[style*="background"]');
        bgElements.forEach(element => {
            const bgColor = element.style.backgroundColor || 
                           getComputedStyle(element).backgroundColor;
            
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                element.className = 'syty-bg-colored';
                element.setAttribute('data-syty-bg-color', bgColor);
                element.setAttribute('data-color-type', 'background');
                element.setAttribute('data-syty-colored', 'true');
                element.style.setProperty('--syty-bg-color', bgColor);
                element.style.backgroundColor = bgColor;
                element.style.padding = '2px 4px';
                element.style.borderRadius = '3px';
                element.style.display = 'inline';
                element.style.lineHeight = 'inherit';
            }
        });
    }

    /**
     * توحيد أنماط الجداول
     */
    unifyTableElements(editor) {
        const tables = editor.querySelectorAll('table');
        tables.forEach(table => {
            // إضافة wrapper إذا لم يكن موجوداً
            if (!table.parentElement.classList.contains('syty-table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'syty-table-wrapper';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
            
            // إضافة class للجدول
            table.classList.add('syty-table');
            
            // توحيد أنماط الخلايا
            const cells = table.querySelectorAll('th, td');
            cells.forEach(cell => {
                if (!cell.style.textAlign) {
                    cell.style.textAlign = 'right';
                }
                if (!cell.style.padding) {
                    cell.style.padding = '12px 16px';
                }
                if (!cell.style.border) {
                    cell.style.border = '1px solid #d1d5db';
                }
            });
            
            // توحيد أنماط رؤوس الجداول
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                header.style.backgroundColor = '#f1f5f9';
                header.style.fontWeight = '600';
                header.style.color = '#374151';
            });
        });
    }

    /**
     * توحيد أنماط العناوين
     */
    unifyHeadingElements(editor) {
        const headings = editor.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // إزالة الأنماط المتضاربة
            heading.style.border = 'none';
            heading.style.padding = '0';
            
            // تطبيق الأنماط الموحدة حسب المستوى
            switch(heading.tagName.toLowerCase()) {
                case 'h1':
                    heading.style.fontSize = '2.25em';
                    heading.style.fontWeight = '700';
                    heading.style.lineHeight = '1.2';
                    heading.style.margin = '0.67em 0';
                    heading.style.color = '#1f2937';
                    break;
                case 'h2':
                    heading.style.fontSize = '1.875em';
                    heading.style.fontWeight = '600';
                    heading.style.lineHeight = '1.3';
                    heading.style.margin = '0.75em 0';
                    heading.style.color = '#1f2937';
                    break;
                case 'h3':
                    heading.style.fontSize = '1.5em';
                    heading.style.fontWeight = '600';
                    heading.style.lineHeight = '1.4';
                    heading.style.margin = '0.83em 0';
                    heading.style.color = '#374151';
                    break;
                default:
                    heading.style.fontWeight = '600';
                    heading.style.lineHeight = '1.4';
                    heading.style.margin = '1em 0';
                    heading.style.color = '#374151';
            }
        });
    }

    /**
     * توحيد أنماط القوائم
     */
    unifyListElements(editor) {
        const lists = editor.querySelectorAll('ul, ol');
        lists.forEach(list => {
            list.style.margin = '1em 0';
            list.style.paddingRight = '2em';
            list.style.paddingLeft = '0';
            
            const items = list.querySelectorAll('li');
            items.forEach(item => {
                item.style.margin = '0.5em 0';
                item.style.lineHeight = '1.6';
            });
        });
    }

    /**
     * تحديث التاريخ
     */
    updateHistory() {
        if (this.editor.historyManager) {
            this.editor.historyManager.takeSnapshot('color:apply');
        }
    }

    /**
     * إنشاء نافذة الجداول
     */
    createTableModal() {
        const modal = document.createElement('div');
        modal.className = 'syty-table-modal';
        modal.innerHTML = `
            <div class="syty-table-content">
                <div class="syty-table-header">
                    <h3 class="syty-table-title">إدراج جدول</h3>
                    <button class="syty-table-close" type="button">×</button>
                </div>
                
                <div class="syty-form-group">
                    <label class="syty-form-label">عدد الصفوف:</label>
                    <input type="number" class="syty-form-input" id="syty-table-rows" min="1" max="20" value="3">
                </div>
                
                <div class="syty-form-group">
                    <label class="syty-form-label">عدد الأعمدة:</label>
                    <input type="number" class="syty-form-input" id="syty-table-cols" min="1" max="10" value="3">
                </div>
                
                <div class="syty-form-group">
                    <label class="syty-form-label">عنوان الجدول (اختياري):</label>
                    <input type="text" class="syty-form-input" id="syty-table-caption" placeholder="أدخل عنوان الجدول">
                </div>
                
                <div class="syty-table-actions">
                    <button class="syty-btn-secondary" type="button" id="syty-table-cancel">إلغاء</button>
                    <button class="syty-btn-primary" type="button" id="syty-table-insert">إدراج الجدول</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.tableModal = modal;
        
        // ربط الأحداث
        this.bindTableModalEvents();
        
        console.log('✅ تم إنشاء نافذة الجداول');
    }

    /**
     * ربط أحداث نافذة الجداول
     */
    bindTableModalEvents() {
        const modal = this.tableModal;
        const closeBtn = modal.querySelector('.syty-table-close');
        const cancelBtn = modal.querySelector('#syty-table-cancel');
        const insertBtn = modal.querySelector('#syty-table-insert');
        
        // إغلاق النافذة
        const closeModal = () => {
            modal.classList.remove('syty-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // إغلاق عند النقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // إدراج الجدول
        insertBtn.addEventListener('click', () => {
            this.insertTable();
            closeModal();
        });
        
        // إدراج عند الضغط على Enter
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.insertTable();
                closeModal();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    /**
     * عرض نافذة الجداول
     */
    showTableModal() {
        if (!this.tableModal) {
            console.error('❌ نافذة الجداول غير موجودة');
            return;
        }
        
        // التأكد من التركيز على المحرر
        this.editor.element.focus();
        
        this.tableModal.style.display = 'flex';
        setTimeout(() => {
            this.tableModal.classList.add('syty-show');
        }, 10);
        
        // التركيز على حقل الصفوف
        const rowsInput = this.tableModal.querySelector('#syty-table-rows');
        if (rowsInput) {
            rowsInput.focus();
            rowsInput.select();
        }
        
        console.log('✅ تم عرض نافذة الجداول');
    }

    /**
     * إدراج الجدول - طريقة محسنة مثل الفاصل
     */
    insertTable() {
        try {
            const rowsInput = this.tableModal.querySelector('#syty-table-rows');
            const colsInput = this.tableModal.querySelector('#syty-table-cols');
            const captionInput = this.tableModal.querySelector('#syty-table-caption');
            
            const rows = parseInt(rowsInput.value) || 3;
            const cols = parseInt(colsInput.value) || 3;
            const caption = captionInput.value.trim();
            
            // التحقق من القيم
            if (rows < 1 || rows > 20) {
                SytyCore.Messages.warning('عدد الصفوف يجب أن يكون بين 1 و 20');
                return;
            }
            
            if (cols < 1 || cols > 10) {
                SytyCore.Messages.warning('عدد الأعمدة يجب أن يكون بين 1 و 10');
                return;
            }
            
            console.log(`📊 إدراج جدول ${rows}×${cols} مباشر`);
            
            // التأكد من التركيز على المحرر أولاً
            this.editor.element.focus();
            
            // التحقق من وجود تحديد نشط
            const selection = window.getSelection();
            if (!selection.rangeCount) {
                console.warn('لا يوجد تحديد نشط، إنشاء تحديد جديد');
                // إنشاء تحديد في نهاية المحرر
                const range = document.createRange();
                range.selectNodeContents(this.editor.element);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            const range = selection.getRangeAt(0);
            
            // طباعة معلومات التصحيح
            console.log('📍 معلومات موضع المؤشر:');
            console.log('- startContainer:', range.startContainer);
            console.log('- startOffset:', range.startOffset);
            console.log('- هل داخل المحرر؟', this.editor.element.contains(range.startContainer));
            
            // إنشاء HTML الجدول مع أنماط محسنة
            const tableHTML = this.createTableHTML(rows, cols, caption);
            
            // محاولة الإدراج بـ execCommand أولاً
            console.log('🔄 محاولة إدراج بـ execCommand...');
            const success = document.execCommand('insertHTML', false, tableHTML);
            
            if (!success) {
                console.log('🔄 execCommand فشل، استخدام طريقة يدوية...');
                // طريقة يدوية احتياطية
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = tableHTML;
                
                // إدراج العناصر واحداً تلو الآخر
                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                
                range.deleteContents();
                range.insertNode(fragment);
                
                // وضع المؤشر بعد الجدول
                range.setStartAfter(fragment.lastChild || fragment);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                
                console.log('✅ تم الإدراج اليدوي');
            } else {
                console.log('✅ تم الإدراج بـ execCommand');
            }
            
            console.log(`✅ تم إدراج جدول ${rows}×${cols} في الموضع الصحيح`);
            SytyCore.Messages.success(`تم إدراج جدول ${rows} صف × ${cols} عمود`);
            this.updateHistory();
            
        } catch (error) {
            console.error('❌ خطأ في إدراج الجدول:', error);
            SytyCore.Messages.error('فشل في إدراج الجدول');
        }
    }

    /**
     * إنشاء HTML الجدول مع أنماط محسنة
     */
    createTableHTML(rows, cols, caption) {
        let tableHTML = '<div class="syty-table-wrapper" style="margin: 15px 0; clear: both;">';
        tableHTML += '<table class="syty-table" style="border-collapse: collapse; width: 100%; border: 2px solid #e1e5e9; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: inherit; font-size: inherit;">';
        
        // إضافة العنوان إذا كان موجوداً
        if (caption) {
            tableHTML += `<caption style="font-weight: 600; margin-bottom: 12px; text-align: center; font-size: 1.1em; color: #374151; padding: 8px;">${caption}</caption>`;
        }
        
        // إنشاء الصفوف
        for (let i = 0; i < rows; i++) {
            tableHTML += '<tr style="' + (i % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #f9fafb;') + '">';
            for (let j = 0; j < cols; j++) {
                const cellStyle = 'border: 1px solid #e5e7eb; padding: 12px 16px; text-align: right; min-width: 100px; min-height: 40px; vertical-align: top; transition: background-color 0.2s ease;';
                
                if (i === 0) {
                    // الصف الأول كرأس
                    tableHTML += `<th style="${cellStyle} background-color: #f1f5f9; font-weight: 600; color: #374151; border-bottom: 2px solid #d1d5db;" contenteditable="true">رأس ${j + 1}</th>`;
                } else {
                    tableHTML += `<td style="${cellStyle}" contenteditable="true">خلية ${i}-${j + 1}</td>`;
                }
            }
            tableHTML += '</tr>';
        }
        
        tableHTML += '</table></div><p><br></p>';
        return tableHTML;
    }



    /**
     * إنشاء نافذة البحث
     */
    createSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'syty-search-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(4px);
        `;
        
        modal.innerHTML = `
            <div class="syty-search-content" style="
                background: #ffffff;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <div class="syty-search-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid #f1f5f9;
                ">
                    <h3 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0;">بحث واستبدال</h3>
                    <button class="syty-search-close" type="button" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #64748b;
                        padding: 8px;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                    ">×</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">البحث عن:</label>
                    <input type="text" id="syty-search-term" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 16px;
                        color: #1f2937;
                        transition: all 0.2s ease;
                        outline: none;
                    " placeholder="أدخل النص للبحث عنه">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">استبدال بـ:</label>
                    <input type="text" id="syty-replace-term" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 16px;
                        color: #1f2937;
                        transition: all 0.2s ease;
                        outline: none;
                    " placeholder="أدخل النص البديل">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div id="syty-search-results" style="
                        padding: 12px;
                        background: #f9fafb;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #6b7280;
                        border: 1px solid #e5e7eb;
                        min-height: 40px;
                        display: flex;
                        align-items: center;
                    ">جاهز للبحث...</div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="syty-search-btn" style="
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        transition: all 0.2s ease;
                    ">بحث</button>
                    <button id="syty-replace-btn" style="
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        transition: all 0.2s ease;
                    ">استبدال الكل</button>
                    <button id="syty-search-cancel" style="
                        background: #f8fafc;
                        color: #475569;
                        border: 2px solid #e2e8f0;
                        padding: 10px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        transition: all 0.2s ease;
                    ">إلغاء</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.searchModal = modal;
        
        // ربط الأحداث
        this.bindSearchModalEvents();
        
        console.log('✅ تم إنشاء نافذة البحث');
    }

    /**
     * ربط أحداث نافذة البحث
     */
    bindSearchModalEvents() {
        const modal = this.searchModal;
        const closeBtn = modal.querySelector('.syty-search-close');
        const cancelBtn = modal.querySelector('#syty-search-cancel');
        const searchBtn = modal.querySelector('#syty-search-btn');
        const replaceBtn = modal.querySelector('#syty-replace-btn');
        const searchInput = modal.querySelector('#syty-search-term');
        const replaceInput = modal.querySelector('#syty-replace-term');
        
        // إغلاق النافذة
        const closeModal = () => {
            modal.classList.remove('syty-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            this.clearSearchResults();
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // إغلاق عند النقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // البحث
        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });
        
        // الاستبدال
        replaceBtn.addEventListener('click', () => {
            this.performReplace(searchInput.value, replaceInput.value);
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            } else if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        replaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performReplace(searchInput.value, replaceInput.value);
            } else if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    /**
     * عرض نافذة البحث
     */
    showSearchModal() {
        if (!this.searchModal) {
            console.error('❌ نافذة البحث غير موجودة');
            return;
        }
        
        this.searchModal.style.display = 'flex';
        setTimeout(() => {
            this.searchModal.classList.add('syty-show');
            this.searchModal.querySelector('.syty-search-content').style.transform = 'scale(1)';
        }, 10);
        
        // التركيز على حقل البحث
        const searchInput = this.searchModal.querySelector('#syty-search-term');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
        
        console.log('✅ تم عرض نافذة البحث');
    }

    /**
     * تنفيذ البحث
     */
    performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.updateSearchResults('يرجى إدخال نص للبحث عنه');
            return;
        }
        
        try {
            const content = this.editor.element.textContent || '';
            const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = content.match(regex);
            
            if (matches && matches.length > 0) {
                this.currentSearch.term = searchTerm;
                this.currentSearch.results = matches;
                this.currentSearch.currentIndex = 0;
                
                this.updateSearchResults(`تم العثور على ${matches.length} نتيجة`);
                this.highlightSearchResults(searchTerm);
                
                console.log(`🔍 تم العثور على ${matches.length} نتيجة للبحث: "${searchTerm}"`);
            } else {
                this.updateSearchResults('لم يتم العثور على نتائج');
                this.clearSearchHighlights();
            }
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            this.updateSearchResults('حدث خطأ أثناء البحث');
        }
    }

    /**
     * تنفيذ الاستبدال
     */
    performReplace(searchTerm, replaceTerm) {
        if (!searchTerm.trim()) {
            this.updateSearchResults('يرجى إدخال نص للبحث عنه');
            return;
        }
        
        try {
            let content = this.editor.element.innerHTML;
            const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = content.match(regex);
            
            if (matches && matches.length > 0) {
                content = content.replace(regex, replaceTerm);
                this.editor.element.innerHTML = content;
                
                this.updateSearchResults(`تم استبدال ${matches.length} نتيجة`);
                this.updateHistory();
                
                console.log(`🔄 تم استبدال ${matches.length} نتيجة`);
                SytyCore.Messages.success(`تم استبدال ${matches.length} نتيجة`);
            } else {
                this.updateSearchResults('لم يتم العثور على نتائج للاستبدال');
            }
            
        } catch (error) {
            console.error('❌ خطأ في الاستبدال:', error);
            this.updateSearchResults('حدث خطأ أثناء الاستبدال');
        }
    }

    /**
     * تحديث نتائج البحث
     */
    updateSearchResults(message) {
        const resultsDiv = this.searchModal.querySelector('#syty-search-results');
        if (resultsDiv) {
            resultsDiv.textContent = message;
        }
    }

    /**
     * تمييز نتائج البحث
     */
    highlightSearchResults(searchTerm) {
        try {
            this.clearSearchHighlights();
            
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const walker = document.createTreeWalker(
                this.editor.element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.match(regex)) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const parent = textNode.parentNode;
                const html = textNode.textContent.replace(regex, '<mark class="syty-search-highlight" style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, textNode);
                }
                parent.removeChild(textNode);
            });
            
        } catch (error) {
            console.error('❌ خطأ في تمييز النتائج:', error);
        }
    }

    /**
     * مسح تمييز البحث
     */
    clearSearchHighlights() {
        try {
            const highlights = this.editor.element.querySelectorAll('.syty-search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.insertBefore(document.createTextNode(highlight.textContent), highlight);
                parent.removeChild(highlight);
            });
        } catch (error) {
            console.error('❌ خطأ في مسح التمييز:', error);
        }
    }

    /**
     * مسح نتائج البحث
     */
    clearSearchResults() {
        this.currentSearch = {
            term: '',
            results: [],
            currentIndex: -1
        };
        this.clearSearchHighlights();
    }

    /**
     * ربط اختصارات لوحة المفاتيح المتقدمة
     */
    bindAdvancedShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+F للبحث
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.showSearchModal();
            }
            
            // Ctrl+Shift+T للجداول
            if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
                e.preventDefault();
                this.showTableModal();
            }
            
            // Escape لإغلاق النوافذ
            if (e.key === 'Escape') {
                this.hideAllColorPickers();
                if (this.searchModal && this.searchModal.style.display !== 'none') {
                    this.searchModal.querySelector('#syty-search-cancel').click();
                }
                if (this.tableModal && this.tableModal.style.display !== 'none') {
                    this.tableModal.querySelector('#syty-table-cancel').click();
                }
            }
        });
        
        console.log('✅ تم ربط اختصارات لوحة المفاتيح المتقدمة');
    }

    /**
     * معالجة لون النص من شريط الأدوات
     */
    handleTextColor(button) {
        const selectedText = this.getSafeSelectedText();
        if (!selectedText) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً قبل اختيار اللون');
            return;
        }
        
        this.showColorPicker('text', button);
    }

    /**
     * معالجة لون الخلفية من شريط الأدوات
     */
    handleBackgroundColor(button) {
        const selectedText = this.getSafeSelectedText();
        if (!selectedText) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً قبل اختيار اللون');
            return;
        }
        
        this.showColorPicker('background', button);
    }

    /**
     * معالجة الجداول من شريط الأدوات
     */
    handleTable() {
        this.showTableModal();
    }

    /**
     * معالجة البحث من شريط الأدوات
     */
    handleSearch() {
        this.showSearchModal();
    }

    /**
     * تدمير الوظائف المتقدمة
     */
    destroy() {
        try {
            // إزالة منتقيات الألوان
            this.colorPickers.forEach((picker) => {
                if (picker && picker.parentNode) {
                    picker.parentNode.removeChild(picker);
                }
            });
            this.colorPickers.clear();
            
            // إزالة النوافذ
            if (this.searchModal && this.searchModal.parentNode) {
                this.searchModal.parentNode.removeChild(this.searchModal);
            }
            
            if (this.tableModal && this.tableModal.parentNode) {
                this.tableModal.parentNode.removeChild(this.tableModal);
            }
            
            // إزالة الأنماط
            const styles = document.getElementById('syty-advanced-styles');
            if (styles && styles.parentNode) {
                styles.parentNode.removeChild(styles);
            }
            
            console.log('✅ تم تدمير الوظائف المتقدمة');
            
        } catch (error) {
            console.error('❌ خطأ في تدمير الوظائف المتقدمة:', error);
        }
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyAdvanced = SytyAdvanced;
}

// تسجيل الوحدة
if (typeof window !== 'undefined' && window.SytyCore) {
    SytyCore.Debug.log('✅ تم تحميل وحدة الوظائف المتقدمة');
} 