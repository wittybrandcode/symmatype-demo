/**
 * SymmaType Style Manager
 * إدارة الأنماط - التركيز على استبدال الأنماط القديمة
 */

class SytyStyleManager {
    constructor(editor) {
        this.editor = editor;
    }

    /**
     * تطبيق نمط كتلة مع التركيز على النص المحدد فقط
     */
    applyBlockStyle(styleInfo) {
        SytyCore.Debug.log(`🎯 تطبيق نمط: ${styleInfo.name}`);
        
        try {
            const range = SytyCore.Selection.getCurrentRange();
            if (!range) {
                SytyCore.Debug.warn('لا يوجد تحديد - إنشاء عنصر جديد');
                this.createNewStyledElement(styleInfo);
                return;
            }

            const selectedText = SytyCore.Selection.getSelectedText();
            
            if (selectedText && selectedText.trim()) {
                // تطبيق النمط على النص المحدد فقط
                this.applyStyleToSelectedText(range, styleInfo, selectedText);
            } else {
                // تطبيق النمط على العنصر الحالي
                this.applyStyleToCurrentElement(range, styleInfo);
            }
            
            SytyCore.Debug.log(`✅ تم تطبيق النمط بنجاح`);
            
        } catch (error) {
            SytyCore.Debug.error('❌ خطأ في تطبيق النمط', error);
            this.createNewStyledElement(styleInfo);
        }
    }

    /**
     * تطبيق النمط على النص المحدد فقط
     */
    applyStyleToSelectedText(range, styleInfo, selectedText) {
        try {
            // حذف النص المحدد
            range.deleteContents();
            
            // إنشاء عنصر جديد بالنمط المطلوب
            const newElement = this.createStyledElement(styleInfo, selectedText);
            
            // إدراج العنصر الجديد
            range.insertNode(newElement);
            
            // تحديد العنصر الجديد
            setTimeout(() => {
                SytyCore.Selection.setCursorAtEnd(newElement);
                this.addVisualEffect(newElement);
            }, 10);
            
            SytyCore.Debug.log(`✅ تم تطبيق النمط على النص المحدد`);
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في تطبيق النمط على النص المحدد', error);
            throw error;
        }
    }

    /**
     * تطبيق النمط على العنصر الحالي
     */
    applyStyleToCurrentElement(range, styleInfo) {
        try {
            const targetElement = this.findTargetElementSafe(range);
            
            if (targetElement && targetElement !== this.editor.element) {
                const plainText = this.extractPlainTextSafe(targetElement);
                this.replaceElementSafe(targetElement, styleInfo, plainText);
            } else {
                // إنشاء عنصر جديد في الموضع الحالي
                const newElement = this.createStyledElement(styleInfo, 'نص جديد');
                range.insertNode(newElement);
                
                setTimeout(() => {
                    SytyCore.Selection.setCursorAtEnd(newElement);
                    this.addVisualEffect(newElement);
                }, 10);
            }
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في تطبيق النمط على العنصر الحالي', error);
            throw error;
        }
    }

    /**
     * البحث عن العنصر المستهدف للتعديل - نسخة آمنة
     */
    findTargetElementSafe(range) {
        try {
            // البحث عن عنصر كتلة يحتوي على التحديد
            let element = SytyCore.DOM.findBlockElement(range.commonAncestorContainer, this.editor.element);
            
            if (!element) {
                element = SytyCore.DOM.findBlockElement(range.startContainer, this.editor.element);
            }
            
            // التأكد من أن العنصر ليس المحرر نفسه وأنه صالح
            if (element === this.editor.element || !element || !element.parentNode) {
                return null;
            }
            
            return element;
        } catch (error) {
            SytyCore.Debug.error('خطأ في البحث عن العنصر المستهدف', error);
            return null;
        }
    }

    /**
     * استخراج النص العادي بطريقة آمنة
     */
    extractPlainTextSafe(element) {
        try {
            if (!element) return '';
            const text = SytyCore.DOM.getPlainText(element);
            return text || 'نص جديد';
        } catch (error) {
            SytyCore.Debug.error('خطأ في استخراج النص', error);
            return 'نص جديد';
        }
    }

    /**
     * استبدال العنصر بطريقة آمنة
     */
    replaceElementSafe(oldElement, styleInfo, plainText) {
        try {
            if (!oldElement || !oldElement.parentNode) {
                throw new Error('العنصر القديم غير صالح');
            }

            // إنشاء العنصر الجديد
            const newElement = this.createStyledElement(styleInfo, plainText);
            
            // استبدال العنصر
            oldElement.parentNode.replaceChild(newElement, oldElement);
            
            // وضع المؤشر في العنصر الجديد
            setTimeout(() => {
                SytyCore.Selection.setCursorAtEnd(newElement);
                this.addVisualEffect(newElement);
            }, 10);
            
            SytyCore.Debug.log(`🔄 تم استبدال العنصر بنجاح`);
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في استبدال العنصر', error);
            // إنشاء عنصر جديد كحل بديل
            this.createNewStyledElement(styleInfo);
        }
    }

