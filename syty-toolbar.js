/**
 * SymmaType Toolbar
 * شريط أدوات محرر النصوص - تصميم مبسط
 */

class SytyToolbar {
    constructor(editor) {
        this.editor = editor;
        this.toolbar = null;
        this.buttons = new Map();
        this.selects = new Map();
        this.savedSelection = null; // لحفظ التحديد عند فتح القوائم
    }

    /**
     * إنشاء شريط الأدوات
     */
    create() {
        this.toolbar = SytyCore.DOM.createElement('div', 'syty-toolbar');
        
        // إنشاء الصف الأول - الأزرار الأساسية
        const row1 = this.createRow1();
        this.toolbar.appendChild(row1);
        
        // إنشاء الصف الثاني - القوائم المنسدلة
        const row2 = this.createRow2();
        this.toolbar.appendChild(row2);
        
        return this.toolbar;
    }

    /**
     * إنشاء الصف الأول - أزرار التنسيق
     */
    createRow1() {
        const row = SytyCore.DOM.createElement('div', 'syty-toolbar-row syty-toolbar-row-1');
        
        // زر وضع الشاشة الكاملة
        const fullscreenBtn = SytyCore.DOM.createElement('button', 'syty-toolbar-fullscreen-btn', {
            type: 'button',
            title: 'وضع التحرير الموسع',
            innerHTML: '<span class="material-icons">fullscreen</span>'
        });
        fullscreenBtn.addEventListener('click', function() {
            const container = document.querySelector('.syty-container');
            if (container.classList.contains('syty-fullscreen')) {
                container.classList.remove('syty-fullscreen');
                fullscreenBtn.innerHTML = '<span class="material-icons">fullscreen</span>';
                fullscreenBtn.title = 'وضع التحرير الموسع';
            } else {
                container.classList.add('syty-fullscreen');
                fullscreenBtn.innerHTML = '<span class="material-icons">fullscreen_exit</span>';
                fullscreenBtn.title = 'الخروج من وضع التحرير الموسع';
            }
        });
        row.appendChild(fullscreenBtn);
        
        // تجميع الأزرار حسب النوع
        const groups = this.groupButtons();
        
        Object.keys(groups).forEach((groupName, index) => {
            if (index > 0) {
                // إضافة فاصل بين المجموعات
                const separator = SytyCore.DOM.createElement('div', 'syty-separator');
                row.appendChild(separator);
            }
            
            // إنشاء مجموعة الأزرار
            const group = SytyCore.DOM.createElement('div', 'syty-group');
            groups[groupName].forEach(buttonConfig => {
                const button = this.createButton(buttonConfig);
                group.appendChild(button);
            });
            row.appendChild(group);
        });
        
        return row;
    }

    /**
     * إنشاء الصف الثاني - القوائم المنسدلة
     */
    createRow2() {
        const row = SytyCore.DOM.createElement('div', 'syty-toolbar-row syty-toolbar-row-2');
        
        // قائمة أنماط الكتل
        const styleSelect = this.createStyleSelect();
        row.appendChild(styleSelect);
        
        // قائمة الخطوط
        const fontSelect = this.createFontSelect();
        row.appendChild(fontSelect);
        
        // قائمة أحجام الخطوط
        const sizeSelect = this.createSizeSelect();
        row.appendChild(sizeSelect);
        
        // قائمة المسافة بين الأسطر
        const lineHeightSelect = this.createLineHeightSelect();
        row.appendChild(lineHeightSelect);
        
        return row;
    }

    /**
     * تجميع الأزرار حسب النوع
     */
    groupButtons() {
        const groups = {};
        
        SYTY_CONFIG.TOOLBAR_BUTTONS.forEach(button => {
            if (button.type === 'separator') return;
            
            const groupName = button.group || 'default';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(button);
        });
        
        return groups;
    }

