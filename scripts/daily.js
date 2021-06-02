
const addDaily = () => {
  chrome.storage.sync.get("teamsJSON", ({ teamsJSON }) => {
    const dailyThing = document.createElement("div"); 
    document.body.appendChild(dailyThing);
    dailyThing.className = 'srf-tools__daily';

    if (!teamsJSON || teamsJSON.length === 0) {
      alert('No teams defined - check the extension\'s settings!');
      return;
    }

    setJiraFullscreen(true);

    chrome.storage.sync.get("selectedTeamName", ({ selectedTeamName }) => {
      if (!selectedTeamName) {
        selectedTeamName = teamsJSON[0].name;
      }

      const teamSetup = teamsJSON.find(team => team.name === selectedTeamName).members;

      // create and shuffle team members
      dailyThing.innerHTML = teamSetup.sort(() => Math.random() - 0.5).map(person => `
        <input type="checkbox" id="${person.name}" name="${person.name}">
        <label for="${person.name}"><img src="${person.img}" />${person.name}</label>
      `, '').join('');
    });
    
  });
};

const setJiraFullscreen = (fullscreen) => {
  try {
    if (fullscreen) {
      document.body.classList.add('ghx-header-compact');
      document.getElementById('js-work-quickfilters').setAttribute('aria-expanded', false);
    } else {
      document.body.classList.remove('ghx-header-compact');
      document.getElementById('js-work-quickfilters').setAttribute('aria-expanded', true);
    }
  } catch (error) {}
}

const removeDaily = () => {
  const dailyThing = document.getElementsByClassName('srf-tools__daily');
  if (dailyThing.length > 0) {
    dailyThing[0].remove();
    setJiraFullscreen(false);
  }
};

const showDailyThing = () => {
  chrome.storage.sync.get("showDailyThing", ({ showDailyThing }) => {
    // prevent duplicating the daily thing by removing it first, then adding it if the
    // settings demand it
    removeDaily();

    if (showDailyThing) {
      addDaily();
    }

    // show more of the JIRA board
    try {
      //document.getElementsByClassName('js-compact-toggle')[0].click();
      //document.getElementById('js-work-quickfilters-trigger').click();
    } catch (error) {}
  });
};

// do the dance on page load
showDailyThing();

// do the thing on hash/page change
window.onhashchange = function() { 
  showDailyThing();
}

// do the thing when receiving a message from the extension
chrome.runtime.onMessage.addListener(request => {
  const action = request.action;

  if (action == "showDailyThing" || action == "selectedTeamNameChanged") {
    showDailyThing();
  }
});
