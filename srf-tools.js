let showEnvironmentCheckbox = document.getElementById("showEnvironment");

chrome.storage.sync.get("shouldShowEnvironment", ({ shouldShowEnvironment }) => {
  showEnvironmentCheckbox.checked = !!shouldShowEnvironment;
});

// When the checkbox is changed, save the setting and let the content scripbt know
showEnvironmentCheckbox.addEventListener("click", async () => {
  const shouldShowEnvironment = showEnvironmentCheckbox.checked;

  // save the setting
  chrome.storage.sync.set({ shouldShowEnvironment: shouldShowEnvironment });

  // send a message to the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'showEnvironmentBadge'
    });
  });
});
