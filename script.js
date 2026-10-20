const imageContainer = document.querySelector('.image-container');
const loadMoreBtn = document.querySelector('.btn');

const imageCount = 3;
let imageNumber = imageContainer.querySelectorAll('img').length;

// Har card ke download button par click handler lagao
imageContainer.addEventListener('click', async (event) => {
    const downloadBtn = event.target.closest('.download-btn');

    if (!downloadBtn) return;

    event.preventDefault();

    const imageUrl = downloadBtn.dataset.imageUrl || downloadBtn.href;
    const originalText = downloadBtn.textContent;

    downloadBtn.textContent = 'Downloading...';
    downloadBtn.setAttribute('aria-busy', 'true');

    try {
        const response = await fetch(imageUrl, { mode: 'cors' });

        if (!response.ok) {
            throw new Error('Image download request failed');
        }

        const imageBlob = await response.blob();
        const blobUrl = URL.createObjectURL(imageBlob);
        const tempLink = document.createElement('a');

        tempLink.href = blobUrl;
        tempLink.download = downloadBtn.dataset.filename || 'gallery-image.jpg';

        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
        // Agar image host download block kare, image ko naye tab mein kholo
        window.open(imageUrl, '_blank', 'noopener');
        downloadBtn.textContent = 'Open image';
    } finally {
        downloadBtn.removeAttribute('aria-busy');

        if (downloadBtn.textContent === 'Downloading...') {
            downloadBtn.textContent = originalText;
        }
    }
});

loadMoreBtn.addEventListener('click', addNewImages);

function addNewImages() {
    for (let index = 0; index < imageCount; index++) {
        imageNumber++;

        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';

        const newImg = document.createElement('img');
        const randomNum = Math.floor(Math.random() * 2000) + 1;
        const imageUrl = `https://picsum.photos/800/600?random=${randomNum}`;

        newImg.src = imageUrl;
        newImg.alt = `Random gallery image ${imageNumber}`;
        newImg.loading = 'lazy';

        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'download-btn';
        downloadBtn.href = imageUrl;
        downloadBtn.dataset.imageUrl = imageUrl;
        downloadBtn.dataset.filename = `gallery-image-${imageNumber}.jpg`;
        downloadBtn.textContent = 'Download';

        imageCard.append(newImg, downloadBtn);
        imageContainer.appendChild(imageCard);

        newImg.addEventListener('error', () => imageCard.remove());
    }
}