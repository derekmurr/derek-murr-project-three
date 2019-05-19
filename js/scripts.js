const typeScale = {};

typeScale.setUpVariables = () => {
  typeScale.htmlTagSizes = [
    { tag: 'p', fontSize: 0, class: 'small' },
    { tag: 'p', fontSize: 0, class: 'p' },
    { tag: 'h6', fontSize: 0, class: 'h6' },
    { tag: 'h5', fontSize: 0, class: 'h5' },
    { tag: 'h4', fontSize: 0, class: 'h4' },
    { tag: 'h3', fontSize: 0, class: 'h3' },
    { tag: 'h2', fontSize: 0, class: 'h2' },
    { tag: 'h1', fontSize: 0, class: 'h1' }
  ];

  typeScale.typeRatios = {
    minSecond: 1.067,
    majSecond: 1.125,
    minThird: 1.200,
    majThird: 1.250,
    perFourth: 1.333,
    augFourth: 1.414,
    golden: 1.618
  };

  typeScale.userChoices = {
    font: '',
    scale: ''
  };

  typeScale.cssOutput = ``;

  typeScale.apiKey = env.key;
  typeScale.endpoint = env.endpoint;
};

// AJAX call to get the most up-to-date list of available Google Fonts
typeScale.getFontList = () => {
  $.ajax({
    url: typeScale.endpoint,
    method: 'GET',
    dataType: 'json',
    data: {
      key: typeScale.apiKey
    }
  })
    .then((fontList) => {
      typeScale.buildFontMenu(fontList.items);
    });
};

// using the array of fonts from the google fonts object, add all the font menu options
typeScale.buildFontMenu = (fontArray) => {
  const $menu = $('#font-choice');
  fontArray.forEach((fontObject) => {
    $($menu).append(`<option value="${fontObject.family}">${fontObject.family}</option>`);
  });
};

// set up our event handlers on the two dropdown menus & the 'get started' & 'get css' buttons
typeScale.registerEvents = () => {
  // we'll do this on change so there's no need for a submit button
  $('.choice-dropdown').on('change', function () {
    // grab the value of the menu that's changed
    let userSelection = $(this).val();
    // pass the val and selection type to our update function
    typeScale.updateUserChoices($(this).attr('data-choice-type'), userSelection);
  });

  // event handler for the let's get started button
  $('#button-begin').on('click', function () {
    $('#intro').fadeOut(function() {
      $('#tips').fadeIn(function() {
        $('#sample-block').fadeIn();
      });
    });
  });

  $('#button-get-css').on('click', function () {
    typeScale.animateCSS('#button-get-css', 'jello');
    typeScale.copyToClipboard(typeScale.cssOutput);
  })
};

// handle the bounce animation when clicking the 'get css' button
typeScale.animateCSS = (element, animationName) => {
  // toggle the bounce animation for the 'get css' button
  // function from the docs of animate.css, https://github.com/daneden/animate.css
  const node = document.querySelector(element);
  node.classList.add('animated', animationName);
  
  // wait for the animation to end, then remove the css style and the event listener
  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);

    //also, once the animation ends, briefly show a message saying that the css was copied
    $('#copied-success-message').fadeIn('fast', function () {
      setTimeout(function () {
        $('#copied-success-message').fadeOut('fast');
      }, 3000);
    });

    node.removeEventListener('animationend', handleAnimationEnd);
  }
  
  node.addEventListener('animationend', handleAnimationEnd);
};

// functionality for the 'get css' button
typeScale.copyToClipboard = (string) => {
  //copy to clipboard function from Angelos Chalaris, hackernoon.com
  const element = document.createElement('textarea');
  element.value = string;
  element.setAttribute('readonly', '');
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
};

// adds the user's selected font to the page stylesheet so it loads & displays
typeScale.loadGoogleFont = (chosenFont) => {
  let newURL = ``;
  // grab the existing url from our google fonts stylesheet link
  let fontURL = $('link[data-link-type="gfonts"]').attr('href');
  // regex to check if the existing URL has a google font already added - it's between | and &display=swap, excluding it from Lato, already loaded as our app's body text
  const re = /(\|)(.*?)(\&)/g;
  if (re.exec(fontURL)) {
    // if there's a match, then replace what's between | and & with the new choice
    newURL = fontURL.replace(re, `|${chosenFont}&`);
  } else {
    // if no match, then we're free to just append the added font to the url string
    newURL = fontURL + `|${chosenFont}&display=swap`;
  }
  // update our google fonts stylesheet link with our new url specifying the new font
  $('link[data-link-type="gfonts"]').attr('href', newURL);
}

