/**
 * SymmaType Keyboard Manager
 * إدارة اختصارات لوحة المفاتيح - مستوحى من المحررات الاحترافية
 */

class SytyKeyboard {
    constructor(editor) {
        this.editor = editor;
        this.shortcuts = new Map();
        this.isComposing = false;
        this.lastKeyTime = 0;
        this.keySequence = [];
        
        this.init();
    }

    /**
     * تهيئة نظام لوحة المفاتيح
     */
    init() {
        this.registerDefaultShortcuts();
        this.attachEventListeners();
    }

    /**
     * تسجيل الاختصارات الافتراضية (مثل Quill.js)
     */
    registerDefaultShortcuts() {
        // اختصارات التنسيق الأساسية
        this.addShortcut('Ctrl+B', 'bold', 'تطبيق/إزالة الخط العريض');
        this.addShortcut('Ctrl+I', 'italic', 'تطبيق/إزالة الخط المائل');
        this.addShortcut('Ctrl+U', 'underline', 'تطبيق/إزالة التسطير');
        
        // اختصارات التراجع والإعادة
        this.addShortcut('Ctrl+Z', 'undo', 'التراجع');
        this.addShortcut('Ctrl+Y', 'redo', 'الإعادة');
        this.addShortcut('Ctrl+Shift+Z', 'redo', 'الإعادة (بديل)');
        
        // اختصارات التحديد
        this.addShortcut('Ctrl+A', 'selectAll', 'تحديد الكل');
        
        // اختصارات النسخ واللصق
        this.addShortcut('Ctrl+C', 'copy', 'نسخ');
        this.addShortcut('Ctrl+V', 'paste', 'لصق');
        this.addShortcut('Ctrl+X', 'cut', 'قص');
        
        // اختصارات القوائم
        this.addShortcut('Ctrl+Shift+7', 'insertOrderedList', 'قائمة مرقمة');
        this.addShortcut('Ctrl+Shift+8', 'insertUnorderedList', 'قائمة نقطية');
        
        // اختصارات العناوين (مثل Notion)
        this.addShortcut('Ctrl+Alt+1', () => this.applyHeading('h1'), 'عنوان رئيسي');
        this.addShortcut('Ctrl+Alt+2', () => this.applyHeading('h2'), 'عنوان فرعي');
        this.addShortcut('Ctrl+Alt+3', () => this.applyHeading('h3'), 'عنوان صغير');
        
        // اختصارات خاصة بالعربية
        this.addShortcut('Ctrl+Shift+R', 'toggleDirection', 'تبديل اتجاه النص');
        
        // اختصارات متقدمة
        this.addShortcut('Ctrl+K', 'createLink', 'إنشاء رابط');
        this.addShortcut('Ctrl+Shift+K', 'unlink', 'إزالة الرابط');
        this.addShortcut('Ctrl+/', 'removeFormat', 'إزالة التنسيق');
        
        // اختصار الفاصل
        this.addShortcut('Ctrl+Shift+H', 'insertHR', 'إدراج فاصل');
        
        // اختصارات المعاينة
        this.addShortcut('Ctrl+Shift+P', 'showPreview', 'معاينة');
        this.addShortcut('Ctrl+Shift+<', 'showHTML', 'عرض HTML');
    }

    /**
     * إضافة اختصار جديد
     */
    addShortcut(keys, action, description) {
        const normalizedKeys = this.normalizeKeys(keys);
        this.shortcuts.set(normalizedKeys, {
            action,
            description,
            keys: normalizedKeys
        });
    }

    /**
     * تطبيع مفاتيح الاختصار
     */
    normalizeKeys(keys) {
        return keys.toLowerCase()
                  .replace(/\s+/g, '')
                  .split('+')
                  .sort()
                  .join('+');
    }

    /**
     * ربط مستمعي الأحداث
     */
    attachEventListeners() {
        this.editor.element.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.editor.element.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.editor.element.addEventListener('compositionstart', () => this.isComposing = true);
        this.editor.element.addEventListener('compositionend', () => this.isComposing = false);
    }

    /**
     * معالجة ضغط المفاتيح
     */
    handleKeyDown(e) {
        // تجاهل الأحداث أثناء الكتابة المركبة (للغات الآسيوية)
        if (this.isComposing) return;

        const shortcutKey = this.getShortcutKey(e);
        
        if (this.shortcuts.has(shortcutKey)) {
            e.preventDefault();
            e.stopPropagation();
            
            const shortcut = this.shortcuts.get(shortcutKey);
            this.executeShortcut(shortcut);
            return;
        }

        // معالجة مفاتيح خاصة
        this.handleSpecialKeys(e);
    }

    /**
     * الحصول على مفتاح الاختصار من الحدث
     */
    getShortcutKey(e) {
        const keys = [];
        
        if (e.ctrlKey) keys.push('ctrl');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey) keys.push('shift');
        if (e.metaKey) keys.push('meta');
        
