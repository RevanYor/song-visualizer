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

// Event Listeners
document.getElementById('audioFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        audioHandler.loadAudio(file);
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