// Add initialization flag
console.log("Content script loaded successfully!");

// Add connection check and error handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'changeBackgroundColor') {
        try {
            document.body.style.backgroundColor = request.color;
            sendResponse({ status: "success" });
        } catch (error) {
            sendResponse({ status: "error", message: error.message });
        }
        return true; // Keep message channel open for async response
    }
});