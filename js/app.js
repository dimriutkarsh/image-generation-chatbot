// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // Initialize image generator
  const imageGenerator = new ImageGenerator(API_KEY);
  
  // Get DOM elements
  const promptForm = document.querySelector('.prompt-form');
  const promptInput = document.querySelector('.prompt-input');
  const modelSelect = document.getElementById('model-select');
  const imageCountSelect = document.getElementById('image-count-select');
  const aspectRatioSelect = document.getElementById('aspect-ratio-select');
  const generateBtn = document.querySelector('.generate-btn');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorMessage = document.getElementById('error-message');
  const resultsContainer = document.getElementById('results-container');
  
  // Handle form submission
  promptForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get values from form
    const promptText = promptInput.value.trim();
    const selectedModel = modelSelect.value;
    const imageCount = imageCountSelect.value;
    const aspectRatio = aspectRatioSelect.value;
    
    // Validate inputs
    if (!promptText || !selectedModel || !imageCount || !aspectRatio) {
      showError('Please fill out all fields');
      return;
    }
    
    // Show loading state
    showLoading(true);
    hideError();
    
    try {
      // Generate images
      const imageUrls = await imageGenerator.generateImages(
        promptText,
        selectedModel,
        aspectRatio,
        imageCount
      );
      
      // Display results
      displayResults(imageUrls, aspectRatio);
    } catch (error) {
      showError(error.message || 'Failed to generate images. Please try again.');
    } finally {
      showLoading(false);
    }
  });
  
  // Display generated images
  function displayResults(imageUrls, aspectRatio) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create cards for each image
    imageUrls.forEach((url, index) => {
      if (!url) return; // Skip invalid URLs
      
      const card = document.createElement('div');
      card.className = 'result-card';
      
      const img = document.createElement('img');
      img.className = 'result-image';
      img.style.setProperty('--image-aspect-ratio', aspectRatio);
      img.src = url;
      img.alt = 'AI generated image';
      img.loading = 'lazy';
      
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'download-btn';
      downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
      downloadBtn.addEventListener('click', () => {
        imageGenerator.downloadImage(url, `ai-image-${Date.now()}-${index}.jpg`);
      });
      
      card.appendChild(img);
      card.appendChild(downloadBtn);
      resultsContainer.appendChild(card);
    });
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Show/hide loading indicator
  function showLoading(isLoading) {
    if (isLoading) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
      loadingIndicator.classList.remove('hidden');
    } else {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fa-solid fa-wand-sparkles"></i> <span>Generate</span>';
      loadingIndicator.classList.add('hidden');
    }
  }
  
  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
  
  // Hide error message
  function hideError() {
    errorMessage.classList.add('hidden');
  }
  
  // Fix for textarea whitespace
  promptInput.value = promptInput.value.trim();
});