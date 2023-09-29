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

const getTicker = () => {
  const tickerNode = document.querySelector('article .article-content #ticker');
  return !!tickerNode;
};

const getBusinessUnit = () => {
  const host = window.location.host;
  if (host.endsWith('rtr.ch')) {
    return 'rtr';
  } else if (host.endsWith('srf.ch')) {
    return 'srf';
  }
};

chrome.runtime.onMessage.addListener(
  (request, sender, callback) => {
    if (request.action == "getContentInfo") {
      callback({
        urn: getUrn(),
        phase: getPhase(),
        portalUrn: getPortalUrn(),
        hasTicker: getTicker(),
        businessUnit: getBusinessUnit(),
      });
    }
  }
);
