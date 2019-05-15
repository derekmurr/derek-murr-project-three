const typeScale = {};

typeScale.setUpVariables = function() {
  typeScale.htmlTagSizes = [
    // { tag: 'p', fontSize: 1},
    { tag: 'p', fontSize: 0 },
    { tag: 'h6', fontSize: 0 },
    { tag: 'h5', fontSize: 0 },
    { tag: 'h4', fontSize: 0 },
    { tag: 'h3', fontSize: 0 },
    { tag: 'h2', fontSize: 0 },
    { tag: 'h1', fontSize: 0 }
  ];

  typeScale.typeRatios = {
    majSecond: 1.125,
    majThird: 1.250,
    augFourth: 1.414,
    golden: 1.618
  };

  typeScale.userChoices = {
    font: '',
    scale: ''
  };
};

typeScale.updateSampleText = function(font) {
  // tag sizes array is calculated from smallest to biggest, but we want to display it to the user from biggest to smallest, so let's make a working duplicate of that array 
  let sampleArray = typeScale.htmlTagSizes;
  
  // create the html output of all our sample tags and labels, using the font parameter and the tag sizes we've calculated
  // a new array that will hold the string defining each html element
  let textArray = [];
  sampleArray.forEach( htmlTag => {
    // for each item in our tag sizes array, add a string to our text array with the right text and values
    textArray.push(`<${htmlTag.tag} class="demo" style="font-size: ${htmlTag.fontSize}rem; font-family: ${font};">Lorem ipsum dolor sit amet</${htmlTag.tag}><p class="label">${htmlTag.tag} size: ${htmlTag.fontSize} rem</p>`);
  });
  // reverse that text array so it goes from biggest to smallest
  textArray.reverse();

  // flatten that text array so it's one big string
  const sampleString = textArray.reduce((finalString, currentString) => {
    return finalString + currentString;
  });
  
  // return our html output to be added to the DOM
  return sampleString;
};

typeScale.updateFontSizes = function(chosenScale) {
  //the choice of scale determines the ratio used in the math
  const ratio = typeScale.typeRatios[chosenScale];

  // use the ratio to set the sizes of each html element  
  for (let i = 0; i < typeScale.htmlTagSizes.length; i++) {
    // typeScale.htmlTagSizes[i].fontSize = (ratio * ( (i + 1) / typeScale.htmlTagSizes.length) + 0.5 ).toFixed(2);
    if (i === 0) {
      // our base size: 1 rem
      typeScale.htmlTagSizes[i].fontSize = 1;
    } else {
      // current size = the previous size multiplied by the ratio, rounded to two decimals
      typeScale.htmlTagSizes[i].fontSize = (typeScale.htmlTagSizes[i - 1].fontSize * ratio ).toFixed(2);
    }
  }
}

typeScale.displaySample = function(font) {
  // grab the sample-text div and add the html to it that's returned from the update sample text method
  $('#sample-text').html(typeScale.updateSampleText(font));
};


typeScale.updateUserChoices = function(selectionType, selection) {
  // put that selected value in the appropriate attribute of our userChoices object
  if (selectionType === 'font') {
    typeScale.userChoices.font = selection;
  } else if (selectionType === 'scale') {
    typeScale.userChoices.scale = selection;
  }
  // if the user has selected both options, we have enough info to update and display our sample text
  if (typeScale.userChoices.font !== '' && typeScale.userChoices.scale !== '') {
    //run the update font sizes method, passing it the choice of scale
    typeScale.updateFontSizes(typeScale.userChoices.scale);
    typeScale.displaySample(typeScale.userChoices.font);
  }
};

// set up our event handlers on the two dropdown menus
typeScale.registerEvents = function() {
  // we'll do this on change so there's no need for a submit button
  $('.choice-dropdown').on('change', function() {
    // grab the value of the menu that's changed
    let userSelection = $(this).val();
    // pass the val and selection type to our update function
    typeScale.updateUserChoices( $(this).attr('data-choice-type'), userSelection );
  });
};

// so far all this does is run the function to set up event handlers & initialize our variables
typeScale.init = function() {
  typeScale.setUpVariables();
  typeScale.registerEvents();
}

// document ready, run the init function
$( function() {
  typeScale.init();
});