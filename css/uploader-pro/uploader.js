/**
 * WEUI Uploader 组件 JavaScript 实现
 * 功能包括：文件选择、图片预览、删除、拖拽上传、文件验证等
 */

class WeuiUploader {
    constructor(options = {}) {
        // 默认配置
        this.config = {
            maxCount: 9,                    // 最大上传数量
            maxSize: 5 * 1024 * 1024,       // 最大文件大小 (5MB)
            acceptTypes: ['image/*'],       // 接受的文件类型
            autoUpload: false,              // 是否自动上传
            ...options
        };

        // DOM 元素引用
        this.elements = {
            uploader: document.getElementById('uploader'),
            fileList: document.getElementById('file-list'),
            fileInput: document.getElementById('file-input'),
            uploadBtn: document.getElementById('upload-btn'),
            uploadedCount: document.getElementById('uploaded-count'),
            maxCount: document.getElementById('max-count'),
            submitBtn: document.getElementById('submit-btn'),
            clearBtn: document.getElementById('clear-btn'),
            previewMask: document.getElementById('preview-mask'),
            previewImage: document.getElementById('preview-image'),
            closePreview: document.getElementById('close-preview')
        };

        // 存储已选择的文件
        this.files = [];
        
        // 初始化组件
        this.init();
    }

    /**
     * 初始化上传器
     */
    init() {
        // 设置最大数量显示
        this.elements.maxCount.textContent = this.config.maxCount;
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 更新UI状态
        this.updateUI();
        
        console.log('WEUI Uploader 初始化完成');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 文件选择事件
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // 点击上传按钮事件
        this.elements.uploadBtn.addEventListener('click', () => {
            this.elements.fileInput.click();
        });

        // 拖拽上传事件
        this.bindDragEvents();

        // 提交按钮事件
        this.elements.submitBtn.addEventListener('click', () => {
            this.handleSubmit();
        });

        // 清空按钮事件
        this.elements.clearBtn.addEventListener('click', () => {
            this.clearAll();
        });

        // 预览相关事件
        this.bindPreviewEvents();
    }

