// Use a flag to ensure the message listener is only registered once per tab.
let listenerRegistered = false;

if (!listenerRegistered) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "convertAndSave") {
      const imageUrl = request.imageUrl;
      const format = request.format;
      const fileExtension = format.split('/')[1]; // Get the file extension (webp, png, jpeg)

      const img = new Image();
      img.crossOrigin = "anonymous"; // This is important for accessing image data from other origins

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL(format);

        const link = document.createElement('a');
        link.href = dataUrl;

        const timestamp = new Date().getTime();
        link.download = `converted_image_${timestamp}.${fileExtension}`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        sendResponse({ success: true });
      };

      img.onerror = () => {
        console.error("Error loading image for conversion:", imageUrl);
        sendResponse({ success: false, error: "Error loading image" });
      };

      img.src = imageUrl;
      return true;
    }
    return false;
  });

  // Set the flag to true after the listener has been registered.
  listenerRegistered = true;
}


