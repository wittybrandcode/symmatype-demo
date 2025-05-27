/**
 * SymmaType Statistics Bar
 * شريط الإحصائيات - عرض إحصائيات المحتوى
 */

class SytyStatsBar {
    constructor(editor) {
        this.editor = editor;
        this.statsBar = null;
        this.stats = {
            words: 0,
            characters: 0,
            charactersNoSpaces: 0,
            paragraphs: 0,
            links: 0,
            images: 0,
            lists: 0,
            headings: 0,
            alerts: 0,
            dividers: 0
        };
    }

    /**
     * إنشاء شريط الإحصائيات
     */
    create() {
        this.statsBar = SytyCore.DOM.createElement('div', 'syty-stats-bar');
        
        // إنشاء عناصر الإحصائيات
        this.createStatsElements();
        
        // تحديث الإحصائيات الأولية
        this.update();
        
        return this.statsBar;
    }

    /**
     * إنشاء عناصر الإحصائيات
     */
    createStatsElements() {
        // إحصائيات مبسطة فقط
        const statsItems = [
            { key: 'words', label: 'كلمة', icon: 'text_fields' },
            { key: 'characters', label: 'حرف', icon: 'format_size' },
            { key: 'paragraphs', label: 'فقرة', icon: 'format_paragraph' }
        ];

        statsItems.forEach(item => {
            const statElement = this.createStatElement(item);
            this.statsBar.appendChild(statElement);
        });
        
        // إضافة معلومات المحرر
        this.addEditorInfo();
    }

    /**
     * إنشاء عنصر إحصائية واحد (أيقونة فقط مع فقاعة)
     */
    createStatElement(item) {
        const statDiv = SytyCore.DOM.createElement('div', 'syty-stat-item');
        const value = SytyCore.DOM.createElement('span', 'syty-stat-value', {
            textContent: '0',
            'data-stat': item.key,
            title: `${item.label}: 0`
        });
        const icon = SytyCore.DOM.createElement('span', 'material-icons syty-status-icon', {
            title: `${item.label}`,
            textContent: item.icon
        });
        statDiv.appendChild(icon);
        statDiv.appendChild(value);
        return statDiv;
    }

