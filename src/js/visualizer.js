// This file is responsible for creating the visual representation of the audio. 
// It handles the rendering of the visualizer based on the audio frequency data 
// and updates the visuals in real-time as the audio plays.

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('audio');
let audioContext = null;
let analyser = null;
let source = null;
let bufferLength;
let dataArray;

// Set initial canvas size
canvas.width = 800;
canvas.height = 400;

// Initialize audio context after user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Set up analyzer
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Start the visualization
        draw();
    }
}

function draw() {
    if (!analyser) return;  // Don't draw if analyser isn't initialized
    
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    // Clear the canvas with a fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the width of each bar and spacing
    const bars = 64; // Reduce number of bars for cleaner look
    const barWidth = canvas.width / bars;
    const spacing = 2;
    
    // Step size to sample fewer frequencies
    const step = Math.floor(bufferLength / bars);
    
    for (let i = 0; i < bars; i++) {
        // Get average of nearby frequencies for smoother visualization
        let sum = 0;
        for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j];
        }
        const value = sum / step;
        
        // Smooth out the bar height with some easing
        const barHeight = (value / 255) * canvas.height * 0.8;
        
        // Calculate position
        const x = i * barWidth;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(
            x, canvas.height,
            x, canvas.height - barHeight
        );
        
        // Use a pleasing color scheme
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        
        // Draw bar
        ctx.fillStyle = gradient;
        ctx.fillRect(
            x + spacing,
            canvas.height - barHeight,
            barWidth - spacing * 2,
            barHeight
        );
        
        // Add a subtle glow effect
        ctx.fillStyle = 'rgba(79, 172, 254, 0.1)';
        ctx.fillRect(
            x + spacing,
            canvas.height - barHeight - 10,
            barWidth - spacing * 2,
            barHeight + 10
        );
    }
}

audio.addEventListener('play', () => {
    audioContext.resume().then(() => {
        draw();
    });
});