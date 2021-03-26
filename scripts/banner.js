const getPhaseForBanner = () => {
  const url = window.location.href;
  if(url.indexOf('www-test.') >= 0) {
    return 'TEST';
  } else if (url.indexOf('www-stage.') >= 0) {
    return 'STAGE';
  } else if (url.indexOf('dev.') >= 0 || url.indexOf('pascal.') >= 0) {
    return 'DEV';
  } else {
    return 'PROD';
  }
};

const addBanner = () => {
  const banner = document.createElement("div"); 
  document.body.appendChild(banner); 
  banner.innerText = getPhaseForBanner();
  banner.className = 'srf-tools__banner';
};

const removeBanner = () => {
  const banner = document.getElementsByClassName('srf-tools__banner');
  if (banner.length > 0) {
    banner[0].remove();
  }
};

const showEnvironmentBadge = () => {
  chrome.storage.sync.get("shouldShowEnvironment", ({ shouldShowEnvironment }) => {
    // prevent duplicating the banner by removing it first, then adding it if the
    // settings demand it
    removeBanner();

    if (shouldShowEnvironment) {
      addBanner();
    }
  });
}

// do the dance on page load
showEnvironmentBadge();

// do the thing on hash/page change
window.onhashchange = function() { 
	showEnvironmentBadge();
}

// do the thing when receiving a message from the extension
chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.action == "showEnvironmentBadge")
      showEnvironmentBadge();
  }
);