    /**
     * إنشاء زر
     */
    createButton(config) {
        const button = SytyCore.DOM.createElement('button', 'syty-btn', {
            type: 'button',
            title: config.label,
            'data-command': config.command
        });
        
        // إضافة الأيقونة
        const icon = SytyCore.DOM.createElement('span', 'material-icons', {
            textContent: config.icon
        });
        button.appendChild(icon);
        
        // إضافة مستمع الأحداث
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleButtonClick(config.command, button);
        });
        
        // حفظ مرجع الزر
        this.buttons.set(config.command, button);
        
        return button;
    }

    /**
     * إنشاء قائمة أنماط الكتل (Popup Select) كأيقونة
     */
    createStyleSelect() {
        const self = this;
        // زر الأيقونة
        const iconBtn = SytyCore.DOM.createElement('button', 'syty-popup-select-icon-btn', {
            type: 'button',
            title: 'أنماط الكتل',
            innerHTML: '<span class="material-icons">format_shapes</span>'
        });
        // الحاوية
        const container = SytyCore.DOM.createElement('div', 'syty-popup-select syty-popup-icon syty-style-popup', {tabIndex: 0});
        const dropdown = SytyCore.DOM.createElement('div', 'syty-popup-select__dropdown');
        // تجميع الأنماط حسب الفئة
        const categories = {};
        SYTY_CONFIG.BLOCK_STYLES.forEach(style => {
            const category = style.category || 'other';
            if (!categories[category]) categories[category] = [];
            categories[category].push(style);
        });
        Object.keys(categories).forEach(categoryKey => {
            const categoryName = SYTY_CONFIG.STYLE_CATEGORIES[categoryKey] || categoryKey;
            const groupLabel = SytyCore.DOM.createElement('div', '', {
                textContent: categoryName,
                style: 'font-weight:bold;padding:4px 16px 2px 0;color:#374151;'
            });
            dropdown.appendChild(groupLabel);
            categories[categoryKey].forEach(style => {
                const option = SytyCore.DOM.createElement('div', 'syty-popup-select__option', {
                    textContent: style.name,
                    'data-value': style.value,
                    'data-tag': style.tag,
                    'data-class': style.className || '',
                    'data-category': style.category
                });
                option.addEventListener('click', function(e) {
                    if (self.savedSelection) {
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(self.savedSelection);
                    }
                    dropdown.querySelectorAll('.syty-popup-select__option').forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    container.classList.remove('open');
                    self.handleStyleChangePopup(option);
                });
                dropdown.appendChild(option);
            });
        });
        container.appendChild(iconBtn);
        container.appendChild(dropdown);
        iconBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            self.savedSelection = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0).cloneRange() : null;
        });
        iconBtn.addEventListener('click', function(e) {
            container.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) container.classList.remove('open');
        });
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                container.classList.toggle('open');
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                container.classList.remove('open');
            }
        });
        this.selects.set('style', container);
        return container;
    }

    /**
     * معالجة تغيير النمط (Popup Select)
     */
    handleStyleChangePopup(option) {
        if (!option.dataset.value) return;
        const styleInfo = {
            tag: option.dataset.tag,
            className: option.dataset.class,
            category: option.dataset.category,
            name: option.textContent
        };
        SytyCore.Debug.log(`تطبيق النمط: ${styleInfo.name}`);
        if (this.editor.styleManager) {
            this.editor.styleManager.applyBlockStyle(styleInfo);
            SytyCore.Messages.success(`تم تطبيق ${styleInfo.name}`);
            if (this.editor.historyManager) {
                this.editor.historyManager.takeSnapshot(`style:${styleInfo.name}`);
            }
        }
    }

    /**
     * إنشاء قائمة الخطوط (Popup Select) كأيقونة
     */
    createFontSelect() {
        const self = this;
        const iconBtn = SytyCore.DOM.createElement('button', 'syty-popup-select-icon-btn', {
            type: 'button',
            title: 'نوع الخط',
            innerHTML: '<span class="material-icons">font_download</span>'
        });
        const container = SytyCore.DOM.createElement('div', 'syty-popup-select syty-popup-icon syty-font-popup', {tabIndex: 0});
        const dropdown = SytyCore.DOM.createElement('div', 'syty-popup-select__dropdown');
        SYTY_CONFIG.FONT_FAMILIES.forEach(font => {
            const option = SytyCore.DOM.createElement('div', 'syty-popup-select__option', {
                textContent: font.name,
                'data-value': font.value,
                'data-css': font.css
            });
            option.addEventListener('click', function(e) {
                if (self.savedSelection) {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(self.savedSelection);
                }
                dropdown.querySelectorAll('.syty-popup-select__option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                container.classList.remove('open');
                self.handleFontChangePopup(option);
            });
            dropdown.appendChild(option);
        });
        container.appendChild(iconBtn);
        container.appendChild(dropdown);
        iconBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            self.savedSelection = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0).cloneRange() : null;
        });
        iconBtn.addEventListener('click', function(e) {
            container.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) container.classList.remove('open');
        });
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                container.classList.toggle('open');
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                container.classList.remove('open');
            }
        });
        this.selects.set('font', container);
        return container;
    }

    /**
     * معالجة تغيير الخط (Popup Select)
     */
    handleFontChangePopup(option) {
        const fontFamily = option.dataset.css;
        document.execCommand('fontName', false, fontFamily);
        SytyCore.Messages.success('تم تغيير الخط');
        if (this.editor.historyManager) {
            this.editor.historyManager.takeSnapshot(`font:${option.textContent}`);
        }
    }

    /**
     * إنشاء قائمة أحجام الخطوط (Popup Select) كأيقونة
     */
    createSizeSelect() {
        const self = this;
        const iconBtn = SytyCore.DOM.createElement('button', 'syty-popup-select-icon-btn', {
            type: 'button',
            title: 'حجم الخط',
            innerHTML: '<span class="material-icons">format_size</span>'
        });
        const container = SytyCore.DOM.createElement('div', 'syty-popup-select syty-popup-icon syty-size-popup', {tabIndex: 0});
        const dropdown = SytyCore.DOM.createElement('div', 'syty-popup-select__dropdown');
        SYTY_CONFIG.FONT_SIZES.forEach(size => {
            const option = SytyCore.DOM.createElement('div', 'syty-popup-select__option', {
                textContent: size.name,
                'data-value': size.value
            });
            option.addEventListener('click', function(e) {
                if (self.savedSelection) {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(self.savedSelection);
                }
                dropdown.querySelectorAll('.syty-popup-select__option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                container.classList.remove('open');
                self.handleSizeChangePopup(option);
            });
            dropdown.appendChild(option);
        });
        container.appendChild(iconBtn);
        container.appendChild(dropdown);
        iconBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            self.savedSelection = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0).cloneRange() : null;
        });
        iconBtn.addEventListener('click', function(e) {
            container.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) container.classList.remove('open');
        });
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                container.classList.toggle('open');
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                container.classList.remove('open');
            }
        });
        this.selects.set('size', container);
        return container;
    }

    /**
     * معالجة تغيير الحجم (Popup Select)
     */
    handleSizeChangePopup(option) {
        const fontSize = option.dataset.value;
        const selection = SytyCore.Selection.getCurrent();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                const span = SytyCore.DOM.createElement('span');
                span.style.fontSize = fontSize;
                try {
                    const contents = range.extractContents();
                    span.appendChild(contents);
                    range.insertNode(span);
                    SytyCore.Selection.selectElement(span);
                    SytyCore.Messages.success('تم تغيير حجم الخط');
                    if (this.editor.historyManager) {
                        this.editor.historyManager.takeSnapshot(`size:${fontSize}`);
                    }
                } catch (e) {
                    SytyCore.Debug.error('خطأ في تغيير حجم الخط', e);
                    document.execCommand('fontSize', false, '7');
                    const fontElements = document.querySelectorAll('font[size="7"]');
                    fontElements.forEach(font => {
                        font.style.fontSize = fontSize;
                        font.removeAttribute('size');
                    });
                    if (this.editor.historyManager) {
                        this.editor.historyManager.takeSnapshot(`size:${fontSize}`);
                    }
                }
            } else {
                const currentElement = SytyCore.DOM.findBlockElement(range.startContainer, this.editor.element);
                if (currentElement) {
                    currentElement.style.fontSize = fontSize;
                    SytyCore.Messages.success('تم تغيير حجم الخط');
                }
            }
        }
    }

    /**
     * إنشاء قائمة المسافة بين الأسطر (Popup Select) كأيقونة
     */
    createLineHeightSelect() {
        const self = this;
        const iconBtn = SytyCore.DOM.createElement('button', 'syty-popup-select-icon-btn', {
            type: 'button',
            title: 'المسافة بين الأسطر',
            innerHTML: '<span class="material-icons">format_line_spacing</span>'
        });
        const container = SytyCore.DOM.createElement('div', 'syty-popup-select syty-popup-icon syty-lineheight-popup', {tabIndex: 0});
        const dropdown = SytyCore.DOM.createElement('div', 'syty-popup-select__dropdown');
        SYTY_CONFIG.LINE_HEIGHTS.forEach(lh => {
            const option = SytyCore.DOM.createElement('div', 'syty-popup-select__option', {
                textContent: lh.name,
                'data-value': lh.value
            });
            option.addEventListener('click', function(e) {
                if (self.savedSelection) {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(self.savedSelection);
                }
                dropdown.querySelectorAll('.syty-popup-select__option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                container.classList.remove('open');
                self.handleLineHeightChangePopup(option);
            });
            dropdown.appendChild(option);
        });
        container.appendChild(iconBtn);
        container.appendChild(dropdown);
        iconBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            self.savedSelection = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0).cloneRange() : null;
        });
        iconBtn.addEventListener('click', function(e) {
            container.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) container.classList.remove('open');
        });
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                container.classList.toggle('open');
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                container.classList.remove('open');
            }
        });
        this.selects.set('lineHeight', container);
        return container;
    }

    /**
     * معالجة تغيير المسافة بين الأسطر (Popup Select)
     */
    handleLineHeightChangePopup(option) {
        const lineHeight = option.dataset.value;
        const selection = SytyCore.Selection.getCurrent();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                const span = SytyCore.DOM.createElement('span');
                span.style.lineHeight = lineHeight;
                try {
                    const contents = range.extractContents();
                    span.appendChild(contents);
                    range.insertNode(span);
                    SytyCore.Selection.selectElement(span);
                    SytyCore.Messages.success('تم تغيير المسافة بين الأسطر');
                    if (this.editor.historyManager) {
                        this.editor.historyManager.takeSnapshot(`lineHeight:${lineHeight}`);
                    }
                } catch (e) {
                    SytyCore.Debug.error('خطأ في تغيير المسافة بين الأسطر', e);
                }
            } else {
                const currentElement = SytyCore.DOM.findBlockElement(range.startContainer, this.editor.element);
                if (currentElement) {
                    currentElement.style.lineHeight = lineHeight;
                    SytyCore.Messages.success('تم تغيير المسافة بين الأسطر');
                }
            }
        }
    }

    /**
     * معالجة مسح كل التنسيق - مع تأكيد
     */
    handleClearAll() {
        if (confirm('هل تريد مسح جميع التنسيقات من المحرر؟')) {
            this.removeAllFormattingFromEditor();
            SytyCore.Messages.success('تم مسح جميع التنسيقات');
            
            // تحديث الإحصائيات
            if (this.editor.statsBar) {
                this.editor.statsBar.update();
            }
        }
    }

    /**
     * معالجة عرض المعاينة
     */
    handleShowPreview() {
        if (window.SytyPreview) {
            window.SytyPreview.show(this.editor.getContent());
        } else {
            // إنشاء نافذة معاينة بسيطة
            this.createPreviewModal();
        }
    }

    /**
     * معالجة عرض HTML مع إمكانية التعديل والحفظ
     */
    handleShowHTML() {
        this.createHTMLModal();
    }

    /**
     * تحديث حالة شريط الأدوات
     */
    updateState() {
        // تحديث حالة الأزرار (فعال/غير فعال)
        this.buttons.forEach((button, command) => {
            const isActive = document.queryCommandState(command);
            button.classList.toggle('syty-btn-state-active', isActive);
        });
        
        // تحديث قائمة الأنماط
        this.updateStyleSelect();
    }

    /**
     * تحديث قائمة الأنماط
     */
    updateStyleSelect() {
        const styleSelect = this.selects.get('style');
        if (!styleSelect) return;
        
        // الحصول على العنصر الحالي
        const range = SytyCore.Selection.getCurrentRange();
        if (!range) return;
        
        const currentElement = SytyCore.DOM.findBlockElement(range.startContainer, this.editor.element);
        if (!currentElement) return;
        
        // البحث عن النمط المطابق
        const currentTag = currentElement.tagName;
        const currentClass = SytyCore.Styles.getSytyClasses(currentElement)[0] || '';
        
        // تحديد الخيار المناسب
        Array.from(styleSelect.querySelectorAll('.syty-popup-select__option')).forEach(option => {
            const matches = option.dataset.tag === currentTag && 
                          (option.dataset.class === currentClass || 
                           (!option.dataset.class && !currentClass));
            
            if (matches) {
                styleSelect.value = option.dataset.value;
            }
        });
    }

    /**
     * تفعيل شريط الأدوات
     */
    enable() {
        if (this.toolbar) {
            this.toolbar.classList.remove('syty-toolbar-disabled');
        }
    }

    /**
     * تعطيل شريط الأدوات
     */
    disable() {
        if (this.toolbar) {
            this.toolbar.classList.add('syty-toolbar-disabled');
        }
    }

    /**
     * إنشاء نافذة المعاينة - تعرض المحتوى بنفس تنسيقه الأصلي (مع الكلاسات)
     */
    createPreviewModal() {
        // إزالة النافذة السابقة إن وجدت
        const existingModal = document.querySelector('.syty-modal.syty-preview-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // إنشاء النافذة (مودال احترافي)
        const modal = SytyCore.DOM.createElement('div', 'syty-modal syty-preview-modal');
        const content = SytyCore.DOM.createElement('div', 'syty-modal-content');

        // رأس النافذة
        const header = SytyCore.DOM.createElement('div', 'syty-modal-header');
        const title = SytyCore.DOM.createElement('h3', 'syty-modal-title', { textContent: 'معاينة المحتوى' });
        const closeBtn = SytyCore.DOM.createElement('button', 'syty-modal-close', {
            innerHTML: '<span class="material-icons">close</span>',
            title: 'إغلاق'
        });
        header.appendChild(title);
        header.appendChild(closeBtn);

        // جسم النافذة: نسخة طبق الأصل من محتوى المحرر مع الكلاسات
        const body = SytyCore.DOM.createElement('div', 'syty-modal-body');
        // جلب محتوى المحرر مع الكلاسات
        const previewDiv = document.createElement('div');
        previewDiv.className = 'syty-editor syty-preview-body';
        previewDiv.innerHTML = this.editor.getContent();
        body.appendChild(previewDiv);

        // تجميع النافذة
        content.appendChild(header);
        content.appendChild(body);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // إظهار النافذة
        setTimeout(() => modal.classList.add('show'), 10);

        // زر الإغلاق
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        };
        closeBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    /**
     * إنشاء نافذة عرض HTML مع إمكانية التعديل والحفظ
     */
    createHTMLModal() {
        // إزالة النافذة السابقة إن وجدت
        const existingModal = document.querySelector('.syty-html-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // إنشاء النافذة
        const modal = SytyCore.DOM.createElement('div', 'syty-modal syty-html-modal syty-preview-modal');
        const content = SytyCore.DOM.createElement('div', 'syty-modal-content');
        
        // رأس النافذة
        const header = SytyCore.DOM.createElement('div', 'syty-modal-header');
        const title = SytyCore.DOM.createElement('h3', 'syty-modal-title', { textContent: 'كود HTML (قابل للتعديل)' });
        const closeBtn = SytyCore.DOM.createElement('button', 'syty-modal-close', {
            innerHTML: '<span class="material-icons">close</span>',
            title: 'إغلاق'
        });
        const saveBtn = SytyCore.DOM.createElement('button', 'syty-html-save syty-btn', {
            innerHTML: '<span class="material-icons">save</span>',
            title: 'حفظ التعديلات',
            style: 'margin-left:8px;background:#3b82f6;color:#fff;border-radius:6px;padding:4px 12px;display:flex;align-items:center;gap:4px;'
        });
        header.appendChild(title);
        header.appendChild(saveBtn);
        header.appendChild(closeBtn);
        
        // جسم النافذة
        const body = SytyCore.DOM.createElement('div', 'syty-modal-body');
        const textarea = SytyCore.DOM.createElement('textarea', 'syty-html-code-edit', {
            style: 'width:100%;height:350px;direction:ltr;font-family:monospace;font-size:15px;padding:12px;border-radius:8px;border:1.5px solid #d1d5db;resize:vertical;box-sizing:border-box;'
        });
        textarea.value = this.editor.getContent();
        body.appendChild(textarea);
        
        // تجميع النافذة
        content.appendChild(header);
        content.appendChild(body);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // إظهار النافذة
        setTimeout(() => modal.classList.add('show'), 10);
        
        // زر الإغلاق
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        };
        closeBtn.addEventListener('click', closeModal);
        // لا تغلق عند الضغط على الخلفية
        // إغلاق بمفتاح Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        // حدث الحفظ
        saveBtn.addEventListener('click', () => {
            const newHTML = textarea.value;
            this.editor.element.innerHTML = newHTML;
            SytyCore.Messages.success('تم تحديث محتوى المحرر من كود HTML');
            closeModal();
        });
    }

    /**
     * معالجة لون النص
     */
    handleTextColor(button) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً لتغيير لونه');
            return;
        }
        if (this.editor.advanced) {
            this.editor.advanced.showColorPicker('text', button);
        } else {
            SytyCore.Messages.warning('الوظائف المتقدمة غير متاحة');
        }
    }

    /**
     * معالجة لون الخلفية
     */
    handleBackgroundColor(button) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) {
            SytyCore.Messages.warning('يرجى تحديد النص أولاً لتغيير لون خلفيته');
            return;
        }
        if (this.editor.advanced) {
            this.editor.advanced.showColorPicker('background', button);
        } else {
            SytyCore.Messages.warning('الوظائف المتقدمة غير متاحة');
        }
    }

    /**
     * معالجة إدراج جدول
     */
    handleInsertTable() {
        if (this.editor.advanced) {
            this.editor.advanced.showTableModal();
        } else {
            SytyCore.Messages.warning('الوظائف المتقدمة غير متاحة');
        }
    }

    /**
     * معالجة إدراج صورة
     */
    handleInsertImage() {
        const input = SytyCore.DOM.createElement('input', '', {
            type: 'file',
            accept: 'image/*',
            style: 'display: none'
        });
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!SYTY_CONFIG.IMAGE_SETTINGS.allowedTypes.includes(file.type)) {
                SytyCore.Messages.error('نوع الملف غير مدعوم');
                return;
            }
            if (file.size > SYTY_CONFIG.IMAGE_SETTINGS.maxFileSize) {
                SytyCore.Messages.error('حجم الملف كبير جداً');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = SytyCore.DOM.createElement('img', '', {
                    src: e.target.result,
                    alt: file.name,
                    style: 'max-width: 100%; height: auto;'
                });
                try {
                    document.execCommand('insertHTML', false, img.outerHTML);
                    SytyCore.Messages.success('تم إدراج الصورة');
                    if (this.editor.historyManager) {
                        this.editor.historyManager.takeSnapshot('insertImage');
                    }
                } catch (error) {
                    SytyCore.Debug.error('خطأ في إدراج الصورة', error);
                    SytyCore.Messages.error('فشل في إدراج الصورة');
                }
            };
            reader.readAsDataURL(file);
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    /**
     * معالجة البحث والاستبدال
     */
    handleFindReplace() {
        if (this.editor.advanced) {
            this.editor.advanced.showSearchModal();
        } else {
            SytyCore.Messages.warning('الوظائف المتقدمة غير متاحة');
        }
    }

    /**
     * معالجة التدقيق الإملائي
     */
    handleSpellCheck() {
        if (this.editor.advanced && typeof this.editor.advanced.spellCheck === 'function') {
            this.editor.advanced.spellCheck();
        } else {
            SytyCore.Messages.info('ميزة التدقيق الإملائي غير متوفرة حالياً.');
        }
    }

    /**
     * معالجة نقر الأزرار في شريط الأدوات
     */
    handleButtonClick(command, button) {
        SytyCore.Debug.log(`تنفيذ الأمر: ${command}`);
        // إضافة تأثير بصري
        button.classList.add('syty-btn-active');
        setTimeout(() => button.classList.remove('syty-btn-active'), 150);
        switch (command) {
            case 'bold':
            case 'italic':
            case 'underline':
                document.execCommand(command);
                if (this.editor.historyManager) {
                    this.editor.historyManager.takeSnapshot(`format:${command}`);
                }
                break;
            case 'insertUnorderedList':
            case 'insertOrderedList':
                document.execCommand(command);
                if (this.editor.historyManager) {
                    this.editor.historyManager.takeSnapshot(`list:${command}`);
                }
                break;
            case 'justifyLeft':
            case 'justifyCenter':
            case 'justifyRight':
            case 'justifyFull':
                document.execCommand(command);
                break;
            case 'indent':
                document.execCommand('indent');
                break;
            case 'outdent':
                document.execCommand('outdent');
                break;
            case 'insertHR':
                this.insertSimpleHR();
                break;
            case 'createLink':
                this.handleCreateLink();
                break;
            case 'unlink':
                this.handleUnlink();
                break;
            case 'undo':
                this.handleUndo();
                break;
            case 'redo':
                this.handleRedo();
                break;
            case 'removeFormat':
                this.handleRemoveFormat();
                if (this.editor.historyManager) {
                    this.editor.historyManager.takeSnapshot('format:remove');
                }
                break;
            case 'clearAll':
                this.handleClearAll();
                break;
            case 'showPreview':
                this.handleShowPreview();
                break;
            case 'showHTML':
                this.handleShowHTML();
                break;
            case 'textColor':
                this.handleTextColor(button);
                break;
            case 'backgroundColor':
                this.handleBackgroundColor(button);
                break;
            case 'insertTable':
                this.handleInsertTable();
                break;
            case 'insertImage':
                this.handleInsertImage();
                break;
            case 'findReplace':
                this.handleFindReplace();
                break;
            case 'spellCheck':
                this.handleSpellCheck();
                break;
            default:
                SytyCore.Debug.warn(`أمر غير معروف: ${command}`);
        }
        // تحديث حالة شريط الأدوات
        this.updateState();
    }

    /**
     * إنشاء رابط
     */
    handleCreateLink() {
        const url = prompt('أدخل الرابط:');
        if (url && SytyCore.Validation.isValidUrl(url)) {
            document.execCommand('createLink', false, url);
            SytyCore.Messages.success('تم إضافة الرابط');
        } else if (url) {
            SytyCore.Messages.error('الرابط غير صحيح');
        }
    }

    /**
     * إزالة الرابط
     */
    handleUnlink() {
        document.execCommand('unlink');
        SytyCore.Messages.success('تم إزالة الرابط');
    }

    /**
     * التراجع
     */
    handleUndo() {
        try {
            this.editor.element.focus();
            if (this.editor.historyManager && this.editor.historyManager.canUndo()) {
                const success = this.editor.historyManager.undo();
                if (success) {
                    setTimeout(() => { this.updateState(); }, 50);
                    return;
                }
            }
            let result = false;
            try {
                result = document.execCommand('undo', false, null);
            } catch (e) {
                SytyCore.Debug.warn('فشل execCommand undo', e);
            }
            if (result) {
                SytyCore.Messages.success('تم التراجع (طريقة احتياطية)');
                if (this.editor.statsBar) { this.editor.statsBar.update(); }
                setTimeout(() => { this.updateState(); }, 10);
            } else {
                SytyCore.Messages.warning('لا يوجد شيء للتراجع عنه');
            }
        } catch (error) {
            SytyCore.Debug.error('خطأ في التراجع', error);
            SytyCore.Messages.error('فشل في التراجع');
        }
    }

    /**
     * الإعادة
     */
    handleRedo() {
        try {
            this.editor.element.focus();
            if (this.editor.historyManager && this.editor.historyManager.canRedo()) {
                const success = this.editor.historyManager.redo();
                if (success) {
                    setTimeout(() => { this.updateState(); }, 50);
                    return;
                }
            }
            let result = false;
            try {
                result = document.execCommand('redo', false, null);
            } catch (e) {
                SytyCore.Debug.warn('فشل execCommand redo', e);
            }
            if (result) {
                SytyCore.Messages.success('تم الإعادة (طريقة احتياطية)');
                if (this.editor.statsBar) { this.editor.statsBar.update(); }
                setTimeout(() => { this.updateState(); }, 10);
            } else {
                SytyCore.Messages.warning('لا يوجد شيء للإعادة');
            }
        } catch (error) {
            SytyCore.Debug.error('خطأ في الإعادة', error);
            SytyCore.Messages.error('فشل في الإعادة');
        }
    }

    /**
     * إزالة التنسيق
     */
    handleRemoveFormat() {
        try {
            this.editor.element.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
                document.execCommand('removeFormat');
                SytyCore.Messages.success('تم مسح تنسيق النص المحدد');
            } else {
                const html = this.editor.element.innerHTML;
                this.editor.element.innerHTML = html.replace(/<[^>]+>/g, '');
                SytyCore.Messages.success('تم مسح جميع التنسيقات');
            }
        } catch (error) {
            SytyCore.Debug.error('خطأ في إزالة التنسيق', error);
            SytyCore.Messages.error('فشل في إزالة التنسيق');
        }
    }

    /**
     * إزالة جميع التنسيقات من المحرر بالكامل
     */
    removeAllFormattingFromEditor() {
        try {
            this.editor.element.focus();
            // إزالة جميع العناصر المنسقة مع الحفاظ على النص فقط
            const plainText = this.editor.element.textContent || '';
            this.editor.element.innerHTML = '';
            this.editor.element.textContent = plainText;
            SytyCore.Messages.success('تم مسح جميع التنسيقات من المحرر');
        } catch (error) {
            SytyCore.Debug.error('خطأ في مسح جميع التنسيقات', error);
            SytyCore.Messages.error('فشل في مسح جميع التنسيقات');
        }
    }

    /**
     * إدراج الفاصل البسيط (HR) في مكان المؤشر
     */
    insertSimpleHR() {
        try {
            this.editor.element.focus();
            const selection = window.getSelection();
            if (!selection.rangeCount) {
                // إذا لا يوجد تحديد، ضع المؤشر في نهاية المحرر
                const range = document.createRange();
                range.selectNodeContents(this.editor.element);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            const range = selection.getRangeAt(0);
            // حاول الإدراج باستخدام execCommand أولاً
            const success = document.execCommand('insertHTML', false, '<hr>');
            if (!success) {
                // طريقة fallback يدوية
                const hr = document.createElement('hr');
                range.deleteContents();
                range.insertNode(hr);
                // ضع المؤشر بعد الفاصل
                range.setStartAfter(hr);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            SytyCore.Messages.success('تم إدراج الفاصل');
            if (this.editor.historyManager) {
                this.editor.historyManager.takeSnapshot('divider:simple');
            }
        } catch (error) {
            SytyCore.Debug.error('خطأ في إدراج الفاصل', error);
            SytyCore.Messages.error('فشل في إدراج الفاصل');
        }
    }

}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyToolbar = SytyToolbar;
}

// ================================
// Popup Select Vanilla JS - موحد الأسماء (Atlassian Style)
// ================================
document.querySelectorAll('.syty-popup-select').forEach(function(select) {
  const selected = select.querySelector('.syty-popup-select__selected');
  const dropdown = select.querySelector('.syty-popup-select__dropdown');
  const options = select.querySelectorAll('.syty-popup-select__option');

  selected.addEventListener('click', function(e) {
    select.classList.toggle('open');
  });

  options.forEach(function(option) {
    option.addEventListener('click', function(e) {
      selected.textContent = option.textContent;
      selected.dataset.value = option.dataset.value;
      options.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      select.classList.remove('open');
      // هنا يمكنك ربط القيمة المختارة بوظيفة المحرر
      // مثال: changeFontSize(option.dataset.value);
    });
  });

  document.addEventListener('click', function(e) {
    if (!select.contains(e.target)) {
      select.classList.remove('open');
    }
  });

  select.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      select.classList.toggle('open');
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      select.classList.remove('open');
    }
  });
}); 