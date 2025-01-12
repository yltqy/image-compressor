/**
 * 图片压缩工具主要逻辑
 */

class ImageCompressor {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.currentFile = null;
    }

    /**
     * 初始化DOM元素
     */
    initElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.previewContainer = document.getElementById('previewContainer');
        this.originalPreview = document.getElementById('originalPreview');
        this.compressedPreview = document.getElementById('compressedPreview');
        this.originalSize = document.getElementById('originalSize');
        this.compressedSize = document.getElementById('compressedSize');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        this.downloadBtn = document.getElementById('downloadBtn');
    }

    /**
     * 绑定事件处理
     */
    bindEvents() {
        // 上传区域点击事件
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        
        // 文件拖拽事件
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#007AFF';
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.style.borderColor = '#E5E5E5';
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#E5E5E5';
            const file = e.dataTransfer.files[0];
            if (this.validateFile(file)) {
                this.handleFile(file);
            }
        });

        // 文件选择事件
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (this.validateFile(file)) {
                this.handleFile(file);
            }
        });

        // 质量滑块变化事件
        this.qualitySlider.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
            if (this.currentFile) {
                this.compressImage(this.currentFile, e.target.value / 100);
            }
        });

        // 下载按钮点击事件
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    /**
     * 验证文件类型
     */
    validateFile(file) {
        if (!file) return false;
        if (!file.type.match(/image\/(jpeg|png)/)) {
            alert('请上传PNG或JPG格式的图片！');
            return false;
        }
        return true;
    }

    /**
     * 处理上传的文件
     */
    async handleFile(file) {
        this.currentFile = file;
        this.previewContainer.style.display = 'block';
        
        // 显示原始图片信息
        this.originalSize.textContent = this.formatFileSize(file.size);
        this.displayImage(file, this.originalPreview);
        
        // 压缩图片
        await this.compressImage(file, this.qualitySlider.value / 100);
    }

    /**
     * 压缩图片
     */
    async compressImage(file, quality) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                this.compressedPreview.src = URL.createObjectURL(blob);
                this.compressedSize.textContent = this.formatFileSize(blob.size);
            }, file.type, quality);
        };
    }

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 显示图片
     */
    displayImage(file, imgElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    /**
     * 下载压缩后的图片
     */
    downloadImage() {
        if (!this.compressedPreview.src) return;
        
        const link = document.createElement('a');
        link.download = `compressed_${this.currentFile.name}`;
        link.href = this.compressedPreview.src;
        link.click();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
}); 