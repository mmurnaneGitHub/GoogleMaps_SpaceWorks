    //Simulate mouse clicks for testing web page

   function simulateButtonClick(element) {
     var promise = new Promise(function(resolve, reject) { // do async operation and process the result
       console.error('Clicking ...', element);
       try {
         if (element == 'Search') {
           document.getElementById('search_input').value = '747 Market St';  //places in input box

            document.getElementById("search_input").focus();  //set focus first
            console.error('MANUAL TEST 1: NEED TO HIT ENTER TO COMPLETE GEOCODING!');


            setTimeout(function() {
            document.getElementById("search_input").focus();  //set focus first
           //11/30 test
             /*
             const event = new KeyboardEvent('keyup', {
               key: 'Enter',
             });
             */
             //const event = new KeyboardEvent('keydown', { keyCode: 13, which: 13 });
             //const event = new KeyboardEvent('keydown', { bubbles: true, keyCode: 13, which: 13 });
             //const event = new KeyboardEvent('keypress', { bubbles: true, keyCode: 13, which: 13 });
             const event = new KeyboardEvent('keyup', { bubbles: true, keyCode: 13, which: 13 });

             //document.querySelector('[id="search_input"]').dispatchEvent(event);
             document.querySelector('[id="search"]').dispatchEvent(event);

			}, 8000); //Leave enough time to see

           //CLICK CLOSE ON POPUP BEFORE STARTING MAP EVENTS

           setTimeout(simulateMapEvents, 4000); //Leave enough time to see the popup before closing
	         } else {
	         	element.click(); //Simulate mouse click on element
	         }

         
         setTimeout(function() {
           resolve('Done!'); //nothing to return
         }, 4000); //Wait 4 seconds for next DOM element to be available before moving on 
       } catch (error) {
         alert('Element ' + element + ' had the follow problem: \n' + error);
       }
     });
     return promise;
   }

   function simulateMapEvents() {
     console.error('Starting map events ...');
     var panNumber = 0;
     console.error('Panning up ...');
     app.map.panUp(); //Map defined in js/council.js
     app.map.on("pan-end", function(evt) {
       panNumber++;
       if (panNumber < 2) {
         console.error('Panning down ...');
         app.map.panDown();
       }
       if (panNumber == 2) {
	     console.error('MANUAL TEST 2: NEED TO CLICK MAP!');
	     console.error('Automated testing done!');
       }
     });
   }

   function processArray(array, fn) {
     var index = 0;
     function next() {
       if (index < array.length) {
         fn(array[index++]).then(next); //Promises chained together - synchronize a sequence of promises with .then, don't run the next widget test until the previous test has finished
       } else {
       	 //console.error('Testing done!');
       }
     }
     next(); //start looping through array
   }

   setTimeout(function() {
     console.error('Waiting a specific time for page to be ready ...');
     var testElementsArray = []; //Array of items by ID to click
	     testElementsArray.push(document.querySelector('[title="Zoom Out"]'));  //Zoom Out button
	     testElementsArray.push(document.querySelector('[title="Find my location"]'));  //Geolocate button
	     testElementsArray.push(document.querySelector('[title="Default extent"]'));  //Home In button
	     testElementsArray.push(document.querySelector('[title="Zoom In"]'));  //Zoom In button
	     testElementsArray.push(document.querySelector('[title="Toggle Basemap"]'));  //Basemap In button
	     testElementsArray.push("Search");  //Geocode search
     processArray(testElementsArray, simulateButtonClick); //Run a async operation on each item in array, but one at a time serially such that the next operation does not start until the previous one has finished.
   }, 10000);
