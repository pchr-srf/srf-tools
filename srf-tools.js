document.addEventListener('DOMContentLoaded', () => {
    let fillInContentId = (data) => {
        // Put location in input
        document.getElementById('contentIdInput').value = data.locationId;

        // create URLs for article variations
        document.querySelectorAll(".link--replace-url").forEach((element, index) => {
            let href = element.dataset.href;
            element.href = href.replace("$ID", data.locationId).replace("$URL", data.origin);
        });

        document.querySelector(".link--old-url").href = data.url + "?wayback=1";

    };

    chrome.tabs.executeScript({
        code: `
        var data = {
            locationId: document.querySelector("[data-content-id]").dataset.contentId,
            origin: window.location.origin,
            url: window.location.href
        };
        data`
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
