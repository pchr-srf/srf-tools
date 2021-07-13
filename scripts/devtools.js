chrome.devtools.panels.create(
    '📺 SRF Bridge',
    '',
    '../html/bridge-panel.html',
    extensionPanel => {
      extensionPanel.onShown.addListener(panel => {

        panel.document.getElementById('my-title').addEventListener('click', () => {
            panel.document.getElementById('my-title').innerHTML = "UPDATE";
            chrome.devtools.inspectedWindow.eval('console.log(\'Hello there\')');
          });
      });

    },
  );
