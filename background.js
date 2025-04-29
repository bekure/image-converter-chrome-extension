// Create context menu items when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Create parent menu item for image conversion
    chrome.contextMenus.create({
      id: "imageConverter",
      title: "Convert Image to",
      type: "normal",
      contexts: ["image"] // Show this menu only when right-clicking an image
    });
  
    // Create child menu items for different formats
    chrome.contextMenus.create({
      id: "convertToWebp",
      title: "WebP",
      type: "normal",
      parentId: "imageConverter", // Make this a child of the parent menu
      contexts: ["image"]
    });
  
    chrome.contextMenus.create({
      id: "convertToPng",
      title: "PNG",
      type: "normal",
      parentId: "imageConverter",
      contexts: ["image"]
    });
  
    chrome.contextMenus.create({
      id: "convertToJpeg",
      title: "JPEG",
      type: "normal",
      parentId: "imageConverter",
      contexts: ["image"]
    });
  });
  
  // Listen for clicks on the context menu items
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Check if the clicked item is one of our conversion options and if it's an image
    if (info.menuItemId.startsWith("convertTo") && info.mediaType === "image") {
      const imageUrl = info.srcUrl; // Get the URL of the clicked image
      let format = '';
  
      // Determine the target format based on the clicked menu item ID
      if (info.menuItemId === "convertToWebp") {
        format = 'image/webp';
      } else if (info.menuItemId === "convertToPng") {
        format = 'image/png';
      } else if (info.menuItemId === "convertToJpeg") {
        format = 'image/jpeg';
      }
  
      // Ensure we have a format and an image URL
      if (format && imageUrl) {
        // Execute the content script in the active tab to handle the conversion and download
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'] // Inject the content script
        }, () => {
          // After the content script is injected, send a message to it
          chrome.tabs.sendMessage(tab.id, {
            action: "convertAndSave",
            imageUrl: imageUrl,
            format: format
          });
        });
      }
    }
  });
  