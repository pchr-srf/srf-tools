const getUrn = () => {
  const metaNode = document.querySelector('meta[name="srf:urn"]');

  if (metaNode) {
    return metaNode.getAttribute('content');
  } else {
    return false;
  }
}

const getPhase = () => {
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

const getPortalUrn = () => {
  const metaNode = document.querySelector('meta[name="srf:portal:urn"]');

  if (metaNode) {
    return metaNode.getAttribute('content');
  } else {
    return false;
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, callback) => {
    if (request.action == "getContentInfo") {
      callback({
        urn: getUrn(),
        phase: getPhase(),
        portalUrn: getPortalUrn(),
      });
    }
  }
);
