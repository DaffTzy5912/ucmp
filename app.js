const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const playlist = document.getElementById('playlist');
const albumArt = document.getElementById('albumArt');

let songs = [];
let currentSong = 0;

// Load dari localStorage
window.onload = () => {
    const storedSongs = localStorage.getItem('songs');
    if (storedSongs) {
        songs = JSON.parse(storedSongs);
        updatePlaylist();
        if (songs.length > 0) loadSong(0);
    }
};

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '❚❚';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '▶';
    }
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audioPlayer.play();
    playPauseBtn.innerHTML = '❚❚';
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audioPlayer.play();
    playPauseBtn.innerHTML = '❚❚';
}

function changeSong(index) {
    if (index !== '') {
        currentSong = parseInt(index);
        loadSong(currentSong);
        audioPlayer.play();
        playPauseBtn.innerHTML = '❚❚';
    }
}

function loadSong(index) {
    if (songs[index]) {
        const song = songs[index];
        audioPlayer.src = song.url;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.innerHTML = `<img src="${song.cover}" alt="Album Art">`;
    }
}

function updatePlaylist() {
    playlist.innerHTML = '<option value="">Pilih Lagu</option>';
    songs.forEach((song, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${song.title} - ${song.artist}`;
        playlist.appendChild(option);
    });
}

audioPlayer.addEventListener('ended', nextSong);
