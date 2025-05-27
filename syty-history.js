/**
 * SymmaType History Manager - النسخة المبسطة
 * مدير التاريخ البسيط للتراجع والإعادة
 */

class SytyHistoryManager {
    constructor(editor) {
        this.editor = editor;
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = 100; // تقليل العدد إلى 100 خطوة
        this.isRecording = true;
        this.lastSnapshot = '';
        this.debounceTimer = null;
        this.isUndoRedoOperation = false;
        
        this.init();
    }

    /**
     * تهيئة مدير التاريخ
     */
    init() {
        this.takeSnapshot('initial');
        this.bindEvents();
        SytyCore.Debug.log('🕒 تم تهيئة مدير التاريخ المبسط');
    }

    /**
     * ربط الأحداث الأساسية
     */
    bindEvents() {
        // تتبع تغييرات المحتوى
        this.editor.element.addEventListener('input', (e) => {
            this.handleInput(e);
        });

        // تتبع أحداث لوحة المفاتيح
        this.editor.element.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // تتبع أحداث اللصق
        this.editor.element.addEventListener('paste', () => {
            setTimeout(() => this.takeSnapshot('paste'), 50);
        });
    }

    /**
     * معالجة أحداث الإدخال
     */
    handleInput(e) {
        if (!this.isRecording || this.isUndoRedoOperation) return;

        // تأخير قصير لتجميع التغييرات السريعة
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.takeSnapshot('input');
        }, 300); // تأخير 300ms
    }

    /**
     * معالجة أحداث لوحة المفاتيح
     */
    handleKeyDown(e) {
        // معالجة اختصارات التراجع والإعادة
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'y')) {
            e.preventDefault();
            
            if (e.key === 'z' && !e.shiftKey) {
                this.undo();
            } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
                this.redo();
            }
            return;
        }

        // تسجيل فوري للمفاتيح المهمة
        const importantKeys = ['Enter', 'Backspace', 'Delete'];
        if (importantKeys.includes(e.key)) {
            // إلغاء التأخير وتسجيل فوري
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }
            
            setTimeout(() => this.takeSnapshot(`key:${e.key}`), 10);
        }
    }

    /**
     * أخذ لقطة من الحالة الحالية
     */
    takeSnapshot(action = 'unknown') {
        if (!this.isRecording || this.isUndoRedoOperation) return;

        const currentContent = this.editor.getContent();
        
        // تجاهل إذا لم يتغير المحتوى
        if (currentContent === this.lastSnapshot) {
            return;
        }

        // حفظ موضع المؤشر
        const selection = this.saveSelection();

        // إنشاء نقطة تاريخ
        const historyPoint = {
            content: currentContent,
            selection: selection,
            action: action,
            timestamp: Date.now()
        };

        // إزالة النقاط التالية إذا كنا في وسط التاريخ
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // إضافة النقطة الجديدة
        this.history.push(historyPoint);
        this.currentIndex = this.history.length - 1;

        // تحديد حجم التاريخ
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.currentIndex--;
        }

        this.lastSnapshot = currentContent;
        SytyCore.Debug.log(`📸 لقطة جديدة: ${action} (${this.currentIndex + 1}/${this.history.length})`);
    }

    /**
     * حفظ موضع التحديد
     */
    saveSelection() {
        try {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return null;

            const range = selection.getRangeAt(0);
            return {
                startOffset: this.getTextOffset(range.startContainer, range.startOffset),
                endOffset: this.getTextOffset(range.endContainer, range.endOffset),
                collapsed: range.collapsed
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * استعادة موضع التحديد
     */
    restoreSelection(selectionData) {
        if (!selectionData) return;

        try {
            const range = document.createRange();
            const selection = window.getSelection();

            const startPos = this.getPositionFromOffset(selectionData.startOffset);
            const endPos = this.getPositionFromOffset(selectionData.endOffset);

            if (startPos && endPos) {
                range.setStart(startPos.node, startPos.offset);
                range.setEnd(endPos.node, endPos.offset);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        } catch (error) {
            SytyCore.Debug.warn('خطأ في استعادة التحديد', error);
        }
    }

    /**
     * حساب الإزاحة النصية
     */
    getTextOffset(node, offset) {
        let totalOffset = 0;
        const walker = document.createTreeWalker(
            this.editor.element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            if (currentNode === node) {
                return totalOffset + offset;
            }
            totalOffset += currentNode.textContent.length;
        }

        return totalOffset;
    }

    /**
     * الحصول على الموضع من الإزاحة
     */
    getPositionFromOffset(targetOffset) {
        let currentOffset = 0;
        const walker = document.createTreeWalker(
            this.editor.element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            const nodeLength = currentNode.textContent.length;
            
            if (currentOffset + nodeLength >= targetOffset) {
                return {
                    node: currentNode,
                    offset: targetOffset - currentOffset
                };
            }
            
            currentOffset += nodeLength;
        }

        return null;
    }

    /**
     * التراجع
     */
    undo() {
        if (!this.canUndo()) {
            SytyCore.Messages.warning('لا يوجد شيء للتراجع عنه');
            return false;
        }

        this.isUndoRedoOperation = true;

        try {
            this.currentIndex--;
            const historyPoint = this.history[this.currentIndex];

            this.editor.setContent(historyPoint.content);
            
            setTimeout(() => {
                this.restoreSelection(historyPoint.selection);
                this.updateInterface();
            }, 10);

            SytyCore.Messages.success(`تراجع: ${historyPoint.action}`);
            return true;

        } catch (error) {
            SytyCore.Debug.error('خطأ في التراجع', error);
            return false;
        } finally {
            setTimeout(() => {
                this.isUndoRedoOperation = false;
            }, 100);
        }
    }

    /**
     * الإعادة
     */
    redo() {
        if (!this.canRedo()) {
            SytyCore.Messages.warning('لا يوجد شيء للإعادة');
            return false;
        }

        this.isUndoRedoOperation = true;

        try {
            this.currentIndex++;
            const historyPoint = this.history[this.currentIndex];

            this.editor.setContent(historyPoint.content);
            
            setTimeout(() => {
                this.restoreSelection(historyPoint.selection);
                this.updateInterface();
            }, 10);

            SytyCore.Messages.success(`إعادة: ${historyPoint.action}`);
            return true;

        } catch (error) {
            SytyCore.Debug.error('خطأ في الإعادة', error);
            return false;
        } finally {
            setTimeout(() => {
                this.isUndoRedoOperation = false;
            }, 100);
        }
    }

    /**
     * التحقق من إمكانية التراجع
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * التحقق من إمكانية الإعادة
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * تحديث واجهة المستخدم
     */
    updateInterface() {
        try {
            if (this.editor.statsBar) {
                this.editor.statsBar.update();
            }
            
            if (this.editor.toolbar) {
                this.editor.toolbar.updateState();
            }
        } catch (error) {
            SytyCore.Debug.warn('خطأ في تحديث الواجهة', error);
        }
    }

    /**
     * مسح التاريخ
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.lastSnapshot = '';
        this.takeSnapshot('clear');
        SytyCore.Debug.log('🗑️ تم مسح التاريخ');
    }

    /**
     * تعطيل التسجيل مؤقتاً
     */
    pauseRecording() {
        this.isRecording = false;
    }

    /**
     * تفعيل التسجيل
     */
    resumeRecording() {
        this.isRecording = true;
    }

    /**
     * الحصول على معلومات التاريخ
     */
    getInfo() {
        return {
            totalPoints: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            isRecording: this.isRecording,
            maxSize: this.maxHistorySize
        };
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.SytyHistoryManager = SytyHistoryManager;
} 