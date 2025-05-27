/**
 * SymmaType Plugin System
 * نظام الإضافات - مستوحى من Quill.js و CKEditor
 */

class SytyPluginManager {
    constructor(editor) {
        this.editor = editor;
        this.plugins = new Map();
        this.hooks = new Map();
        this.loadedPlugins = new Set();
        
        this.init();
    }

    /**
     * تهيئة نظام الإضافات
     */
    init() {
        this.registerCoreHooks();
        this.loadCorePlugins();
    }

    /**
     * تسجيل الخطافات الأساسية
     */
    registerCoreHooks() {
        // خطافات دورة حياة المحرر
        this.registerHook('editor:init');
        this.registerHook('editor:ready');
        this.registerHook('editor:destroy');
        
        // خطافات المحتوى
        this.registerHook('content:change');
        this.registerHook('content:insert');
        this.registerHook('content:delete');
        
        // خطافات التحديد
        this.registerHook('selection:change');
        this.registerHook('selection:focus');
        this.registerHook('selection:blur');
        
        // خطافات التنسيق
        this.registerHook('format:apply');
        this.registerHook('format:remove');
        
        // خطافات لوحة المفاتيح
        this.registerHook('keyboard:keydown');
        this.registerHook('keyboard:keyup');
        
        // خطافات شريط الأدوات
        this.registerHook('toolbar:button:click');
        this.registerHook('toolbar:update');
    }

    /**
     * تحميل الإضافات الأساسية
     */
    loadCorePlugins() {
        // إضافة التحقق من الإملاء
        this.registerPlugin('spellcheck', SytySpellCheckPlugin);
        
        // إضافة العد التلقائي
        this.registerPlugin('autocount', SytyAutoCountPlugin);
        
        // إضافة الحفظ التلقائي
        this.registerPlugin('autosave', SytyAutoSavePlugin);
        
        // إضافة اختصارات متقدمة
        this.registerPlugin('shortcuts', SytyShortcutsPlugin);
        
        // إضافة التنسيق التلقائي
        this.registerPlugin('autoformat', SytyAutoFormatPlugin);
    }

    /**
     * تسجيل إضافة جديدة
     */
    registerPlugin(name, PluginClass, options = {}) {
        if (this.plugins.has(name)) {
            SytyCore.Debug.warn(`الإضافة ${name} مسجلة مسبقاً`);
            return false;
        }

        this.plugins.set(name, {
            name,
            PluginClass,
            options,
            instance: null,
            enabled: true
        });

        SytyCore.Debug.log(`تم تسجيل الإضافة: ${name}`);
        return true;
    }

    /**
     * تحميل إضافة
     */
    loadPlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            SytyCore.Debug.error(`الإضافة ${name} غير موجودة`);
            return false;
        }

        if (this.loadedPlugins.has(name)) {
            SytyCore.Debug.warn(`الإضافة ${name} محملة مسبقاً`);
            return true;
        }

        try {
            plugin.instance = new plugin.PluginClass(this.editor, plugin.options);
            this.loadedPlugins.add(name);
            
            // استدعاء خطاف التحميل
            this.triggerHook('plugin:loaded', { name, plugin: plugin.instance });
            
            SytyCore.Debug.log(`تم تحميل الإضافة: ${name}`);
            return true;
        } catch (error) {
            SytyCore.Debug.error(`فشل في تحميل الإضافة ${name}:`, error);
            return false;
        }
    }

    /**
     * إلغاء تحميل إضافة
     */
    unloadPlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin || !this.loadedPlugins.has(name)) {
            return false;
        }

        try {
            if (plugin.instance && typeof plugin.instance.destroy === 'function') {
                plugin.instance.destroy();
            }
            
            plugin.instance = null;
            this.loadedPlugins.delete(name);
            
            // استدعاء خطاف إلغاء التحميل
            this.triggerHook('plugin:unloaded', { name });
            
            SytyCore.Debug.log(`تم إلغاء تحميل الإضافة: ${name}`);
            return true;
        } catch (error) {
            SytyCore.Debug.error(`فشل في إلغاء تحميل الإضافة ${name}:`, error);
            return false;
        }
    }

    /**
     * تسجيل خطاف
     */
    registerHook(hookName) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
    }

    /**
     * إضافة مستمع لخطاف
     */
    addHookListener(hookName, callback, priority = 10) {
        this.registerHook(hookName);
        
        const listeners = this.hooks.get(hookName);
        listeners.push({ callback, priority });
        
        // ترتيب حسب الأولوية
        listeners.sort((a, b) => a.priority - b.priority);
    }

    /**
     * إزالة مستمع من خطاف
     */
    removeHookListener(hookName, callback) {
        const listeners = this.hooks.get(hookName);
        if (listeners) {
            const index = listeners.findIndex(l => l.callback === callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * تشغيل خطاف
     */
    triggerHook(hookName, data = {}) {
        const listeners = this.hooks.get(hookName);
        if (!listeners) return data;

        let result = data;
        
        for (const listener of listeners) {
            try {
                const hookResult = listener.callback(result, this.editor);
                if (hookResult !== undefined) {
                    result = hookResult;
                }
            } catch (error) {
                SytyCore.Debug.error(`خطأ في خطاف ${hookName}:`, error);
            }
        }

        return result;
    }

    /**
     * الحصول على إضافة محملة
     */
    getPlugin(name) {
        const plugin = this.plugins.get(name);
        return plugin && this.loadedPlugins.has(name) ? plugin.instance : null;
    }

    /**
     * الحصول على قائمة الإضافات المحملة
     */
    getLoadedPlugins() {
        return Array.from(this.loadedPlugins);
    }

    /**
     * تفعيل إضافة
     */
    enablePlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.enabled = true;
            if (plugin.instance && typeof plugin.instance.enable === 'function') {
                plugin.instance.enable();
            }
        }
    }

    /**
     * تعطيل إضافة
     */
    disablePlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.enabled = false;
            if (plugin.instance && typeof plugin.instance.disable === 'function') {
                plugin.instance.disable();
            }
        }
    }
}

