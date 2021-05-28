
const addDaily = () => {
  chrome.storage.sync.get("teamSetup", ({ teamSetup }) => {
    const dailyThing = document.createElement("div"); 
    document.body.appendChild(dailyThing);
    dailyThing.className = 'srf-tools__daily';

    if (!teamSetup || teamSetup.length === 0) {
      teamSetup = [
        {
          "name": "No Team defined :(",
          "img": ""
        }
      ];
    }

    dailyThing.innerHTML = teamSetup.sort(() => Math.random() - 0.5).map(person => `
      <input type="checkbox" id="${person.name}" name="${person.name}">
      <label for="${person.name}"><img src="${person.img}" />${person.name}</label>
    `, '').join('')
    
  });
};

const removeDaily = () => {
  const dailyThing = document.getElementsByClassName('srf-tools__daily');
  if (dailyThing.length > 0) {
    dailyThing[0].remove();
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
      document.getElementsByClassName('js-compact-toggle')[0].click();
      document.getElementById('js-work-quickfilters-trigger').click();
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
chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.action == "showDailyThing")
    showDailyThing();
  }
);
