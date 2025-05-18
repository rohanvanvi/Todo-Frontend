// Create AudioContext
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let startTime = 0;
let duration = 0;

// Function to find the start and end of the actual sound
const findSoundBoundaries = (audioBuffer: AudioBuffer) => {
  const threshold = 0.005;
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const padding = 0.02;
  
  let start = 0;
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      start = Math.max(0, i - (padding * sampleRate));
      break;
    }
  }

  let end = channelData.length - 1;
  for (let i = channelData.length - 1; i >= 0; i--) {
    if (Math.abs(channelData[i]) > threshold) {
      end = Math.min(channelData.length - 1, i + (padding * sampleRate));
      break;
    }
  }

  return {
    startTime: start / sampleRate,
    duration: (end - start) / sampleRate
  };
};

// Initialize or resume AudioContext
const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Load and analyze audio file
const loadAudio = async () => {
  try {
    const context = initializeAudioContext();
    const response = await fetch('/sounds/click.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    const boundaries = findSoundBoundaries(audioBuffer);
    startTime = boundaries.startTime;
    duration = boundaries.duration;
    
    console.log('Sound loaded - starts at:', startTime, 'seconds, duration:', duration, 'seconds');
  } catch (error) {
    console.error('Error loading audio:', error);
  }
};

// Initialize audio on first user interaction
const initializeAudioOnInteraction = () => {
  const handleInteraction = () => {
    loadAudio();
    // Remove event listeners after first interaction
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('touchstart', handleInteraction);
    document.removeEventListener('keydown', handleInteraction);
  };

  document.addEventListener('click', handleInteraction);
  document.addEventListener('touchstart', handleInteraction);
  document.addEventListener('keydown', handleInteraction);
};

// Initialize event listeners
initializeAudioOnInteraction();

export const playClickSound = (enabled = true) => {
  if (!enabled || !audioBuffer || !audioContext) return;

  try {
    // Ensure context is running
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0, startTime, duration);
  } catch (error) {
    console.error('Error playing sound:', error);
    // If we get an error, try to reinitialize the audio
    loadAudio();
  }
}; 