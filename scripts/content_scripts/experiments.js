const originalVariationUrn = 'urn:srf:variation:original';
const showReorderingDebug = () => {
  // the following code is copied from experiments.html.twig
  // not sure how to easily make it accessible to this extension
  // (minus the tracking)
  function triggerListeners() {
    const event = new Event("srf.teaser.show");
    document.dispatchEvent(event);
  }

  function getOrMakeAssignment(experimentUrn) {
    const localStorageValue = localStorage.getItem(experimentUrn);

    if (localStorageValue === null) {
      const num = Math.random();
      localStorage.setItem(experimentUrn, JSON.stringify(num));
      return num;
    } else {
      return JSON.parse(localStorageValue);
    }
  }

  function getVariation(variations, assignment) {
    let chosenVariation = null;
    let counter = 0;
    variations.forEach(variation => {
      if (counter <= assignment && assignment <= counter + variation.probability) {
        chosenVariation = variation;
      }
      counter += variation.probability;
    });

    return chosenVariation;
  }

  function applyVariation(variation, collection) {
    if (!!variation.reorder) {
      reorder(variation.reorder, collection);
    }
  }

  function reorder(newOrder, collection) {
    const listWrapper = collection.querySelector('.js-teaser-ng-list');
    let newList = document.createDocumentFragment();

    newOrder.forEach(function(teaserUrn) {
      const teaser = collection.querySelector(`.js-teaser-ng[data-urn="${teaserUrn}"]`);
      if (teaser) {
        newList.appendChild(teaser.parentElement.cloneNode(true));
      }
    });

    listWrapper.innerHTML = null;
    listWrapper.appendChild(newList);
  }
  
  // remove old helpers
  document.querySelectorAll(".experiment-info").forEach(el => el.remove());
  
  
  document.querySelectorAll('[data-experiments]').forEach((coll) => {
    const data = coll.dataset.experiments;
    if (!data) {return;}
  
    const fragment = document.createDocumentFragment();
    const wrapper = fragment.appendChild(document.createElement('section'));
    wrapper.style.backgroundColor = 'white';
    wrapper.style.padding = '16px';
    wrapper.className = 'experiment-info';
  
    const experiments = JSON.parse(data);
    experiments.forEach(experiment => {
      const assignment = getOrMakeAssignment(experiment.urn);
      const chosenVariation = getVariation(experiment.variations, assignment);
    
      const experimentTitle = wrapper.appendChild(document.createElement('h4'));
      experimentTitle.textContent = 'Experiment ' + experiment.urn + ' (Assignment: ' + assignment + ')';
  
      const experimentLead = wrapper.appendChild(document.createElement('p'));
      experimentLead.textContent = 'Variationen:';
  
      let counter = 0;
      experiment.variations.forEach(variation => {
        const variationTitle = wrapper.appendChild(document.createElement('p'));
        variationTitle.textContent = '(' + (variation.probability * 100) + '%) ' + variation.urn + ' ';
        
        if (variation.urn === chosenVariation?.urn) {
          variationTitle.textContent += '(aktiv)';
        } else {
          const button = variationTitle.appendChild(document.createElement('button'));
          const newNumber = JSON.stringify(counter + 0.0000001);
          button.textContent = 'Aktivieren';
          
          button.addEventListener("click", () => {
            localStorage.setItem(experiment.urn, newNumber);
            applyVariation(variation, coll);
            showReorderingDebug();
          });
        }
        counter += variation.probability;
      });
    });
  
    coll.appendChild(fragment);
  });

  triggerListeners();
}

const onGetExperimentInfo = (callback) => {
  const collectionsWithExperiments = document.querySelectorAll('[data-experiments]');

  callback({
    nrOfCollectionsWithExperiments: collectionsWithExperiments.length
  });
}

chrome.runtime.onMessage.addListener(
  (request, sender, callback) => {
    switch (request.action) {
      case 'getExperimentInfo':
        onGetExperimentInfo(callback);
        break;
      case 'showReorderingDebug':
        showReorderingDebug();
      default:
        // we don't care about this message, bye.
        break;
    }
  }
);
