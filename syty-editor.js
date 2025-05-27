/**
 * SymmaType Editor - المحرر الرئيسي
 * يجمع جميع الوظائف والمكونات
 */

class SytyEditor {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            debug: false,
            autoSave: false,
            placeholder: 'ابدأ الكتابة...',
            plugins: ['spellcheck', 'autocount', 'autosave', 'shortcuts', 'autoformat'],
            ...options
        };
        
        this.container = null;
        this.toolbar = null;
        this.styleManager = null;
        this.statsBar = null;
        this.historyManager = null;
        this.keyboardManager = null;
        this.pluginManager = null;
        this.advanced = null;
        this.isInitialized = false;
        
        // تفعيل وضع التصحيح
        window.SYTY_DEBUG = this.options.debug;
        
        this.init();
    }

    /**
     * تهيئة المحرر
     */
    init() {
        SytyCore.Debug.log('🚀 تهيئة محرر SymmaType');
        
        try {
            this.validateElement();
            this.createContainer();
            this.setupEditor();
            this.createToolbar();
            this.createStyleManager();
            this.createHistoryManager();
            this.createKeyboardManager();
            this.createPluginManager();
            this.createAdvancedFeatures();
            this.createStatsBar();
            this.bindEvents();
            this.setInitialContent();
            this.loadPlugins();
            
            this.isInitialized = true;
            SytyCore.Debug.log('✅ تم تهيئة المحرر بنجاح');
            
            // إطلاق حدث التهيئة
            this.dispatchEvent('syty:initialized');
            
            // إطلاق حدث عام للتهيئة
            document.dispatchEvent(new CustomEvent('syty:initialized', {
                detail: { editor: this }
            }));
            
        } catch (error) {
            SytyCore.Debug.error('❌ خطأ في تهيئة المحرر', error);
            throw error;
        }
    }

    /**
     * التحقق من صحة العنصر
     */
    validateElement() {
        if (!this.element) {
            throw new Error('عنصر المحرر غير موجود');
        }
        
        if (this.element.tagName !== 'TEXTAREA') {
            throw new Error('العنصر يجب أن يكون textarea');
        }
    }

    /**
     * إنشاء الحاوي الرئيسي
     */
    createContainer() {
        this.container = SytyCore.DOM.createElement('div', 'syty-container');
        
        // إدراج الحاوي بعد textarea
        this.element.parentNode.insertBefore(this.container, this.element.nextSibling);
        
        // إخفاء textarea الأصلي
        this.element.style.display = 'none';
    }

    /**
     * إعداد منطقة التحرير
     */
    setupEditor() {
        // إنشاء منطقة التحرير
        const editorDiv = SytyCore.DOM.createElement('div', 'syty-editor', {
            contenteditable: 'true',
            'data-placeholder': this.options.placeholder
        });
        
        // إضافة المحرر للحاوي
        this.container.appendChild(editorDiv);
        
        // تحديث مرجع العنصر
        this.element = editorDiv;
    }

    /**
     * إنشاء شريط الأدوات
     */
    createToolbar() {
        this.toolbar = new SytyToolbar(this);
        const toolbarElement = this.toolbar.create();
        
        // إدراج شريط الأدوات في بداية الحاوي
        this.container.insertBefore(toolbarElement, this.element);
    }

    /**
     * إنشاء مدير الأنماط
     */
    createStyleManager() {
        this.styleManager = new SytyStyleManager(this);
        
        // ربط مدير الأنماط بالنافذة للوصول إليه من شريط الأدوات
        window.SytyStyleManager = this.styleManager;
    }

    /**
     * إنشاء مدير التاريخ
     */
    createHistoryManager() {
        this.historyManager = new SytyHistoryManager(this);
        SytyCore.Debug.log('✅ تم إنشاء مدير التاريخ');
    }

    /**
     * إنشاء مدير لوحة المفاتيح
     */
    createKeyboardManager() {
        if (typeof SytyKeyboard !== 'undefined') {
            this.keyboardManager = new SytyKeyboard(this);
            SytyCore.Debug.log('✅ تم إنشاء مدير لوحة المفاتيح');
        } else {
            SytyCore.Debug.warn('⚠️ SytyKeyboard غير متوفر');
        }
    }

    /**
     * إنشاء مدير الإضافات
     */
    createPluginManager() {
        if (typeof SytyPluginManager !== 'undefined') {
            this.pluginManager = new SytyPluginManager(this);
            SytyCore.Debug.log('✅ تم إنشاء مدير الإضافات');
        } else {
            SytyCore.Debug.warn('⚠️ SytyPluginManager غير متوفر');
        }
    }

    /**
     * تحميل الإضافات المحددة
     */
    loadPlugins() {
        if (!this.pluginManager) return;

        this.options.plugins.forEach(pluginName => {
            try {
                this.pluginManager.loadPlugin(pluginName);
                SytyCore.Debug.log(`✅ تم تحميل الإضافة: ${pluginName}`);
            } catch (error) {
                SytyCore.Debug.error(`❌ فشل في تحميل الإضافة ${pluginName}:`, error);
            }
        });
    }

    /**
     * إنشاء الوظائف المتقدمة
     */
    createAdvancedFeatures() {
        if (typeof SytyAdvanced !== 'undefined') {
            this.advanced = new SytyAdvanced(this);
            SytyCore.Debug.log('✅ تم إنشاء الوظائف المتقدمة');
        } else {
            SytyCore.Debug.warn('⚠️ SytyAdvanced غير متوفر');
        }
    }



    /**
     * إنشاء شريط الإحصائيات
     */
    createStatsBar() {
        this.statsBar = new SytyStatsBar(this);
        const statsElement = this.statsBar.create();
        
        // إضافة شريط الإحصائيات في نهاية الحاوي
        this.container.appendChild(statsElement);
    }

    /**
     * ربط الأحداث
     */
    bindEvents() {
        // أحداث المحرر
        this.bindEditorEvents();
        
        // أحداث لوحة المفاتيح
        this.bindKeyboardEvents();
        
        // أحداث التحديد
        this.bindSelectionEvents();
        
        // أحداث النافذة
        this.bindWindowEvents();
    }

    /**
     * ربط أحداث المحرر
     */
    bindEditorEvents() {
        // حدث الإدخال
        this.element.addEventListener('input', (e) => {
            this.handleInput(e);
        });
        
        // حدث التركيز
        this.element.addEventListener('focus', (e) => {
            this.handleFocus(e);
        });
        
        // حدث فقدان التركيز
        this.element.addEventListener('blur', (e) => {
            this.handleBlur(e);
        });
        
        // حدث اللصق
        this.element.addEventListener('paste', (e) => {
            this.handlePaste(e);
        });
    }

    /**
     * ربط أحداث لوحة المفاتيح
     */
    bindKeyboardEvents() {
        this.element.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        this.element.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    /**
     * ربط أحداث التحديد
     */
    bindSelectionEvents() {
        document.addEventListener('selectionchange', () => {
            if (this.isInitialized && this.toolbar) {
                this.toolbar.updateState();
                this.handleSelectionChange();
            }
        });
    }

    /**
     * معالجة تغيير التحديد
     */
    handleSelectionChange() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        // التحقق من أن التحديد داخل المحرر
        const isInEditor = this.element.contains(range.startContainer) && 
                          this.element.contains(range.endContainer);
        
        if (isInEditor && selectedText) {
            console.log(`📝 تم تحديد النص: "${selectedText}"`);
            
            // إطلاق حدث تحديد النص
            this.dispatchEvent('syty:textSelected', { 
                text: selectedText,
                range: range 
            });
        }
    }

    /**
     * ربط أحداث النافذة
     */
    bindWindowEvents() {
        // حفظ تلقائي عند إغلاق النافذة
        window.addEventListener('beforeunload', () => {
            this.saveToTextarea();
        });
        
        // تحديث حالة شريط الأدوات عند تغيير حجم النافذة
        window.addEventListener('resize', () => {
            if (this.toolbar) {
                this.toolbar.updateState();
            }
        });
    }

    /**
     * معالجة حدث الإدخال
     */
    handleInput(e) {
        SytyCore.Debug.log('📝 حدث إدخال');
        
        // تنظيف المحرر
        this.styleManager.cleanupEditor();
        
        // تحديث الإحصائيات
        if (this.statsBar) {
            this.statsBar.update();
        }
        
        // حفظ المحتوى في textarea
        this.saveToTextarea();
        
        // إطلاق حدث التغيير
        this.dispatchEvent('syty:input', { content: this.getContent() });
    }

    /**
     * معالجة حدث التركيز
     */
    handleFocus(e) {
        SytyCore.Debug.log('🎯 تركيز على المحرر');
        
        // تفعيل شريط الأدوات
        if (this.toolbar) {
            this.toolbar.enable();
        }
        
        // إطلاق حدث التركيز
        this.dispatchEvent('syty:focus');
    }

    /**
     * معالجة حدث فقدان التركيز
     */
    handleBlur(e) {
        SytyCore.Debug.log('👋 فقدان التركيز');
        
        // حفظ المحتوى
        this.saveToTextarea();
        
        // إطلاق حدث فقدان التركيز
        this.dispatchEvent('syty:blur');
    }

    /**
     * معالجة حدث اللصق
     */
    handlePaste(e) {
        SytyCore.Debug.log('📋 حدث لصق');
        
        // منع اللصق الافتراضي
        e.preventDefault();
        
        // الحصول على النص العادي
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        
        // إدراج النص كنص عادي
        document.execCommand('insertText', false, text);
        
        // تنظيف المحرر
        setTimeout(() => {
            this.styleManager.cleanupEditor();
        }, 10);
    }

    /**
     * معالجة أحداث لوحة المفاتيح
     */
    handleKeyDown(e) {
        // اختصارات لوحة المفاتيح
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    document.execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    document.execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    document.execCommand('underline');
                    break;
                case 's':
                    e.preventDefault();
                    this.saveToTextarea();
                    SytyCore.Messages.success('تم الحفظ');
                    break;
            }
        }
        
        // مفتاح Enter
        if (e.key === 'Enter') {
            this.handleEnterKey(e);
        }
        
        // مفتاح Backspace
        if (e.key === 'Backspace') {
            this.handleBackspaceKey(e);
        }
    }

    /**
     * معالجة مفتاح Enter - محسنة للنصوص المنسقة
     */
    handleEnterKey(e) {
        const range = SytyCore.Selection.getCurrentRange();
        if (!range) return;
        
        const currentElement = SytyCore.DOM.findBlockElement(range.startContainer, this.element);
        
        // إذا كان المؤشر في عنصر منسق
        if (currentElement && SytyCore.Styles.hasSytyClass(currentElement)) {
            e.preventDefault();
            
            // تحديد موضع المؤشر في النص
            const startContainer = range.startContainer;
            const startOffset = range.startOffset;
            
            // إذا كان المؤشر في وسط النص
            if (startContainer.nodeType === Node.TEXT_NODE && 
                startOffset > 0 && 
                startOffset < startContainer.textContent.length) {
                
                // تقسيم النص عند موضع المؤشر
                const textBefore = startContainer.textContent.substring(0, startOffset);
                const textAfter = startContainer.textContent.substring(startOffset);
                
                // تحديث النص في العنصر الحالي
                currentElement.textContent = textBefore;
                
                // إنشاء فقرة جديدة للنص المتبقي
                const newP = SytyCore.DOM.createElement('p');
                if (textAfter.trim()) {
                    newP.textContent = textAfter;
                } else {
                    newP.innerHTML = '<br>';
                }
                
                // إدراج الفقرة الجديدة
                currentElement.parentNode.insertBefore(newP, currentElement.nextSibling);
                
                // وضع المؤشر في بداية الفقرة الجديدة
                setTimeout(() => {
                    SytyCore.Selection.setCursorAtStart(newP);
                }, 10);
                
            } else if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
                // المؤشر في بداية النص - إنشاء فقرة قبل العنصر الحالي
                const newP = SytyCore.DOM.createElement('p', '', { innerHTML: '<br>' });
                currentElement.parentNode.insertBefore(newP, currentElement);
                
                // وضع المؤشر في الفقرة الجديدة
                setTimeout(() => {
                    SytyCore.Selection.setCursorAtEnd(newP);
                }, 10);
                
            } else {
                // المؤشر في نهاية النص أو في عقدة أخرى - إنشاء فقرة بعد العنصر
                const newP = SytyCore.DOM.createElement('p', '', { innerHTML: '<br>' });
                currentElement.parentNode.insertBefore(newP, currentElement.nextSibling);
                
                // وضع المؤشر في الفقرة الجديدة
                setTimeout(() => {
                    SytyCore.Selection.setCursorAtEnd(newP);
                }, 10);
            }
            
            // تحديث الإحصائيات
            setTimeout(() => {
                if (this.statsBar) {
                    this.statsBar.update();
                }
            }, 50);
        }
        // إذا لم يكن في عنصر منسق، اترك السلوك الافتراضي
    }

    /**
     * معالجة مفتاح Backspace
     */
    handleBackspaceKey(e) {
        const range = SytyCore.Selection.getCurrentRange();
        if (range && range.collapsed) {
            const currentElement = SytyCore.DOM.findBlockElement(range.startContainer, this.element);
            
            // إذا كان العنصر فارغ ومنسق، تحويله لفقرة عادية
            if (currentElement && 
                SytyCore.Styles.hasSytyClass(currentElement) && 
                SytyCore.Validation.isEmpty(currentElement)) {
                
                e.preventDefault();
                
                const newP = SytyCore.DOM.createElement('p', '', { innerHTML: '<br>' });
                currentElement.parentNode.replaceChild(newP, currentElement);
                SytyCore.Selection.setCursorAtEnd(newP);
            }
        }
    }

    /**
     * معالجة حدث رفع المفتاح
     */
    handleKeyUp(e) {
        // تحديث حالة شريط الأدوات
        if (this.toolbar) {
            this.toolbar.updateState();
        }
    }

    /**
     * تعيين المحتوى الأولي
     */
    setInitialContent() {
        const originalTextarea = this.container.previousElementSibling;
        if (originalTextarea && originalTextarea.value) {
            this.setContent(originalTextarea.value);
        } else {
            // إضافة فقرة فارغة
            this.element.innerHTML = '<p><br></p>';
        }
    }

    /**
     * الحصول على محتوى المحرر
     */
    getContent() {
        return this.element.innerHTML;
    }

    /**
     * الحصول على HTML (مرادف لـ getContent)
     */
    getHTML() {
        return this.getContent();
    }

    /**
     * تعيين محتوى المحرر
     */
    setContent(content) {
        this.element.innerHTML = content;
        this.saveToTextarea();
    }

    /**
     * تعيين HTML (مرادف لـ setContent)
     */
    setHTML(html) {
        this.setContent(html);
    }

    /**
     * إدراج HTML في المحرر
     */
    insertHTML(html) {
        try {
            this.element.focus();
            const success = document.execCommand('insertHTML', false, html);
            if (!success) {
                // طريقة بديلة إذا فشل execCommand
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const fragment = range.createContextualFragment(html);
                    range.insertNode(fragment);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            this.saveToTextarea();
            return success;
        } catch (error) {
            console.error('خطأ في إدراج HTML:', error);
            return false;
        }
    }

    /**
     * الحصول على النص العادي
     */
    getPlainText() {
        return SytyCore.DOM.getPlainText(this.element);
    }

    /**
     * حفظ المحتوى في textarea الأصلي
     */
    saveToTextarea() {
        const originalTextarea = this.container.previousElementSibling;
        if (originalTextarea && originalTextarea.tagName === 'TEXTAREA') {
            originalTextarea.value = this.getContent();
        }
    }

    /**
     * تنظيف المحرر
     */
    cleanup() {
        if (this.styleManager) {
            this.styleManager.cleanupEditor();
        }
    }

    /**
     * تدمير المحرر
     */
    destroy() {
        SytyCore.Debug.log('🗑️ تدمير المحرر');
        
        // حفظ المحتوى
        this.saveToTextarea();
        
        // إزالة الحاوي
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // إظهار textarea الأصلي
        const originalTextarea = this.container.previousElementSibling;
        if (originalTextarea) {
            originalTextarea.style.display = '';
        }
        
        // تدمير الوظائف المتقدمة
        if (this.advanced) {
            this.advanced.destroy();
        }
        
        // تنظيف المراجع
        this.element = null;
        this.container = null;
        this.toolbar = null;
        this.styleManager = null;
        this.advanced = null;
        this.isInitialized = false;
        
        // إطلاق حدث التدمير
        this.dispatchEvent('syty:destroyed');
    }

    /**
     * إطلاق حدث مخصص
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: { editor: this, ...detail }
        });
        
        if (this.container) {
            this.container.dispatchEvent(event);
        }
        
        document.dispatchEvent(event);
    }

    /**
     * الحصول على معلومات المحرر
     */
    getInfo() {
        return {
            version: '2.0.0',
            isInitialized: this.isInitialized,
            contentLength: this.getPlainText().length,
            wordCount: this.getPlainText().split(/\s+/).filter(word => word.length > 0).length,
            options: this.options
        };
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyEditor = SytyEditor;
} 