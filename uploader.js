function uploadSong() {
    const fileInput = document.getElementById('musicFile');
    const titleInput = document.getElementById('songTitle').value.trim();
    const artistInput = document.getElementById('songArtist').value.trim();

    if (!fileInput.files[0]) {
        alert("Silakan pilih file MP3!");
        return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith('audio/mpeg')) {
        alert("Hanya file MP3 yang diperbolehkan.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const url = e.target.result;

        // Simpan ke localStorage
        let songs = JSON.parse(localStorage.getItem('songs') || '[]');

        const newSong = {
            title: titleInput || "Unknown Title",
            artist: artistInput || "Unknown Artist",
            url: url,
            cover: `https://picsum.photos/seed/${Date.now()}/300/300`
        };

        songs.push(newSong);
        localStorage.setItem('songs', JSON.stringify(songs));

        alert("Lagu berhasil diupload!");

        // Reset form
        document.getElementById('musicFile').value = '';
        document.getElementById('songTitle').value = '';
        document.getElementById('songArtist').value = '';
    };

    reader.readAsDataURL(file);
}