/**
 * كلاس أساسي للإضافات
 */
class SytyPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.options = { ...this.getDefaultOptions(), ...options };
        this.enabled = true;
        
        this.init();
    }

    /**
     * الخيارات الافتراضية
     */
    getDefaultOptions() {
        return {};
    }

    /**
     * تهيئة الإضافة
     */
    init() {
        // يجب تنفيذها في الإضافات الفرعية
    }

    /**
     * تفعيل الإضافة
     */
    enable() {
        this.enabled = true;
    }

    /**
     * تعطيل الإضافة
     */
    disable() {
        this.enabled = false;
    }

    /**
     * تدمير الإضافة
     */
    destroy() {
        // تنظيف الموارد
    }
}

/**
 * إضافة التحقق من الإملاء
 */
class SytySpellCheckPlugin extends SytyPlugin {
    getDefaultOptions() {
        return {
            language: 'ar',
            enabled: true,
            highlightErrors: true
        };
    }

    init() {
        if (this.options.enabled) {
            this.enableSpellCheck();
        }
    }

    enableSpellCheck() {
        this.editor.element.setAttribute('spellcheck', 'true');
        this.editor.element.setAttribute('lang', this.options.language);
        
        if (this.options.highlightErrors) {
            this.addSpellCheckStyles();
        }
    }

    addSpellCheckStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .syty-editor [spellcheck="true"]::-webkit-spelling-error {
                text-decoration: underline wavy #dc2626;
            }
            .syty-editor [spellcheck="true"]::-moz-spelling-error {
                text-decoration: underline wavy #dc2626;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * إضافة العد التلقائي
 */
class SytyAutoCountPlugin extends SytyPlugin {
    getDefaultOptions() {
        return {
            updateInterval: 500,
            showWords: true,
            showCharacters: true,
            showParagraphs: true
        };
    }

    init() {
        this.setupAutoCount();
    }

    setupAutoCount() {
        let timeout;
        
        this.editor.element.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.updateCounts();
            }, this.options.updateInterval);
        });
    }

    updateCounts() {
        if (this.editor.statsBar) {
            this.editor.statsBar.update();
        }
    }
}

/**
 * إضافة الحفظ التلقائي
 */
class SytyAutoSavePlugin extends SytyPlugin {
    getDefaultOptions() {
        return {
            interval: 30000, // 30 ثانية
            storageKey: 'syty-autosave',
            showNotification: true
        };
    }

    init() {
        this.setupAutoSave();
        this.loadAutoSave();
    }