        // إضافة المفتاح الأساسي
        const key = e.key.toLowerCase();
        if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
            keys.push(key);
        }
        
        return keys.sort().join('+');
    }

    /**
     * تنفيذ الاختصار
     */
    executeShortcut(shortcut) {
        try {
            if (typeof shortcut.action === 'function') {
                shortcut.action();
            } else if (typeof shortcut.action === 'string') {
                // استدعاء الأمر من شريط الأدوات
                if (this.editor.toolbar) {
                    this.editor.toolbar.handleButtonClick(shortcut.action);
                } else {
                    // تنفيذ مباشر
                    document.execCommand(shortcut.action);
                }
            }
            
            SytyCore.Debug.log(`تم تنفيذ الاختصار: ${shortcut.keys} -> ${shortcut.description}`);
        } catch (error) {
            SytyCore.Debug.error('خطأ في تنفيذ الاختصار', error);
        }
    }

    /**
     * معالجة المفاتيح الخاصة
     */
    handleSpecialKeys(e) {
        switch (e.key) {
            case 'Enter':
                this.handleEnterKey(e);
                break;
            case 'Tab':
                this.handleTabKey(e);
                break;
            case 'Backspace':
                this.handleBackspaceKey(e);
                break;
            case 'Delete':
                this.handleDeleteKey(e);
                break;
        }
    }

    /**
     * معالجة مفتاح Enter (مثل Notion)
     */
    handleEnterKey(e) {
        // إذا كان Shift+Enter، إدراج سطر جديد بدون فقرة
        if (e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br>');
            return;
        }

        // معالجة خاصة للقوائم
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const listItem = range.startContainer.closest?.('li');
            
            if (listItem && !listItem.textContent.trim()) {
                // إذا كان في عنصر قائمة فارغ، الخروج من القائمة
                e.preventDefault();
                document.execCommand('outdent');
                return;
            }
        }
    }

    /**
     * معالجة مفتاح Tab
     */
    handleTabKey(e) {
        e.preventDefault();
        
        if (e.shiftKey) {
            // Shift+Tab = تقليل المسافة البادئة
            document.execCommand('outdent');
        } else {
            // Tab = زيادة المسافة البادئة
            document.execCommand('indent');
        }
    }

    /**
     * معالجة مفتاح Backspace
     */
    handleBackspaceKey(e) {
        // معالجة خاصة لحذف العناصر المنسقة
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // إذا كان في بداية عنصر منسق، تحويله لفقرة عادية
            if (range.startOffset === 0) {
                const blockElement = range.startContainer.closest?.('h1, h2, h3, h4, h5, h6');
                if (blockElement) {
                    e.preventDefault();
                    this.convertToPlainParagraph(blockElement);
                    return;
                }
            }
        }
    }

    /**
     * معالجة مفتاح Delete
     */
    handleDeleteKey(e) {
        // معالجة مشابهة لـ Backspace
        this.handleBackspaceKey(e);
    }

    /**
     * تطبيق عنوان
     */
    applyHeading(tag) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const blockElement = SytyCore.DOM.findBlockElement(range.startContainer, this.editor.element);
            
            if (blockElement) {
                const newElement = document.createElement(tag);
                newElement.innerHTML = blockElement.innerHTML;
                blockElement.parentNode.replaceChild(newElement, blockElement);
                
                // استعادة التحديد
                setTimeout(() => {
                    const newRange = document.createRange();
                    newRange.selectNodeContents(newElement);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }, 10);
            }
        }
    }

    /**
     * تحويل عنصر إلى فقرة عادية
     */
    convertToPlainParagraph(element) {
        const p = document.createElement('p');
        p.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(p, element);
        
        // وضع المؤشر في بداية الفقرة
        setTimeout(() => {
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }, 10);
    }

    /**
     * معالجة رفع المفتاح
     */
    handleKeyUp(e) {
        // تسجيل في التاريخ للمفاتيح المهمة
        if (this.shouldRecordKeyUp(e)) {
            if (this.editor.historyManager) {
                this.editor.historyManager.takeSnapshot('typing');
            }
        }
    }

    /**
     * تحديد ما إذا كان يجب تسجيل رفع المفتاح
     */
    shouldRecordKeyUp(e) {
        const key = e.key;
        
        // تسجيل للمفاتيح التي تغير المحتوى
        return !e.ctrlKey && !e.altKey && !e.metaKey && 
               key.length === 1 || 
               key === 'Backspace' || 
               key === 'Delete' || 
               key === 'Enter';
    }

    /**
     * الحصول على قائمة الاختصارات
     */
    getShortcuts() {
        return Array.from(this.shortcuts.values());
    }

    /**
     * عرض مساعدة الاختصارات
     */
    showHelp() {
        const shortcuts = this.getShortcuts();
        const helpContent = shortcuts.map(shortcut => 
            `${shortcut.keys.toUpperCase()}: ${shortcut.description}`
        ).join('\n');
        
        alert(`اختصارات لوحة المفاتيح:\n\n${helpContent}`);
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyKeyboard = SytyKeyboard;
} 