    /**
     * إدراج عنصر جديد بطريقة آمنة
     */
    insertNewElementSafe(range, styleInfo, plainText) {
        try {
            // حذف المحتوى المحدد إن وجد
            if (!range.collapsed) {
                range.deleteContents();
            }
            
            // إنشاء العنصر الجديد
            const newElement = this.createStyledElement(styleInfo, plainText);
            
            // إدراج العنصر الجديد
            range.insertNode(newElement);
            
            // وضع المؤشر في العنصر الجديد
            setTimeout(() => {
                SytyCore.Selection.setCursorAtEnd(newElement);
                this.addVisualEffect(newElement);
            }, 10);
            
            SytyCore.Debug.log(`➕ تم إدراج عنصر جديد بنجاح`);
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في إدراج العنصر الجديد', error);
            // إنشاء عنصر جديد كحل بديل
            this.createNewStyledElement(styleInfo);
        }
    }

    /**
     * إنشاء عنصر منسق جديد كحل بديل
     */
    createNewStyledElement(styleInfo) {
        try {
            const newElement = this.createStyledElement(styleInfo, 'نص جديد');
            
            // إضافة العنصر في نهاية المحرر
            this.editor.element.appendChild(newElement);
            
            // وضع المؤشر في العنصر الجديد
            setTimeout(() => {
                SytyCore.Selection.setCursorAtEnd(newElement);
                this.addVisualEffect(newElement);
            }, 10);
            
            SytyCore.Debug.log(`🆕 تم إنشاء عنصر جديد كحل بديل`);
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في إنشاء العنصر البديل', error);
        }
    }

    /**
     * إنشاء عنصر منسق جديد
     */
    createStyledElement(styleInfo, text) {
        const element = SytyCore.DOM.createElement(styleInfo.tag);
        
        // إضافة الكلاس إذا وجد
        if (styleInfo.className) {
            element.className = styleInfo.className;
        }
        
        // إضافة النص أو br إذا كان فارغاً
        if (text && text.trim()) {
            element.textContent = text.trim();
        } else {
            element.innerHTML = '<br>';
        }
        
        // إضافة خصائص إضافية
        element.setAttribute('data-syty-style', styleInfo.name);
        element.classList.add('syty-styled');
        
        return element;
    }

    /**
     * استبدال عنصر بآخر
     */
    replaceElement(oldElement, newElement) {
        if (oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
        }
    }

    /**
     * إدراج عنصر جديد
     */
    insertNewElement(range, element) {
        // حذف المحتوى المحدد إن وجد
        if (!range.collapsed) {
            range.deleteContents();
        }
        
        // إدراج العنصر الجديد
        range.insertNode(element);
    }

    /**
     * إضافة تأثير بصري للعنصر الجديد
     */
    addVisualEffect(element) {
        element.classList.add('syty-just-applied');
        setTimeout(() => {
            element.classList.remove('syty-just-applied');
        }, 1000);
    }

    /**
     * إزالة جميع التنسيقات - محسن
     */
    removeAllFormatting() {
        SytyCore.Debug.log('🧹 إزالة جميع التنسيقات');
        
        try {
            // التأكد من التركيز على المحرر
            this.editor.element.focus();
            
            const range = SytyCore.Selection.getCurrentRange();
            if (!range) {
                SytyCore.Messages.warning('لا يوجد تحديد');
                return;
            }

            const selectedText = SytyCore.Selection.getSelectedText();
            
            if (selectedText && selectedText.trim()) {
                // إزالة تنسيق النص المحدد بطريقة محسنة
                this.removeSelectionFormattingAdvanced(range, selectedText);
            } else {
                // إزالة تنسيق العنصر الحالي بطريقة محسنة
                this.removeElementFormattingAdvanced(range);
            }
        } catch (error) {
            SytyCore.Debug.error('خطأ في إزالة التنسيق', error);
            // طريقة بديلة
            try {
                document.execCommand('removeFormat');
                SytyCore.Messages.success('تم إزالة التنسيق');
            } catch (e) {
                SytyCore.Messages.error('فشل في إزالة التنسيق');
            }
        }
    }

