const imageContainer = document.querySelector('.image-container');
const loadMoreButton = document.querySelector('.btn');

let imageNumber = imageContainer.querySelectorAll('img').length;

loadMoreButton.addEventListener('click', function () {
    for (let i = 0; i < 3; i++) {
        imageNumber++;

        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';

        const image = document.createElement('img');
        const imageId = Math.floor(Math.random() * 2000) + 1;

        image.src = `https://picsum.photos/800/600?random=${imageId}`;
        image.alt = `Gallery image ${imageNumber}`;
        image.loading = 'lazy';

        const downloadButton = document.createElement('a');
        downloadButton.className = 'download-btn';
        downloadButton.href = image.src;
        downloadButton.textContent = 'Download';
        downloadButton.target = '_blank';
        downloadButton.rel = 'noopener';

        imageCard.appendChild(image);
        imageCard.appendChild(downloadButton);
        imageContainer.appendChild(imageCard);
    }
});

imageContainer.addEventListener('click', async function (event) {
    const downloadButton = event.target.closest('.download-btn');

    if (!downloadButton) {
        return;
    }

    event.preventDefault();

    const imageUrl = downloadButton.href;
    const fileName = `gallery-image-${imageNumber}.jpg`;

    try {
        const response = await fetch(imageUrl);
        const imageFile = await response.blob();
        const imageLink = document.createElement('a');

        imageLink.href = URL.createObjectURL(imageFile);
        imageLink.download = fileName;
        imageLink.click();

        URL.revokeObjectURL(imageLink.href);
    } catch (error) {
        window.open(imageUrl, '_blank');
    }
});