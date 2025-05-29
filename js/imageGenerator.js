// Image generation functionality
class ImageGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  // Process the aspect ratio and return width and height
  getDimensions(aspectRatio) {
    return DIMENSIONS[aspectRatio] || DIMENSIONS["1/1"];
  }

  // Generate images using the Hugging Face API
  async generateImages(promptText, selectedModel, aspectRatio, imageCount) {
    const { width, height } = this.getDimensions(aspectRatio);
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    
    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "x-use-cache": "false"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: promptText,
          parameters: { 
            width, 
            height,
            num_images: parseInt(imageCount, 10)
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate images");
      }
      
      // If the response is a single blob (for some models)
      if (response.headers.get('content-type').includes('image/')) {
        const blob = await response.blob();
        return [URL.createObjectURL(blob)];
      }
      
      // If the response is an array of blobs or a JSON array
      if (response.headers.get('content-type').includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Handle array of base64 images
          return data.map(item => {
            if (typeof item === 'string') {
              // Handle base64 string
              return `data:image/jpeg;base64,${item}`;
            } else if (item.blob) {
              // Handle blob url
              return URL.createObjectURL(item.blob);
            }
          });
        } else if (data.images) {
          // Some models return {images: [...]} format
          return data.images.map(img => `data:image/jpeg;base64,${img}`);
        }
      }
      
      // For binary responses containing multiple images
      const blob = await response.blob();
      return [URL.createObjectURL(blob)];
      
    } catch (error) {
      console.error("Error generating images:", error);
      throw error;
    }
  }
  
  // Helper method to download image
  downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'ai-generated-image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}