    /**
     * إزالة تنسيق النص المحدد - نسخة محسنة
     */
    removeSelectionFormattingAdvanced(range, selectedText) {
        try {
            // حذف المحتوى المحدد
            range.deleteContents();
            
            // إنشاء عقدة نص عادية
            const textNode = document.createTextNode(selectedText);
            range.insertNode(textNode);
            
            // إنشاء نطاق جديد لتحديد النص المدرج
            const newRange = document.createRange();
            newRange.selectNodeContents(textNode);
            
            // تطبيق التحديد الجديد
            const selection = SytyCore.Selection.getCurrent();
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            SytyCore.Debug.log('✅ تم إزالة تنسيق النص المحدد بطريقة محسنة');
            SytyCore.Messages.success('تم إزالة تنسيق النص المحدد');
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في إزالة تنسيق النص المحدد', error);
            // طريقة بديلة
            try {
                document.execCommand('removeFormat');
                SytyCore.Messages.success('تم إزالة التنسيق');
            } catch (e) {
                SytyCore.Messages.error('فشل في إزالة التنسيق');
            }
        }
    }

    /**
     * إزالة تنسيق العنصر الحالي - نسخة محسنة
     */
    removeElementFormattingAdvanced(range) {
        try {
            const element = this.findTargetElementSafe(range);
            if (!element || element === this.editor.element) {
                // إذا لم يوجد عنصر محدد، استخدم removeFormat العادي
                document.execCommand('removeFormat');
                SytyCore.Messages.success('تم إزالة التنسيق');
                return;
            }
            
            const plainText = this.extractPlainTextSafe(element);
            
            // إنشاء فقرة عادية جديدة
            const newP = SytyCore.DOM.createElement('p');
            
            if (plainText && plainText.trim()) {
                newP.textContent = plainText.trim();
            } else {
                newP.innerHTML = '<br>';
            }
            
            // استبدال العنصر بطريقة آمنة
            if (element.parentNode) {
                element.parentNode.replaceChild(newP, element);
                
                // وضع المؤشر في الفقرة الجديدة
                setTimeout(() => {
                    SytyCore.Selection.setCursorAtEnd(newP);
                }, 10);
                
                SytyCore.Debug.log('✅ تم إزالة تنسيق العنصر بطريقة محسنة');
                SytyCore.Messages.success('تم إزالة تنسيق العنصر');
            }
            
        } catch (error) {
            SytyCore.Debug.error('خطأ في إزالة تنسيق العنصر', error);
            // طريقة بديلة
            document.execCommand('removeFormat');
            SytyCore.Messages.success('تم إزالة التنسيق');
        }
    }

    /**
     * تنظيف شامل للمحرر
     */
    cleanupEditor() {
        SytyCore.Debug.log('🧽 تنظيف شامل للمحرر');
        
        // إزالة العناصر الفارغة
        this.removeEmptyElements();
        
        // دمج العقد النصية المتجاورة
        this.mergeAdjacentTextNodes();
        
        // تنظيف الكلاسات غير المستخدمة
        this.cleanupUnusedClasses();
    }

    /**
     * إزالة العناصر الفارغة
     */
    removeEmptyElements() {
        const emptyElements = this.editor.element.querySelectorAll('*:empty:not(br):not(img):not(hr)');
        emptyElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    /**
     * دمج العقد النصية المتجاورة
     */
    mergeAdjacentTextNodes() {
        const walker = document.createTreeWalker(
            this.editor.element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const nextSibling = textNode.nextSibling;
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                textNode.textContent += nextSibling.textContent;
                nextSibling.parentNode.removeChild(nextSibling);
            }
        });
    }

    /**
     * تنظيف الكلاسات غير المستخدمة
     */
    cleanupUnusedClasses() {
        const elements = this.editor.element.querySelectorAll('*[class]');
        elements.forEach(element => {
            // إزالة الكلاسات الفارغة
            if (!element.className.trim()) {
                element.removeAttribute('class');
            }
            
            // إزالة الكلاسات المكررة
            const classes = Array.from(element.classList);
            const uniqueClasses = [...new Set(classes)];
            if (classes.length !== uniqueClasses.length) {
                element.className = uniqueClasses.join(' ');
            }
        });
    }

    /**
     * الحصول على معلومات النمط الحالي
     */
    getCurrentStyleInfo() {
        const range = SytyCore.Selection.getCurrentRange();
        if (!range) return null;
        
        const element = this.findTargetElement(range);
        if (!element) return null;
        
        return {
            tag: element.tagName,
            className: SytyCore.Styles.getSytyClasses(element)[0] || '',
            text: SytyCore.DOM.getPlainText(element),
            element: element
        };
    }

    /**
     * التحقق من إمكانية تطبيق نمط
     */
    canApplyStyle(styleInfo) {
        const range = SytyCore.Selection.getCurrentRange();
        return range !== null;
    }

    /**
     * معاينة تطبيق النمط (بدون تطبيق فعلي)
     */
    previewStyle(styleInfo) {
        const currentInfo = this.getCurrentStyleInfo();
        if (!currentInfo) return null;
        
        return {
            from: `${currentInfo.tag}${currentInfo.className ? '.' + currentInfo.className : ''}`,
            to: `${styleInfo.tag}${styleInfo.className ? '.' + styleInfo.className : ''}`,
            text: currentInfo.text
        };
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyStyleManager = SytyStyleManager;
} 