    /**
     * 绑定拖拽上传事件
     */
    bindDragEvents() {
        const uploader = this.elements.uploader;

        // 阻止默认拖拽行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploader.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // 拖拽进入效果
        ['dragenter', 'dragover'].forEach(eventName => {
            uploader.addEventListener(eventName, () => {
                uploader.classList.add('weui-uploader_dragover');
            });
        });

        // 拖拽离开效果
        ['dragleave', 'drop'].forEach(eventName => {
            uploader.addEventListener(eventName, () => {
                uploader.classList.remove('weui-uploader_dragover');
            });
        });

        // 文件拖拽放置
        uploader.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            this.handleFileSelect(files);
        });
    }

    /**
     * 绑定预览相关事件
     */
    bindPreviewEvents() {
        // 关闭预览
        this.elements.closePreview.addEventListener('click', () => {
            this.hidePreview();
        });

        // 点击遮罩层关闭预览
        this.elements.previewMask.addEventListener('click', (e) => {
            if (e.target === this.elements.previewMask) {
                this.hidePreview();
            }
        });

        // ESC键关闭预览
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePreview();
            }
        });
    }

    /**
     * 处理文件选择
     * @param {FileList|Array} files - 选择的文件列表
     */
    handleFileSelect(files) {
        const fileArray = Array.from(files);
        
        // 验证文件数量
        if (this.files.length + fileArray.length > this.config.maxCount) {
            this.showToast(`最多只能上传 ${this.config.maxCount} 张图片`);
            return;
        }

        // 验证每个文件
        fileArray.forEach(file => {
            if (this.validateFile(file)) {
                this.addFile(file);
            }
        });
    }

    /**
     * 验证文件
     * @param {File} file - 要验证的文件
     * @returns {boolean} 验证结果
     */
    validateFile(file) {
        // 检查文件类型
        if (!this.config.acceptTypes.some(type => {
            if (type === 'image/*') {
                return file.type.startsWith('image/');
            }
            return file.type === type;
        })) {
            this.showToast('只支持图片格式文件');
            return false;
        }

        // 检查文件大小
        if (file.size > this.config.maxSize) {
            this.showToast(`文件大小不能超过 ${this.formatFileSize(this.config.maxSize)}`);
            return false;
        }

        return true;
    }

    /**
     * 添加文件到列表
     * @param {File} file - 要添加的文件
     */
    addFile(file) {
        // 创建文件对象
        const fileObj = {
            id: this.generateId(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            url: null
        };

        // 添加到文件列表
        this.files.push(fileObj);

        // 创建预览
        this.createPreview(fileObj);

        // 更新UI
        this.updateUI();

        // 如果配置了自动上传，则立即上传
        if (this.config.autoUpload) {
            this.uploadFile(fileObj);
        }
    }

    /**
     * 创建文件预览
     * @param {Object} fileObj - 文件对象
     */
    createPreview(fileObj) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            fileObj.url = e.target.result;
            this.renderFileItem(fileObj);
        };

        reader.readAsDataURL(fileObj.file);
    }

    /**
     * 渲染文件项
     * @param {Object} fileObj - 文件对象
     */
    renderFileItem(fileObj) {
        const li = document.createElement('li');
        li.className = 'weui-uploader__file';
        li.dataset.fileId = fileObj.id;

        // 创建图片元素
        const img = document.createElement('img');
        img.src = fileObj.url;
        img.alt = fileObj.name;
        img.title = fileObj.name;

        // 创建删除按钮
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'weui-uploader__delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除';

        // 绑定删除事件
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFile(fileObj.id);
        });

        // 绑定预览事件
        li.addEventListener('click', () => {
            this.showPreview(fileObj.url, fileObj.name);
        });

        // 组装DOM
        li.appendChild(img);
        li.appendChild(deleteBtn);
        
        // 插入到文件列表
        this.elements.fileList.appendChild(li);
    }

    /**
     * 删除文件
     * @param {string} fileId - 文件ID
     */
    removeFile(fileId) {
        // 从数组中移除
        const index = this.files.findIndex(f => f.id === fileId);
        if (index > -1) {
            this.files.splice(index, 1);
        }

        // 从DOM中移除
        const fileElement = this.elements.fileList.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }

        // 更新UI
        this.updateUI();
    }

    /**
     * 清空所有文件
     */
    clearAll() {
        this.files = [];
        this.elements.fileList.innerHTML = '';
        this.updateUI();
        this.showToast('已清空所有文件');
    }

    /**
     * 显示图片预览
     * @param {string} url - 图片URL
     * @param {string} name - 图片名称
     */
    showPreview(url, name) {
        this.elements.previewImage.src = url;
        this.elements.previewImage.alt = name;
        this.elements.previewMask.style.display = 'flex';
        
        // 添加动画效果
        setTimeout(() => {
            this.elements.previewMask.style.opacity = '1';
        }, 10);
    }

    /**
     * 隐藏图片预览
     */
    hidePreview() {
        this.elements.previewMask.style.opacity = '0';
        setTimeout(() => {
            this.elements.previewMask.style.display = 'none';
        }, 200);
    }

    /**
     * 处理提交
     */
    handleSubmit() {
        if (this.files.length === 0) {
            this.showToast('请先选择要上传的文件');
            return;
        }

        // 这里可以添加实际的上传逻辑
        console.log('准备上传文件:', this.files);
        this.showToast(`准备上传 ${this.files.length} 个文件`);
        
        // 模拟上传过程
        this.files.forEach((fileObj, index) => {
            setTimeout(() => {
                this.uploadFile(fileObj);
            }, index * 500);
        });
    }

    /**
     * 上传单个文件
     * @param {Object} fileObj - 文件对象
     */
    uploadFile(fileObj) {
        // 添加加载状态
        const fileElement = this.elements.fileList.querySelector(`[data-file-id="${fileObj.id}"]`);
        if (fileElement) {
            fileElement.classList.add('weui-uploader__file_loading');
        }

        // 模拟上传过程
        setTimeout(() => {
            // 移除加载状态
            if (fileElement) {
                fileElement.classList.remove('weui-uploader__file_loading');
            }
            
            this.showToast(`文件 ${fileObj.name} 上传成功`);
        }, 2000);
    }

    /**
     * 更新UI状态
     */
    updateUI() {
        const count = this.files.length;
        const maxCount = this.config.maxCount;

        // 更新计数
        this.elements.uploadedCount.textContent = count;

        // 更新上传按钮状态
        if (count >= maxCount) {
            this.elements.uploadBtn.style.display = 'none';
        } else {
            this.elements.uploadBtn.style.display = 'flex';
        }

        // 更新提交按钮状态
        this.elements.submitBtn.disabled = count === 0;
    }

    /**
     * 显示提示信息
     * @param {string} message - 提示信息
     */
    showToast(message) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = 'weui-toast';
        toast.innerHTML = `
            <div class="weui-toast__content">
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // 添加到页面
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 获取所有文件
     * @returns {Array} 文件列表
     */
    getFiles() {
        return this.files;
    }

    /**
     * 设置配置
     * @param {Object} config - 新配置
     */
    setConfig(config) {
        this.config = { ...this.config, ...config };
        this.updateUI();
    }
}

// 页面加载完成后初始化上传器
document.addEventListener('DOMContentLoaded', () => {
    // 创建上传器实例
    const uploader = new WeuiUploader({
        maxCount: 9,
        maxSize: 5 * 1024 * 1024, // 5MB
        acceptTypes: ['image/*'],
        autoUpload: false
    });

    // 将实例挂载到全局，方便调试
    window.uploader = uploader;
});