// runs when dropdown menus register a selection
typeScale.updateUserChoices = (selectionType, selection) => {
  // put that selected value in the appropriate attribute of our userChoices object
  if (selectionType === 'font') {
    typeScale.userChoices.font = selection;
  } else if (selectionType === 'scale') {
    typeScale.userChoices.scale = selection;
  }
  // if the user has selected both options, we have enough info to update and display our sample text
  if (typeScale.userChoices.font !== '' && typeScale.userChoices.scale !== '') {
    // amend our google stylesheet link to load the requested font
    typeScale.loadGoogleFont(typeScale.userChoices.font);
    // run the update font sizes method, passing it the choice of scale
    typeScale.updateFontSizes(typeScale.userChoices.scale);
  }
};

// the one that does the math: changes the rem values for each sample font
typeScale.updateFontSizes = (chosenScale) => {
  //the choice of scale determines the ratio used in the math
  const ratio = typeScale.typeRatios[chosenScale];

  // use the ratio to set the sizes of each html element  
  for (let i = 0; i < typeScale.htmlTagSizes.length; i++) {
    // current size = the chosen scale ratio, to the power of the current size factor, rounded to two decimals
    // it's i - 1 because our body copy is second in the array, and we want it to always be 1rem, so it should have a scale factor of zero, while we want the first array item to be a smaller size option, so its scale factor is negative.
    typeScale.htmlTagSizes[i].fontSize = (Math.pow(ratio, i-1) ).toFixed(2);
  }

  // update our css to reflect the new font sizes
  typeScale.updateCSS();
};

// updates the sample fonts css for output to the clipboard
typeScale.updateCSS = () => {
  let tagArray = typeScale.htmlTagSizes;
  let cssArray = [];
  tagArray.forEach( htmlTag => {
    cssArray.push(`${htmlTag.tag}.demo-${htmlTag.class} {\nfont-size: ${htmlTag.fontSize}rem;\n}\n\n`);
  });
  
  const cssString = cssArray.reduce((finalString, currentString) => {
    return finalString + currentString;
  });
  typeScale.cssOutput = cssString;

  // run the display sample method to actually show our computed sample text
  typeScale.displaySample(typeScale.userChoices.font);
};

// triggers showing our sample text
typeScale.displaySample = (font) => {
  // if it's not already visible, show the 'get css' button
  $('#button-get-css').removeClass('hidden');

  // grab the sample-text div and add the html to it that's returned from the update sample text method
  typeScale.updateSampleText();
};

// actually updates the dom elements that contain our displayed sample text
typeScale.updateSampleText = () => {
  // tag sizes array is calculated from smallest to biggest, but we want to display it to the user from biggest to smallest, so let's make a working duplicate of that array 
  let tagArray = typeScale.htmlTagSizes;

  // a new array that will hold a string for each html element
  let outputTextArray = [];
  tagArray.forEach(htmlTag => {
    // for each item in our tag sizes array, add a string to our text array with the right text and values
    outputTextArray.push(`<li class="label-box"><p class="sample-label">${htmlTag.tag}: ${htmlTag.fontSize} rem</p></li><li class="sample-text-box"><${htmlTag.tag} class="demo demo-${htmlTag.class}">Lorem ipsum dolor sit amet</${htmlTag.tag}></li>`);
  });
  // reverse that text array so it goes from biggest to smallest, ie, the order we want the sample to display
  outputTextArray.reverse();

  // flatten that text array so it's one big string
  const sampleString = outputTextArray.reduce((finalString, currentString) => {
    return finalString + currentString;
  });

  // add our html output to the DOM
  $('#sample-text').html(sampleString);

  // apply our updated CSS to those new HTML elements
  typeScale.applyCSS(tagArray);
};

// updates the css variables that hold the sample font choice and sizes
typeScale.applyCSS = (tagArray) => {
  const $html = $('html');
  $($html).css(`--demo-font-family`, typeScale.userChoices.font);
  tagArray.forEach(tag => {
    $($html).css(`--demo-font-size-${tag.class}`, `${tag.fontSize}rem`);
  });
};

// set up event handlers & initialize our variables
typeScale.init = () => {
  typeScale.setUpVariables();
  typeScale.getFontList();
  typeScale.registerEvents();
}

// document ready, run the init function
$( function() {
  typeScale.init();
});