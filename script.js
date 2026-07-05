document.addEventListener("DOMContentLoaded", () => {
    const totalImages = 4; // Change this as you add more
    const gallery = document.getElementById('gallery');

    // i-- ensures the newest (highest number) is at the top
    for (let i = totalImages; i >= 1; i--) {
        const fileName = i.toString().padStart(3, '0');
        
        const item = document.createElement('div');
        item.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = `images/${fileName}.jpg`;
        img.alt = `Photography ${fileName}`;
        img.loading = "lazy";

        item.appendChild(img);
        gallery.appendChild(item);
    }
});