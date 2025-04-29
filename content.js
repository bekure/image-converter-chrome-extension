// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is the one we expect for conversion
    if (request.action === "convertAndSave") {
      const imageUrl = request.imageUrl;
      const format = request.format;
      const fileExtension = format.split('/')[1]; // Get the file extension (webp, png, jpeg)
  
      // Create an image element to load the image
      const img = new Image();
      img.crossOrigin = "anonymous"; // This is important for accessing image data from other origins
  
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
  
        // Get the image data as a data URL in the desired format
        const dataUrl = canvas.toDataURL(format);
  
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = dataUrl;
  
        // Set the download filename (you can customize this)
        // Using the current timestamp for a unique filename
        const timestamp = new Date().getTime();
        link.download = `converted_image_${timestamp}.${fileExtension}`;
  
        // Append the link to the body (necessary for Firefox, good practice for Chrome)
        document.body.appendChild(link);
  
        // Programmatically click the link to trigger the download
        link.click();
  
        // Clean up: remove the link and canvas elements
        document.body.removeChild(link);
        // No need to remove canvas as it's not appended to the body
      };
  
      // Handle potential errors during image loading
      img.onerror = () => {
        console.error("Error loading image for conversion:", imageUrl);
        // Optionally, send a message back to the background script to show an error to the user
      };
  
      // Set the image source to start loading
      img.src = imageUrl;
  
      // Return true to indicate that we will send a response asynchronously (optional here)
      return true;
    }
  });
  