// Global state for Masonry instances
let galleryMasonry = null;
let workPageMasonry = { msnry: null, msnryAlbums: null };

// Global configuration
const CONFIG = {
    // Gallery page
    gallery: {
        totalImages: 26
    },
    // Work page - albums
    albums: [
        { name: 'Kuş', folder: 'albums/kuş', imageCount: 3, coverImage: '001' },
        { name: 'Kedi', folder: 'albums/kedi', imageCount: 3, coverImage: '002' },
        { name: 'Kirpi', folder: 'albums/kirpi', imageCount: 3, coverImage: '003' }
    ]
};

// Get column width based on viewport
function getColumnWidth() {
    if (window.innerWidth <= 800) return 0.5;   // 2 columns
    if (window.innerWidth <= 1200) return 0.333; // 3 columns
    return 0.25;                                  // 4 columns
}

// Modal functions
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize modal handlers
function initModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    if (!modal || !modalClose) return;

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Initialize gallery grid
function initGallery(gridSelector, masonry = true) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    let msnry = null;

    if (CONFIG.gallery.totalImages === 0) return;

    const fragment = document.createDocumentFragment();

    for (let i = CONFIG.gallery.totalImages; i >= 1; i--) {
        const fileName = String(i).padStart(3, '0');
        const item = document.createElement('div');
        item.className = 'grid-item';
        const img = document.createElement('img');
        img.alt = `Gallery Image ${fileName}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = `images/${fileName}.jpg`;
        img.addEventListener('click', () => openModal(img.src));
        item.appendChild(img);
        fragment.appendChild(item);
    }

    grid.appendChild(fragment);

    if (masonry) {
        msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: getColumnWidth(),
            percentPosition: true,
            transitionDuration: '0.2s'
        });

        if (!gridSelector.includes('#imagesGrid')) {
            galleryMasonry = msnry;
        }

        const imgLoad = imagesLoaded(grid);
        imgLoad.on('progress', function (instance, image) {
            setTimeout(() => {
                msnry.reloadItems();
                msnry.layout();
            }, 100);
        });
        imgLoad.on('always', function () {
            setTimeout(() => {
                msnry.reloadItems();
                msnry.layout();
            }, 100);
        });
    }
}

// Initialize work page with albums
function initWorkPage() {
    const albumsView = document.getElementById('albumsView');
    const imagesGrid = document.getElementById('imagesGrid');
    const imagesWrapper = document.querySelector('.images-wrapper');

    let msnry = null;
    let msnryAlbums = null;

    function displayAlbums() {
        albumsView.style.display = 'grid';
        imagesWrapper.style.display = 'none';
        albumsView.innerHTML = '';

        CONFIG.albums.forEach(album => {
            const albumItem = document.createElement('div');
            albumItem.className = 'album-item';
            albumItem.innerHTML = `
                <img src="${album.folder}/${album.coverImage}.jpg" alt="${album.name}" class="album-thumbnail">
                <div class="album-name">${album.name}</div>
            `;
            albumItem.addEventListener('click', () => displayAlbumImages(album));
            albumsView.appendChild(albumItem);
        });

        if (msnryAlbums) msnryAlbums.destroy();
        msnryAlbums = new Masonry(albumsView, {
            itemSelector: '.album-item',
            columnWidth: getColumnWidth(),
            percentPosition: true,
            transitionDuration: '0.2s'
        });
        workPageMasonry.msnryAlbums = msnryAlbums;

        const imgLoadAlbums = imagesLoaded(albumsView);
        imgLoadAlbums.on('progress', function (instance, image) {
            setTimeout(() => {
                msnryAlbums.reloadItems();
                msnryAlbums.layout();
            }, 100);
        });
        imgLoadAlbums.on('always', function () {
            setTimeout(() => {
                msnryAlbums.reloadItems();
                msnryAlbums.layout();
            }, 100);
        });
    }

    function displayAlbumImages(album) {
        currentAlbum = album;
        albumsView.style.display = 'none';
        imagesWrapper.style.display = 'block';
        imagesGrid.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (let i = album.imageCount; i >= 1; i--) {
            const fileName = String(i).padStart(3, '0');
            const item = document.createElement('div');
            item.className = 'grid-item';
            const img = document.createElement('img');
            img.alt = `${album.name} - Image ${fileName}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.src = `${album.folder}/${fileName}.jpg`;
            img.addEventListener('click', () => openModal(img.src));
            item.appendChild(img);
            fragment.appendChild(item);
        }

        imagesGrid.appendChild(fragment);

        if (msnry) msnry.destroy();
        msnry = new Masonry(imagesGrid, {
            itemSelector: '.grid-item',
            columnWidth: getColumnWidth(),
            percentPosition: true,
            transitionDuration: '0.2s'
        });
        workPageMasonry.msnry = msnry;

        const imgLoad = imagesLoaded(imagesGrid);
        imgLoad.on('progress', function (instance, image) {
            setTimeout(() => {
                msnry.reloadItems();
                msnry.layout();
            }, 100);
        });
        imgLoad.on('always', function () {
            setTimeout(() => {
                msnry.reloadItems();
                msnry.layout();
            }, 100);
        });
    }

    displayAlbums();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initModal();

    // Initialize index.html gallery
    const grid = document.querySelector('.masonry-three-columns:not(#imagesGrid)');
    if (grid && grid.id !== 'imagesGrid') {
        initGallery('.masonry-three-columns:not(#imagesGrid)');
    }
});

// Global resize handler for all Masonry instances
window.addEventListener('resize', () => {
    const newColumnWidth = getColumnWidth();

    if (galleryMasonry) {
        galleryMasonry.options.columnWidth = newColumnWidth;
        galleryMasonry.reloadItems();
        galleryMasonry.layout();
    }

    if (workPageMasonry.msnry) {
        workPageMasonry.msnry.options.columnWidth = newColumnWidth;
        workPageMasonry.msnry.reloadItems();
        workPageMasonry.msnry.layout();
    }

    if (workPageMasonry.msnryAlbums) {
        workPageMasonry.msnryAlbums.options.columnWidth = newColumnWidth;
        workPageMasonry.msnryAlbums.reloadItems();
        workPageMasonry.msnryAlbums.layout();
    }
});