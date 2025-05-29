// Prompt ideas for random suggestion feature
const promptIdeas = [
  "A futuristic cityscape with flying cars and neon lights",
  "A serene mountain landscape at sunset with a lake reflection",
  "A magical forest with glowing mushrooms and fairy lights",
  "An underwater scene with colorful coral reefs and exotic fish",
  "A steampunk-inspired mechanical creature in a Victorian setting",
  "A cosmic scene with galaxies, nebulas, and planets",
  "A cozy cabin in a snow-covered forest with northern lights",
  "An ancient temple overgrown with vines and flowers",
  "A cyberpunk street market with holographic advertisements",
  "A surreal dreamscape with floating islands and impossible architecture",
  "A fantasy castle perched on a cliff overlooking the ocean",
  "A Japanese garden during cherry blossom season",
  "A mystical creature emerging from a misty lake at dawn",
  "An abandoned city reclaimed by nature and wildlife",
  "A retro-futuristic space station orbiting a ringed planet"
];

// Initialize the random prompt button
document.addEventListener('DOMContentLoaded', function() {
  const diceButton = document.querySelector('.prompt-btn');
  diceButton.addEventListener('click', function(e) {
    e.preventDefault();
    const randomPrompt = promptIdeas[Math.floor(Math.random() * promptIdeas.length)];
    document.querySelector('.prompt-input').value = randomPrompt;
  });
});