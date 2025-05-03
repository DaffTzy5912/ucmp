const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.getElementById('albumArt');
const playlistList = document.getElementById('playlistList');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let songs = [];
let currentSong = 0;
let isShuffle = false;
let isRepeat = false;

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
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSong && songs.length > 1);
        currentSong = randomIndex;
    } else {
        currentSong = (currentSong + 1) % songs.length;
    }

    loadSong(currentSong);
    audioPlayer.play();
    playPauseBtn.innerHTML = '❚❚';
}

function prevSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSong && songs.length > 1);
        currentSong = randomIndex;
    } else {
        currentSong = (currentSong - 1 + songs.length) % songs.length;
    }

    loadSong(currentSong);
    audioPlayer.play();
    playPauseBtn.innerHTML = '❚❚';
}

function loadSong(index) {
    if (songs[index]) {
        const song = songs[index];
        audioPlayer.src = song.url;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.innerHTML = `<img src="${song.cover}" alt="Album Art">`;

        // Reset progress bar dan waktu
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";
    }
}

function updatePlaylist() {
    playlistList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${song.title} - ${song.artist}
            <span class="delete-btn" onclick="deleteSong(${index}); event.stopPropagation()">❌</span>
        `;
        li.onclick = () => {
            currentSong = index;
            loadSong(currentSong);
            audioPlayer.play();
            playPauseBtn.innerHTML = '❚❚';
        };
        playlistList.appendChild(li);
    });
}

function deleteSong(index) {
    if (confirm("Yakin ingin menghapus lagu ini dari playlist?")) {
        songs.splice(index, 1);

        if (index < currentSong) {
            currentSong--;
        }

        if (songs.length === 0) {
            audioPlayer.src = "";
            songTitle.textContent = "No Song Playing";
            artistName.textContent = "Add a song to start";
            albumArt.innerHTML = "<span>Album Art</span>";
        } else {
            loadSong(currentSong);
        }

        localStorage.setItem('songs', JSON.stringify(songs));
        updatePlaylist();
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.querySelectorAll('.control-button')[0].classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    document.querySelectorAll('.control-button')[4].classList.toggle('active', isRepeat);
}

// Update progress bar saat lagu diputar
audioPlayer.addEventListener('timeupdate', () => {
    const duration = isNaN(audioPlayer.duration) ? 0 : audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;

    // Format waktu
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);

    progressBar.max = duration;
    progressBar.value = currentTime;
});

// Skip ke waktu tertentu
progressBar.addEventListener('input', function () {
    audioPlayer.currentTime = this.value;
});

// Volume control
document.getElementById('volumeControl').addEventListener('input', function () {
    audioPlayer.volume = this.value;
});

// Next lagu otomatis
audioPlayer.addEventListener('ended', () => {
    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        nextSong();
    }
});
