function AudioHandler() {
    const audioFileInput = document.getElementById('audioFile');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    this.audio = document.getElementById('audio');
    this.isPlaying = false;

    this.loadAudio = function(file) {
        const url = URL.createObjectURL(file);
        this.audio.src = url;
        this.audio.load();
    };

    this.play = function() {
        initAudioContext(); // Initialize audio context before playing
        this.audio.play();
        this.isPlaying = true;
    };

    this.pause = function() {
        this.audio.pause();
        this.isPlaying = false;
    };

    this.stop = function() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    };

    this.getCurrentTime = function() {
        return this.audio.currentTime;
    };

    this.getDuration = function() {
        return this.audio.duration;
    };
}

const audioHandler = new AudioHandler();

// Progress bar elements
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateProgress() {
    const current = audioHandler.getCurrentTime();
    const duration = audioHandler.getDuration();
    progress.style.width = duration ? `${(current / duration) * 100}%` : '0%';
    currentTimeSpan.textContent = formatTime(current);
    durationSpan.textContent = formatTime(duration);
    if (!audioHandler.audio.paused && !audioHandler.audio.ended) {
        requestAnimationFrame(updateProgress);
    }
}

// Seek functionality
if (progressBar) {
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const duration = audioHandler.getDuration();
        if (!isNaN(duration)) {
            audioHandler.audio.currentTime = percent * duration;
        }
    });
}

// Start updating progress when audio plays
audioHandler.audio.addEventListener('play', () => {
    requestAnimationFrame(updateProgress);
});

// Update duration when metadata is loaded
audioHandler.audio.addEventListener('loadedmetadata', () => {
    durationSpan.textContent = formatTime(audioHandler.getDuration());
});

// Song title display
const songTitleDiv = document.getElementById('songTitle');

// Event Listeners
document.getElementById('audioFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audioHandler.loadAudio(file);
        // Display the file name as the song title
        songTitleDiv.textContent = file.name;
    } else {
        songTitleDiv.textContent = 'No song loaded';
    }
});

document.getElementById('playButton').addEventListener('click', () => {
    audioHandler.play();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    audioHandler.pause();
});

document.getElementById('stopButton').addEventListener('click', () => {
    audioHandler.stop();
});