const getContentId = () => {
  const metaNode = document.querySelector('meta[name="srf:content:id"]');

  if (metaNode) {
    return Number.parseInt(metaNode.getAttribute('content'));
  } else {
    return false;
  }
}

const getContentClass = () => {
  const metaNode = document.querySelector('meta[name="srf.content_class"]');

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

chrome.runtime.onMessage.addListener(
  (request, sender, callback) => {
    if (request.action == "getContentInfo")
      callback({
        contentId: getContentId(),
        contentClass: getContentClass(),
        phase: getPhase()
      });
  }
);
