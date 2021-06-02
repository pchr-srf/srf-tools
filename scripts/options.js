const showDevStuffCheckbox = document.getElementById("showDeveloperStuff");

const showFeedbackCheckbox = document.getElementById("showFeedbackForm");

const teamSetupTextArea = document.getElementById("teamSetup");
const teamSetupSection = document.getElementById("js-team-setup-section");
const resetTeamSetupBtn = document.getElementById("js-use-default-team");
const defaultTeams = [
  {
    "name": "Ivory",
    "members": [
      {
        "name": "Alexej",
        "img": "https://ca.slack-edge.com/T026NDFG3-U45LG5VMX-81b95e566a7b-48"
      },
      {
        "name": "Caro",
        "img": "https://ca.slack-edge.com/T026NDFG3-U026NKTJP-489226d761c5-48"
      },
      {
        "name": "Claudio",
        "img": "https://ca.slack-edge.com/T026NDFG3-U026RF3EJ-bf3642dff95b-48"
      },
      {
        "name": "Hasan",
        "img": "https://ca.slack-edge.com/T026NDFG3-U08J673RN-7f9fe51ba6f2-48"
      },
      {
        "name": "Joel (PO)",
        "img": "https://ca.slack-edge.com/T026NDFG3-U04AX95JM-81683c336a6f-48"
      },
      {
        "name": "Joel (SM)",
        "img": "https://ca.slack-edge.com/T026NDFG3-UMX8Z7GA0-d9d1a8e63883-48"
      },
      {
        "name": "Misch",
        "img": "https://ca.slack-edge.com/T026NDFG3-U39TJL7N3-f1f839b4a0bc-48"
      },
      {
        "name": "Pascal",
        "img": "https://ca.slack-edge.com/T026NDFG3-U026NR0JS-aff666d5d0d7-48"
      },
      {
        "name": "Patrick",
        "img": "https://ca.slack-edge.com/T026NDFG3-U026NQPG1-5d287676eddb-48"
      },
      {
        "name": "Phil",
        "img": "https://ca.slack-edge.com/T026NDFG3-U277M8CG0-e2db4505a3ad-48"
      },
      {
        "name": "Stefan",
        "img": "https://ca.slack-edge.com/T026NDFG3-U02N61YF8-560795681709-48"
      },
      {
        "name": "Urban",
        "img": "https://ca.slack-edge.com/T026NDFG3-U026NDFG5-g2a08a44007d-48"
      }
    ]
  },
  {
    "name": "Cobalt",
    "members": [
      {
        "name": "Gianni",
        "img": "https://ca.slack-edge.com/T026NDFG3-U027VC5K2-g419178991e8-48"
      },
      {
        "name": "Kierthanan",
        "img": "https://ca.slack-edge.com/T026NDFG3-UGUL6CV0S-2e16ad3219e6-48"
      },
      {
        "name": "Luzius",
        "img": "https://ca.slack-edge.com/T026NDFG3-U56MSCFFT-b6733e2faca1-48"
      },
      {
        "name": "Martina",
        "img": "https://ca.slack-edge.com/T026NDFG3-U028YK32V-88ddfb2e6269-48"
      },
      {
        "name": "Roman",
        "img": "https://ca.slack-edge.com/T026NDFG3-U02MRRJ6K-9690c5de1c57-48"
      },
      {
        "name": "Simon",
        "img": "https://ca.slack-edge.com/T026NDFG3-U0DL8DTNF-8bd9712d9744-48"
      },
      {
        "name": "Nils",
        "img": "https://ca.slack-edge.com/T026NDFG3-U0EF40M08-8758b6519834-48"
      },
      {
        "name": "Joel (SM)",
        "img": "https://ca.slack-edge.com/T026NDFG3-UMX8Z7GA0-d9d1a8e63883-48"
      }
    ]
  }
];

// load user settings, set checkboxes' states
const setOptionsFromStorage = () => {
  chrome.storage.sync.get("showDeveloperStuff", ({ showDeveloperStuff }) => {
    showDevStuffCheckbox.checked = !!showDeveloperStuff;
  });

  chrome.storage.sync.get("showFeedbackForm", ({ showFeedbackForm }) => {
    showFeedbackCheckbox.checked = !!showFeedbackForm;
  });

  chrome.storage.sync.get("teamsJSON", ({ teamsJSON }) => {
    teamSetupTextArea.value = JSON.stringify(teamsJSON, undefined, 2);
  });
};

const setupInputListeners = () => {
  showDevStuffCheckbox.addEventListener("click", async () => {
    chrome.storage.sync.set({ showDeveloperStuff: showDevStuffCheckbox.checked });
  });
  
  showFeedbackCheckbox.addEventListener("click", async () => {
    chrome.storage.sync.set({ showFeedbackForm: showFeedbackCheckbox.checked });
  });

  resetTeamSetupBtn.addEventListener("click", async () => {
    teamSetupTextArea.value = JSON.stringify(defaultTeams, undefined, 2);
    teamSetupSection.classList.remove('teamSetup--invalid');
    const parsedText = JSON.parse(teamSetupTextArea.value);
    chrome.storage.sync.set({
      teamsJSON: parsedText
    });
  });

  teamSetupTextArea.addEventListener("change", async() => {
    teamSetupSection.classList.remove('teamSetup--invalid');

    // JSON might be invalid
    try {
      const parsedText = JSON.parse(teamSetupTextArea.value);
      chrome.storage.sync.set({
        teamsJSON: parsedText
      });
    } catch (error) {
      teamSetupSection.classList.add('teamSetup--invalid');
    }
  });
};

// what to do when the options page is opened
const onLoad = () => {
  setOptionsFromStorage();
  setupInputListeners();
};

onLoad();