    /**
     * إضافة معلومات المحرر
     */
    addEditorInfo() {
        // فاصل
        const separator = SytyCore.DOM.createElement('div', 'syty-stats-separator');
        this.statsBar.appendChild(separator);

        // حالة المحرر
        const statusDiv = SytyCore.DOM.createElement('div', 'syty-editor-status');
        statusDiv.innerHTML = '<span class="material-icons syty-status-icon" title="المحرر جاهز">fiber_manual_record</span>';
        this.statsBar.appendChild(statusDiv);

        // الإصدار
        const versionDiv = SytyCore.DOM.createElement('div', 'syty-editor-version');
        versionDiv.innerHTML = '<span class="material-icons syty-status-icon" title="الإصدار: 2.0.0">info</span>';
        this.statsBar.appendChild(versionDiv);

        // التصميم
        const designDiv = SytyCore.DOM.createElement('div', 'syty-editor-design');
        designDiv.innerHTML = '<span class="material-icons syty-status-icon" title="التصميم: مبسط">design_services</span>';
        this.statsBar.appendChild(designDiv);

        // حالة التدقيق الإملائي
        const spellDiv = SytyCore.DOM.createElement('div', 'syty-editor-spell');
        spellDiv.innerHTML = '<span class="material-icons syty-status-icon" title="التدقيق الإملائي: مفعّل تلقائياً">spellcheck</span>';
        this.statsBar.appendChild(spellDiv);

        // حالة الحفظ
        const saveDiv = SytyCore.DOM.createElement('div', 'syty-editor-save');
        saveDiv.innerHTML = '<span class="material-icons syty-status-icon" title="تم الحفظ">save</span>';
        this.statsBar.appendChild(saveDiv);

        // --- إضافة شعار ورابط الموقع في أقصى اليسار ---
        const logoLink = document.createElement('a');
        logoLink.href = 'https://www.symmatype.com';
        logoLink.target = '_blank';
        logoLink.rel = 'noopener noreferrer';
        logoLink.title = 'موقع SymmaType الرسمي';
        logoLink.className = 'syty-status-logo-link';
        const logoImg = document.createElement('img');
        var basePath = window.SYTY_BASE_PATH || '';
        logoImg.src = basePath + 'symmatypelogo.png';
        logoImg.alt = 'SymmaType Logo';
        logoImg.className = 'syty-status-logo';
        logoImg.style.width = '24px';
        logoImg.style.height = '24px';
        logoImg.onerror = function() {
            const fallback = document.createElement('span');
            fallback.textContent = '©';
            fallback.style.fontSize = '22px';
            fallback.style.color = '#2563eb';
            fallback.style.fontWeight = 'bold';
            fallback.style.fontFamily = 'Arial, sans-serif';
            this.replaceWith(fallback);
        };
        logoLink.appendChild(logoImg);
        this.statsBar.appendChild(logoLink);

        // --- جعل أيقونة التصميم قابلة للنقر لتفعيل الوضع الليلي ---
        const icon = designDiv.querySelector('.material-icons');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.title = 'تبديل المظهر الليلي';
            icon.onclick = function(e) {
                e.stopPropagation();
                let nightCss = document.getElementById('syty-night-css');
                if (!nightCss) {
                    nightCss = document.createElement('link');
                    nightCss.rel = 'stylesheet';
                    nightCss.id = 'syty-night-css';
                    nightCss.href = (window.SYTY_BASE_PATH || '') + 'syty-editor-style-night.css';
                    document.head.appendChild(nightCss);
                    icon.textContent = 'nightlight';
                    icon.title = 'إلغاء المظهر الليلي';
                } else {
                    nightCss.remove();
                    icon.textContent = 'design_services';
                    icon.title = 'تبديل المظهر الليلي';
                }
            };
        }
    }

    /**
     * تحديث جميع الإحصائيات
     */
    update() {
        try {
            this.calculateStats();
            this.updateDisplay();
        } catch (error) {
            SytyCore.Debug.error('خطأ في تحديث الإحصائيات', error);
        }
    }

    /**
     * حساب الإحصائيات
     */
    calculateStats() {
        const content = this.editor.element;
        const plainText = SytyCore.DOM.getPlainText(content);
        
        // حساب الكلمات
        this.stats.words = this.countWords(plainText);
        
        // حساب الأحرف
        this.stats.characters = plainText.length;
        this.stats.charactersNoSpaces = plainText.replace(/\s/g, '').length;
        
        // حساب الفقرات
        this.stats.paragraphs = this.countElements(content, 'p, div[class*="syty-"]');
        
        // حساب الروابط
        this.stats.links = this.countElements(content, 'a[href]');
        
        // حساب الصور
        this.stats.images = this.countElements(content, 'img');
        
        // حساب القوائم
        this.stats.lists = this.countElements(content, 'ul, ol');
        
        // حساب العناوين
        this.stats.headings = this.countElements(content, 'h1, h2, h3, h4, h5, h6');
        
        // حساب التنبيهات
        this.stats.alerts = this.countElements(content, '.syty-alert-info, .syty-alert-warning, .syty-alert-success, .syty-alert-danger');
        
        // حساب الفواصل
        this.stats.dividers = this.countElements(content, 'hr');
    }

    /**
     * حساب عدد الكلمات
     */
    countWords(text) {
        if (!text || !text.trim()) return 0;
        
        // تنظيف النص وتقسيمه إلى كلمات
        const words = text.trim()
            .replace(/\s+/g, ' ') // استبدال المسافات المتعددة بمسافة واحدة
            .split(' ')
            .filter(word => word.length > 0);
        
        return words.length;
    }

    /**
     * حساب عدد العناصر
     */
    countElements(container, selector) {
        try {
            return container.querySelectorAll(selector).length;
        } catch (error) {
            SytyCore.Debug.error(`خطأ في حساب العناصر: ${selector}`, error);
            return 0;
        }
    }

    /**
     * تحديث العرض
     */
    updateDisplay() {
        // تحديث الإحصائيات الأساسية فقط
        ['words', 'characters', 'paragraphs'].forEach(key => {
            const element = this.statsBar.querySelector(`[data-stat="${key}"]`);
            if (element) {
                element.textContent = this.formatNumber(this.stats[key]);
            }
        });
    }

    /**
     * تنسيق الأرقام
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'م';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'ك';
        }
        return num.toString();
    }

    /**
     * الحصول على الإحصائيات
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * إعادة تعيين الإحصائيات
     */
    reset() {
        Object.keys(this.stats).forEach(key => {
            this.stats[key] = 0;
        });
        this.updateDisplay();
    }


}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyStatsBar = SytyStatsBar;
} 