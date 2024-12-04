const fileInput = document.getElementById('fileInput');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const compressionType = document.getElementById('compressionType');
        const qualityOptions = document.getElementById('qualityOptions');
        const sizeOptions = document.getElementById('sizeOptions');
        const compressionLevel = document.getElementById('compressionLevel');
        const compressionValue = document.getElementById('compressionValue');
        const maxWidth = document.getElementById('maxWidth');
        const maxHeight = document.getElementById('maxHeight');
        const compressBtn = document.getElementById('compressBtn');
        const result = document.getElementById('result');
        const originalImage = document.getElementById('originalImage');
        const compressedImage = document.getElementById('compressedImage');
        const originalSize = document.getElementById('originalSize');
        const originalDimensions = document.getElementById('originalDimensions');
        const compressedSize = document.getElementById('compressedSize');
        const compressedDimensions = document.getElementById('compressedDimensions');
        const compressionRatio = document.getElementById('compressionRatio');
        const downloadLink = document.getElementById('downloadLink');

        let originalFile;

        fileInput.addEventListener('change', handleFileSelect);
        compressionType.addEventListener('change', toggleCompressionOptions);
        compressionLevel.addEventListener('input', updateCompressionValue);
        compressBtn.addEventListener('click', compressImage);

        function handleFileSelect(e) {
            originalFile = e.target.files[0];
            if (originalFile) {
                compressBtn.disabled = false;
                displayImagePreview();
                displayOriginalImage();
            } else {
                compressBtn.disabled = true;
                imagePreview.classList.add('hidden');
            }
        }

        function displayImagePreview() {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(originalFile);
        }

        function displayOriginalImage() {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
                originalSize.textContent = `Size: ${formatBytes(originalFile.size)}`;
                const img = new Image();
                img.onload = () => {
                    originalDimensions.textContent = `Dimensions: ${img.width}x${img.height}`;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(originalFile);
        }

        function toggleCompressionOptions() {
            if (compressionType.value === 'quality') {
                qualityOptions.classList.remove('hidden');
                sizeOptions.classList.add('hidden');
            } else {
                qualityOptions.classList.add('hidden');
                sizeOptions.classList.remove('hidden');
            }
        }

        function updateCompressionValue(e) {
            compressionValue.textContent = `${e.target.value}%`;
        }

        function compressImage() {
            const reader = new FileReader();
            reader.readAsDataURL(originalFile);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    let newWidth, newHeight;
                    if (compressionType.value === 'size') {
                        const maxW = parseInt(maxWidth.value);
                        const maxH = parseInt(maxHeight.value);
                        const ratio = Math.min(maxW / img.width, maxH / img.height);
                        newWidth = img.width * ratio;
                        newHeight = img.height * ratio;
                    } else {
                        newWidth = img.width;
                        newHeight = img.height;
                    }

                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    const quality = compressionType.value === 'quality' ? compressionLevel.value / 100 : 0.8;
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                    compressedImage.src = compressedDataUrl;
                    result.classList.remove('hidden');

                    fetch(compressedDataUrl)
                        .then(res => res.blob())
                        .then(blob => {
                            const compressedFileSize = blob.size;
                            compressedSize.textContent = `Size: ${formatBytes(compressedFileSize)}`;
                            compressedDimensions.textContent = `Dimensions: ${newWidth}x${newHeight}`;
                            const ratio = (originalFile.size / compressedFileSize).toFixed(2);
                            compressionRatio.textContent = `Compression Ratio: ${ratio}:1`;
                            downloadLink.href = compressedDataUrl;
                        });
                };
            };
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }