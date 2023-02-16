const onReorderingsFound = () => {
  document.querySelector(".js-reordering-found").style.display = '';
}

const onReorderingsNotFound = () => {
  document.querySelector(".js-no-reordering-found").style.display = '';
}

const debugReorderingButton = document.getElementById("debugReordering");
debugReorderingButton.addEventListener("click", async () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "showReorderingDebug"});
  });
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (chrome.runtime.lastError) {
    console.log('Not a SRF page, probably?');
  }

  chrome.tabs.sendMessage(tabs[0].id, {action: "getExperimentInfo"}, (response) => {
    if (!response || chrome.runtime.lastError) {
      // Something went wrong
      console.log("Error!", chrome.runtime.lastError);
      return;
    }

    const {nrOfCollectionsWithExperiments} = response;

    if (nrOfCollectionsWithExperiments > 0) {
      onReorderingsFound();
    } else {
      onReorderingsNotFound();
    }
  });
});