    setupAutoSave() {
        // تأخير بدء الحفظ التلقائي للتأكد من تهيئة المحرر
        setTimeout(() => {
            setInterval(() => {
                this.saveContent();
            }, this.options.interval);
        }, 5000); // انتظار 5 ثوان

        // حفظ عند إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            this.saveContent();
        });
    }

    saveContent() {
        try {
            // التحقق من أن المحرر جاهز
            if (!this.editor || !this.editor.getContent) {
                return;
            }
            
            const content = this.editor.getContent();
            if (content && content.trim()) {
                localStorage.setItem(this.options.storageKey, content);
                
                if (this.options.showNotification) {
                    SytyCore.Messages.info('تم الحفظ التلقائي', 1500);
                }
            }
        } catch (error) {
            console.warn('خطأ في الحفظ التلقائي:', error);
        }
    }

    loadAutoSave() {
        const saved = localStorage.getItem(this.options.storageKey);
        if (saved && saved.trim()) {
            const load = confirm('تم العثور على محتوى محفوظ تلقائياً. هل تريد استعادته؟');
            if (load) {
                this.editor.setContent(saved);
                SytyCore.Messages.success('تم استعادة المحتوى المحفوظ');
            }
        }
    }
}

/**
 * إضافة اختصارات متقدمة
 */
class SytyShortcutsPlugin extends SytyPlugin {
    getDefaultOptions() {
        return {
            showHelp: true,
            customShortcuts: {}
        };
    }

    init() {
        this.setupShortcuts();
    }

    setupShortcuts() {
        // إضافة اختصار لعرض المساعدة
        if (this.options.showHelp) {
            this.editor.keyboardManager?.addShortcut('F1', () => {
                this.showHelp();
            }, 'عرض المساعدة');
        }

        // إضافة الاختصارات المخصصة
        Object.entries(this.options.customShortcuts).forEach(([keys, action]) => {
            this.editor.keyboardManager?.addShortcut(keys, action.callback, action.description);
        });
    }

    showHelp() {
        if (this.editor.keyboardManager) {
            this.editor.keyboardManager.showHelp();
        }
    }
}

/**
 * إضافة التنسيق التلقائي
 */
class SytyAutoFormatPlugin extends SytyPlugin {
    getDefaultOptions() {
        return {
            autoLinks: true,
            autoLists: true,
            autoQuotes: true,
            markdownShortcuts: true
        };
    }

    init() {
        this.setupAutoFormat();
    }

    setupAutoFormat() {
        this.editor.element.addEventListener('input', (e) => {
            if (this.options.markdownShortcuts) {
                this.handleMarkdownShortcuts(e);
            }
        });

        this.editor.element.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                this.handleSpaceKey();
            }
        });
    }

    handleMarkdownShortcuts(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const cursorPos = range.startOffset;
            const lineStart = text.lastIndexOf('\n', cursorPos - 1) + 1;
            const lineText = text.substring(lineStart, cursorPos);

            // تحويل ## إلى عنوان
            if (lineText.match(/^#{1,3}\s$/)) {
                this.convertToHeading(lineText.length - 1);
            }
            
            // تحويل - أو * إلى قائمة
            if (lineText.match(/^[-*]\s$/)) {
                this.convertToList();
            }
        }
    }

    convertToHeading(level) {
        const tag = `h${level}`;
        document.execCommand('formatBlock', false, tag);
    }

    convertToList() {
        document.execCommand('insertUnorderedList');
    }

    handleSpaceKey() {
        if (this.options.autoLinks) {
            this.detectAndCreateLinks();
        }
    }

    detectAndCreateLinks() {
        // منطق اكتشاف الروابط التلقائي
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            
            if (urlRegex.test(text)) {
                // تحويل النص إلى رابط
                const newHTML = text.replace(urlRegex, '<a href="$1">$1</a>');
                textNode.parentNode.innerHTML = newHTML;
            }
        }
    }
}

// تصدير الكلاسات
if (typeof window !== 'undefined') {
    window.SytyPluginManager = SytyPluginManager;
    window.SytyPlugin = SytyPlugin;
    window.SytySpellCheckPlugin = SytySpellCheckPlugin;
    window.SytyAutoCountPlugin = SytyAutoCountPlugin;
    window.SytyAutoSavePlugin = SytyAutoSavePlugin;
    window.SytyShortcutsPlugin = SytyShortcutsPlugin;
    window.SytyAutoFormatPlugin = SytyAutoFormatPlugin;
} 