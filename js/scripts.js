const typeScale = {};

typeScale.setUpVariables = function() {
  typeScale.htmlTagSizes = {
    p: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    small: 1
  };

  typeScale.typeRatios = {
    musical: 2,
    golden: 1.618034
  };

  typeScale.userChoices = {
    font: '',
    scale: ''
  };
};

typeScale.updateSampleText = function(font) {
  // create the html output of all our sample tags and labels, using the font parameter and the tag sizes we've calculated
  const sampleString = 
  `<h1 class="demo" style="font-size: ${typeScale.htmlTagSizes.h1}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h1>
  <p class="label">H1 size: ${typeScale.htmlTagSizes.h1} rem</p>
  <h2 class="demo" style="font-size: ${typeScale.htmlTagSizes.h2}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h2>
  <p class="label">H2 size: ${typeScale.htmlTagSizes.h2} rem</p>
  <h3 class="demo" style="font-size: ${typeScale.htmlTagSizes.h3}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h3>
  <p class="label">H3 size: ${typeScale.htmlTagSizes.h3} rem</p>
  <h4 class="demo" style="font-size: ${typeScale.htmlTagSizes.h4}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h4>
  <p class="label">H4 size: ${typeScale.htmlTagSizes.h4} rem</p>
  <h5 class="demo" style="font-size: ${typeScale.htmlTagSizes.h5}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h5>
  <p class="label">H5 size: ${typeScale.htmlTagSizes.h5} rem</p>
  <h6 class="demo" style="font-size: ${typeScale.htmlTagSizes.h6}rem; font-family: ${font};">Lorem Ipsum Dolor Sit Amet</h6>
  <p class="label">H6 size: ${typeScale.htmlTagSizes.h6} rem</p>
  <p class="demo" style="font-size: ${typeScale.htmlTagSizes.p}rem; font-family: ${font};">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad pariatur consequatur maiores illo quos sapiente omnis iste nostrum eos quis ipsa sed, eius saepe voluptatem voluptatibus animi recusandae molestias molestiae voluptatum tempore? Nemo aliquam mollitia quae hic quis tenetur consectetur necessitatibus deserunt reprehenderit, inventore quos totam, tempore molestias facilis animi.</p>
  <p class="label">Body copy (p tag) size: ${typeScale.htmlTagSizes.p} rem</p>
  <p class="demo" style="font-size: ${typeScale.htmlTagSizes.small}rem; font-family: ${font};">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  <p class="label">Small copy (captions, labels) size: ${typeScale.htmlTagSizes.small} rem</p>`;
  return sampleString;
};

typeScale.updateFontSizes = function(chosenScale) {
  //the choice of scale determines the ratio used in the math
  const ratio = typeScale.typeRatios[chosenScale];
  // use the ratio to set the sizes of each html element
  typeScale.htmlTagSizes.small = ratio * (1 / 3);
  typeScale.htmlTagSizes.p = ratio * (2 / 3);
  typeScale.htmlTagSizes.h6 = ratio * (3 / 3);
  typeScale.htmlTagSizes.h5 = ratio * (4 / 3);
  typeScale.htmlTagSizes.h4 = ratio * (5 / 3);
  typeScale.htmlTagSizes.h3 = ratio * (6 / 3);
  typeScale.htmlTagSizes.h2 = ratio * (7 / 3);
  typeScale.htmlTagSizes.h1 = ratio * (8 / 3);
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