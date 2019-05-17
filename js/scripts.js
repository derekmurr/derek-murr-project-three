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
};

// set up our event handlers on the two dropdown menus, the 'get started' button & the 'get css' button
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

typeScale.animateCSS = (element, animationName) => {
  // toggle the bounce animation for the 'get css' button
  // function from the docs of animate.css, https://github.com/daneden/animate.css
  const node = document.querySelector(element);
  node.classList.add('animated', animationName);
  
  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);
    console.log(node.classList);
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
    // run the update font sizes method, passing it the choice of scale
    typeScale.updateFontSizes(typeScale.userChoices.scale);
  }
};

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

typeScale.displaySample = (font) => {
  // if it's not already visible, show the 'get css' button
  $('#button-get-css').removeClass('hidden');

  // grab the sample-text div and add the html to it that's returned from the update sample text method
  typeScale.updateSampleText();
};

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

typeScale.applyCSS = (tagArray) => {
  const $html = $('html');
  $($html).css(`--demo-font-family`, typeScale.userChoices.font);
  tagArray.forEach(tag => {
    $($html).css(`--demo-font-size-${tag.class}`, `${tag.fontSize}rem`);
  });
};

// all this does is run the function to set up event handlers & initialize our variables
typeScale.init = () => {
  typeScale.setUpVariables();
  typeScale.registerEvents();
}

// document ready, run the init function
$( function() {
  typeScale.init();
});