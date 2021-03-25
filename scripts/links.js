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

chrome.runtime.onMessage.addListener(
  (request, sender, callback) => {
    if (request.action == "getContentInfo")
      callback({
        contentId: getContentId(),
        contentClass: getContentClass()
      });
  }
);
