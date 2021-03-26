const showDevStuffCheckbox = document.getElementById("showDeveloperStuff");
const showFeedbackCheckbox = document.getElementById("showFeedbackForm");

// load user settings, set checkboxes' states
const setOptionsFromStorage = () => {
  chrome.storage.sync.get("showDeveloperStuff", ({ showDeveloperStuff }) => {
    showDevStuffCheckbox.checked = !!showDeveloperStuff;
  });

  chrome.storage.sync.get("showFeedbackForm", ({ showFeedbackForm }) => {
    showFeedbackCheckbox.checked = !!showFeedbackForm;
  });
};

const setupInputListeners = () => {
  showDevStuffCheckbox.addEventListener("click", async () => {
    chrome.storage.sync.set({ showDeveloperStuff: showDevStuffCheckbox.checked });
  });
  
  showFeedbackCheckbox.addEventListener("click", async () => {
    chrome.storage.sync.set({ showFeedbackForm: showFeedbackCheckbox.checked });
  });
};

// what to do when the options page is opened
const onLoad = () => {
  setOptionsFromStorage();
  setupInputListeners();
};

onLoad();