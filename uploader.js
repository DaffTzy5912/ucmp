function uploadSong() {
    // Ambil data dari form
    const fileInput = document.getElementById('musicFile');
    const urlInput = document.getElementById('musicUrl').value.trim();
    const titleInput = document.getElementById('songTitle').value.trim();
    const artistInput = document.getElementById('songArtist').value.trim();
    const coverInput = document.getElementById('coverImage');

    let file = fileInput.files[0];
    let coverFile = coverInput.files[0];

    // Validasi file MP3
    if (!file && !urlInput) {
        alert("Silakan pilih file MP3 atau masukkan URL MP3!");
        return;
    }

    // Jika menggunakan file MP3 lokal
    if (file) {
        if (!file.type.startsWith('audio/mpeg')) {
            alert("Hanya file MP3 yang diperbolehkan.");
            return;
        }
    }

    // Baca file MP3 dan gambar cover
    const promises = [];

    // Untuk file MP3
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            file = e.target.result; // Simpan sebagai Base64
        };
        reader.readAsDataURL(file);
        promises.push(new Promise(resolve => setTimeout(resolve, 100))); // Tunggu sebentar
    }

    // Untuk gambar cover
    if (coverFile) {
        const coverReader = new FileReader();
        coverReader.onload = function(e) {
            coverFile = e.target.result; // Simpan sebagai Base64
        };
        coverReader.readAsDataURL(coverFile);
        promises.push(new Promise(resolve => setTimeout(resolve, 100))); // Tunggu sebentar
    }

    // Tunggu semua proses pembacaan selesai
    Promise.all(promises).then(() => {
        // Simpan ke localStorage
        let songs = JSON.parse(localStorage.getItem('songs') || '[]');

        const newSong = {
            title: titleInput || "Unknown Title",
            artist: artistInput || "Unknown Artist",
            url: file || urlInput,
            cover: coverFile || `https://picsum.photos/seed/${Date.now()}/300/300`
        };

        songs.push(newSong);
        localStorage.setItem('songs', JSON.stringify(songs));

        alert("Lagu berhasil diupload!");

        // Reset form
        document.getElementById('musicFile').value = '';
        document.getElementById('musicUrl').value = '';
        document.getElementById('songTitle').value = '';
        document.getElementById('songArtist').value = '';
        document.getElementById('coverImage').value = '';
    });
}