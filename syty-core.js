/**
 * SymmaType Core Functions
 * الوظائف الأساسية والمساعدة لمحرر النصوص
 */

/**
 * مساعدات DOM
 */
const SytyDOM = {
    /**
     * إنشاء عنصر HTML مع خصائص
     */
    createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        
        Object.keys(attributes).forEach(key => {
            if (key === 'textContent') {
                element.textContent = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        return element;
    },

    /**
     * البحث عن أقرب عنصر والد بكلاس معين
     */
    findParent(element, className) {
        let current = element;
        while (current && current !== document.body) {
            if (current.classList && current.classList.contains(className)) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    },

    /**
     * البحث عن عنصر كتلة (block element)
     */
    findBlockElement(node, container) {
        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE'];
        let current = node;
        
        while (current && current !== container && current !== document.body) {
            if (current.nodeType === Node.ELEMENT_NODE && blockTags.includes(current.tagName)) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    },

    /**
     * تنظيف النص من العلامات
     */
    getPlainText(element) {
        if (!element) return '';
        return element.textContent || element.innerText || '';
    },

    /**
     * إضافة مستمع أحداث مع إزالة تلقائية
     */
    addEventListenerWithCleanup(element, event, handler) {
        element.addEventListener(event, handler);
        return () => element.removeEventListener(event, handler);
    }
};

/**
 * مساعدات التحديد (Selection)
 */
const SytySelection = {
    /**
     * الحصول على التحديد الحالي
     */
    getCurrent() {
        return window.getSelection();
    },

    /**
     * الحصول على النطاق الحالي
     */
    getCurrentRange() {
        const selection = this.getCurrent();
        return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    },

    /**
     * تحديد محتوى عنصر
     */
    selectElement(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = this.getCurrent();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    /**
     * وضع المؤشر في نهاية عنصر
     */
    setCursorAtEnd(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = this.getCurrent();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    /**
     * وضع المؤشر في بداية عنصر
     */
    setCursorAtStart(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(true);
        const selection = this.getCurrent();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    /**
     * الحصول على النص المحدد
     */
    getSelectedText() {
        const selection = this.getCurrent();
        return selection.toString();
    },

    /**
     * التحقق من وجود تحديد
     */
    hasSelection() {
        const selection = this.getCurrent();
        return selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
    }
};

/**
 * مساعدات الأنماط
 */
const SytyStyles = {
    /**
     * تطبيق أنماط CSS على عنصر
     */
    apply(element, styles) {
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        });
    },

    /**
     * إزالة كلاس مع البادئة syty
     */
    removeSytyClasses(element) {
        const classes = Array.from(element.classList);
        classes.forEach(className => {
            if (className.startsWith('syty-')) {
                element.classList.remove(className);
            }
        });
    },

    /**
     * التحقق من وجود كلاس syty
     */
    hasSytyClass(element) {
        return Array.from(element.classList).some(className => 
            className.startsWith('syty-') && className !== 'syty-editor'
        );
    },

    /**
     * الحصول على كلاسات syty
     */
    getSytyClasses(element) {
        return Array.from(element.classList).filter(className => 
            className.startsWith('syty-') && className !== 'syty-editor'
        );
    }
};

/**
 * مساعدات الرسائل
 */
const SytyMessages = {
    /**
     * عرض رسالة مؤقتة
     */
    show(message, type = 'info', duration = 2000) {
        const messageEl = SytyDOM.createElement('div', `syty-message syty-message-${type}`, {
            textContent: message
        });

        // إضافة الرسالة للصفحة
        document.body.appendChild(messageEl);

        // إظهار الرسالة
        setTimeout(() => messageEl.classList.add('syty-message-show'), 10);

        // إخفاء وإزالة الرسالة
        setTimeout(() => {
            messageEl.classList.remove('syty-message-show');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, duration);
    },

    /**
     * رسالة نجاح
     */
    success(message) {
        this.show(message, 'success');
    },

    /**
     * رسالة تحذير
     */
    warning(message) {
        this.show(message, 'warning');
    },

    /**
     * رسالة خطأ
     */
    error(message) {
        this.show(message, 'error');
    },

    /**
     * رسالة معلوماتية
     */
    info(message, duration = 2000) {
        this.show(message, 'info', duration);
    }
};

/**
 * مساعدات التحقق
 */
const SytyValidation = {
    /**
     * التحقق من صحة URL
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * التحقق من وجود نص
     */
    hasText(element) {
        return element && SytyDOM.getPlainText(element).trim().length > 0;
    },

    /**
     * التحقق من كون العنصر فارغ
     */
    isEmpty(element) {
        if (!element) return true;
        const text = SytyDOM.getPlainText(element).trim();
        return text.length === 0 || text === '\n' || element.innerHTML === '<br>';
    }
};

/**
 * مساعدات التصحيح
 */
const SytyDebug = {
    /**
     * طباعة رسالة تصحيح
     */
    log(message, data = null) {
        if (window.SYTY_DEBUG) {
            console.log(`[SymmaType] ${message}`, data || '');
        }
    },

    /**
     * طباعة تحذير
     */
    warn(message, data = null) {
        if (window.SYTY_DEBUG) {
            console.warn(`[SymmaType] ${message}`, data || '');
        }
    },

    /**
     * طباعة خطأ
     */
    error(message, error = null) {
        console.error(`[SymmaType] ${message}`, error || '');
    }
};

// تصدير الوظائف للاستخدام العام
if (typeof window !== 'undefined') {
    window.SytyCore = {
        DOM: SytyDOM,
        Selection: SytySelection,
        Styles: SytyStyles,
        Messages: SytyMessages,
        Validation: SytyValidation,
        Debug: SytyDebug
    };
} 