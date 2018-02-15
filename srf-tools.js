document.addEventListener('DOMContentLoaded', () => {
    let contentIdInput = document.getElementById('contentIdInput');
    let urls = document.querySelectorAll(".links a");

    let fillInContentId = (data) => {
        contentIdInput.value = data.id;

        urls.forEach((element, index) => {
            let href = element.dataset.href;
            element.href = href.replace("$ID", data.id).replace("$URL", data.url);
        });
    };

    chrome.tabs.executeScript({
        code: 'var data = {id: document.querySelector("[data-content-id]").dataset.contentId, url: window.location.origin}; data'
    }, (results) => {
        if (results.length > 0 && results[0]) {
            let returnObject = results[0];
            fillInContentId(returnObject);
        } else {
            document.querySelector("#container").style.display = "none";
            document.querySelector("#notOnAValidUrl").style.display = "block";
        }
    });
});
