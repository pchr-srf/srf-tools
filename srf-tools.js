const showEnvironmentCheckbox = document.getElementById("showEnvironment");

// load user setting regarding environment from storage, set checkbox' state
const setBannerStateFromStorage = () => {
  chrome.storage.sync.get("shouldShowEnvironment", ({ shouldShowEnvironment }) => {
    showEnvironmentCheckbox.checked = !!shouldShowEnvironment;
  });
}

// When the checkbox is changed, save the setting and let the content script know
const setupBannerCheckboxListener = () => {
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
}

const onContentIdFound = contentId => {
  document.getElementById('contentIdInput').value = contentId;
  
  // create URLs for article variations
  //document.querySelectorAll(".link--replace-url").forEach((element, index) => {
  //  let href = element.dataset.href;
  //  element.href = href.replace("$ID", contentId).replace("$URL", data.origin);
  //});

  //document.querySelector(".link--old-url").href = data.url + "?wayback=1";
};

// depending on the content class, different areas in the popup should be hidden/shown
const onContentClassFound = contentClass => {
  if (contentClass === 'srf_landingpage') {
    document.querySelector(".js-page-actions").classList.remove('section--hidden');
  } else if (contentClass === 'srf_article') {
    document.querySelector(".js-article-actions").classList.remove('section--hidden');
  }
}

// get some info about the website via content script (content id and content class)
const getContentInfo = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getContentInfo"}, ({contentId, contentClass}) => {
      if (contentId) {
        onContentIdFound(contentId);
      } else {
        // todo: no contentId found :(
      }

      if (contentClass) {
        onContentClassFound(contentClass);
      } else {
        // todo: no contentClass found :(
      }
    });
  });
}

// what to do when the extension is "opened"
const onLoad = () => {
  setBannerStateFromStorage();
  setupBannerCheckboxListener();
  getContentInfo();
};

onLoad();