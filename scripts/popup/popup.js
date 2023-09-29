const showEnvironmentCheckbox = document.getElementById("showEnvironment");
const showDailyCheckbox = document.getElementById("showDailyThing");
const teamSelection = document.getElementById("teamSelection");

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

// get the defined team(s) from storage, add <options>, set up listener
const loadTeams = () => {
  chrome.storage.sync.get("teamsJSON", ({ teamsJSON }) => {
    if (!teamsJSON || teamsJSON.length < 1) {
      teamSelection.remove();
      return;
    }

    chrome.storage.sync.get("selectedTeamName", ({ selectedTeamName }) => {
      if (!selectedTeamName) {
        selectedTeamName = teamsJSON[0].name;
      }
      
      teamsJSON.forEach(team => {
        const option = document.createElement("option");
        option.text = team.name;
        option.value = team.name;
  
        if (team.name === selectedTeamName) {
          option.selected = true;
        }
  
        teamSelection.add(option);
      });
    });
  });


  teamSelection.addEventListener("change", async () => {
    const selectedTeamName = teamSelection.value;

    chrome.storage.sync.set({ selectedTeamName: selectedTeamName });

    // send a message to the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'selectedTeamNameChanged'
      });
    });
  });
};


// load user setting regarding daily from storage, set checkbox' state
const setDailyStateFromStorage = () => {
  chrome.storage.sync.get("showDailyThing", ({ showDailyThing }) => {
    showDailyCheckbox.checked = !!showDailyThing;
  });
}

// When the checkbox is changed, save the setting and let the content script know
const setupDailyCheckboxListener = () => {
  showDailyCheckbox.addEventListener("click", async () => {
    const showDailyThing = showDailyCheckbox.checked;

    // save the setting
    chrome.storage.sync.set({ showDailyThing: showDailyThing });

    // send a message to the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'showDailyThing'
      });
    });
  });
}

const onContentIdFound = (contentId, phase, portalUrn, businessUnit) => {
  document.getElementById('contentIdInput').value = contentId;
  
  // idea: loop over all links, replace various placeholders with the correct data:
  // $FE_URL    = https://www.srf.ch (depending on phase)
  // $NORA_URL  = https://nora.srfdigital.ch (depending on phase)
  // $ADMIN_URL = https://admin.cms.zrh.production.srf.mpc (depending on phase)
  // $ID        = contentId
  // $PORTAL    = portal, e.g. "news"
  // $BU        = business unit, i.e. "rtr" or "srf"

  let frontendUrl, noraUrl, adminUrl;

  switch (phase) {
    case 'DEV':
      frontendUrl = 'http://www.dev.srf.ch';
      noraUrl     = 'http://localhost:6900';
      adminUrl    = 'http://admin.dev.srf.mpc';
      break;
    case 'TEST':
      frontendUrl = 'https://www-test.srf.ch';
      noraUrl     = 'https://nora.dev.srfdigital.ch';
      adminUrl    = 'https://admin.cms.zrh.test.srf.mpc';
      break;
    case 'STAGE':
      frontendUrl = 'https://www-stage.srf.ch';
      noraUrl     = 'https://nora.int.srfdigital.ch';
      adminUrl    = 'https://admin.cms.zrh.stage.srf.mpc';
      break;
    case 'PROD':
    default:
      frontendUrl = 'https://www.srf.ch';
      noraUrl     = 'https://nora.srfdigital.ch';
      adminUrl    = 'https://admin.cms.zrh.production.srf.mpc';
      break;
  }

  // the links have a data attribute with the href-string that includes the placeholders
  document.querySelectorAll(".link--replace-url").forEach((element, index) => {
    let href = element.dataset.href;
    // replace all placeholders
    href = href
      .replace("$ID", contentId)
      .replace("$FE_URL", frontendUrl)
      .replace("$NORA_URL", noraUrl)
      .replace("$ADMIN_URL", adminUrl)
      .replace("$PORTAL", portalUrn.split(':').reverse()[0])
      .replace("$BU", businessUnit);
    element.href = href;
  });
};

// no content id found - show an error message and hide the input field
const onContentIdNotFound = () => {
  document.querySelector(".js-no-contentid-found").style.display = '';
  document.querySelector(".js-contentid-container").style.display = 'none';
};

const onInfoGatheringFailed = () => {
  document.querySelector(".js-contentinfo").style.display = 'none';
}

// depending on the content class, different areas in the popup should be hidden/shown
const onContentClassFound = contentClass => {
  if (contentClass === 'landingpage') {
    document.querySelector(".js-page-actions").style.display = '';
  } else if (contentClass === 'article') {
    document.querySelector(".js-article-actions").style.display = '';
  }
}

const onTickerFound = () => {
  document.querySelector(".js-ticker-link").style.display = '';
}

// get some info about the website via content script (content id and content class)
const getContentInfo = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(chrome.runtime.lastError) {
      console.log('Not a SRF page, probably?');
    }

    chrome.tabs.sendMessage(tabs[0].id, {action: "getContentInfo"}, (response) => {
      if (!response || chrome.runtime.lastError) {
        // Something went wrong
        console.log("Error!", chrome.runtime.lastError);
        onInfoGatheringFailed();
        return;
      }

      const { urn, phase, portalUrn, hasTicker, businessUnit } = response;

      if (urn) {
        const [,, contentClass, contentId] = urn.split(':');
        onContentIdFound(contentId, phase, portalUrn, businessUnit);
        onContentClassFound(contentClass);

        if (hasTicker) {
          onTickerFound();
        }

      } else {
        onContentIdNotFound();
      }
    });
  });
};

const showOrHideDevStuff = () => {
  chrome.storage.sync.get("showDeveloperStuff", ({ showDeveloperStuff }) => {
    document
      .querySelectorAll(".js-dev-only")
      .forEach(node => node.style.display = showDeveloperStuff ? '' : 'none');
  });
};

// what to do when the extension is "opened"
const onLoad = () => {
  getContentInfo();

  setBannerStateFromStorage();
  setupBannerCheckboxListener();

  setDailyStateFromStorage();
  setupDailyCheckboxListener();

  loadTeams();

  showOrHideDevStuff();
};

onLoad();