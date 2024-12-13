// Get elements
const dragDropArea = document.getElementById('dragDropArea');
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const popupOverlay = document.getElementById('popupOverlay');
const downloadLink = document.getElementById('downloadLink');
const convertMoreBtn = document.getElementById('convertMoreBtn');
const formatSelect = document.getElementById('format');
const qualitySelect = document.getElementById('quality');
const conversionSlide = document.getElementById('conversionSlide');
const uploadMessage = document.getElementById('uploadMessage');

let selectedFile = null;

// Initialize page load
window.addEventListener('load', () => {
    conversionSlide.style.transform = 'translateY(0)';
    conversionSlide.style.transition = 'transform 0.5s ease';

    popupOverlay.style.display = 'none';
    loadingOverlay.style.display = 'none';
    uploadMessage.style.display = 'none';
});
// Drag-and-drop functionality
dragDropArea.addEventListener('click', () => fileInput.click());
dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.style.background = 'rgba(56, 189, 248, 0.2)';
});
dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.style.background = 'transparent';
});
dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.style.background = 'transparent';
    handleFileUpload(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFileUpload(e.target.files[0]);
});
// Handle file upload
function handleFileUpload(file) {
    if (file) {
        selectedFile = file;
        uploadMessage.style.display = 'block';
        uploadMessage.textContent = `File "${file.name}" Uploaded Successfully!`;
    }
}
// Simulate file conversion
convertBtn.addEventListener('click', () => {
    if (!selectedFile) {
        alert('Please select an image first!');
        return;
    }
    const format = formatSelect.value;
    const quality = qualitySelect.value;

    // Show loading animation
    loadingOverlay.style.display = 'flex';

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Adjust canvas size for quality
            let scale = 1;
            if (quality === '720p') scale = 0.5;
            else if (quality === '480p') scale = 0.25;

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            if (format === 'pdf') {
                convertToPDF(canvas);
            } else {
                convertToImage(canvas, format);
            }
        };
    };
    reader.readAsDataURL(selectedFile);
});
// Convert to image
function convertToImage(canvas, format) {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
    canvas.toBlob(
        (blob) => {
            setTimeout(() => {
                // Hide loading animation
                loadingOverlay.style.display = 'none';

                // Prepare download
                const fakeFileName = `Converted-file.${format}`;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = fakeFileName;

                // Show popup
                popupOverlay.style.display = 'flex';
            }, 2000); // Delay by 5 seconds
        },
        mimeType,
        0.9 // Quality factor
    );

}

// Convert More button functionality
convertMoreBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none'; // Hide popup
    selectedFile = null; // Reset selected file
    uploadMessage.style.display = 'none'; // Hide upload message
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
});
