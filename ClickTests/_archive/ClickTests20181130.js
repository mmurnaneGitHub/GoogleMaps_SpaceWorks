    //Simulate mouse clicks for testing web page

   function simulateButtonClick(element) {
     var promise = new Promise(function(resolve, reject) { // do async operation and process the result
       console.error('Clicking ...', element);
       try {
         if (element == 'Search') {
           document.getElementById('search_input').value = '747 Market St';  //places in input box

            document.getElementById("search_input").focus();  //set focus first

           const event = new Event('input', {
             keyCode: 13,
             bubbles: true
           });


           //document.getElementById('search_input').dispatchEvent(event); //Manually trigger an input event (enter)
           window.dispatchEvent(event); //test - hit enter key now that focus on input box
            

           /*
           setTimeout(function() {
             console.error('here');
             const ev = new KeyboardEvent("keypress", {
               view: window,
               keyCode: 13,
               bubbles: true,
               cancelable: true
             });
             //document.getElementById('search_input').dispatchEvent(ev); //TEST - Manually trigger an input event (enter)
             document.getElementById('search').dispatchEvent(ev); //TEST - Manually trigger an input event (enter)
           }, 8000); //Leave enough time to see
           */

            //document.getElementById('search_input').form.submit();  //test - null
            //document.getElementById('search_input').submit();  //test - not a function
            //document.getElementById('search').form.submit();  //test - undefined

            setTimeout(function() {
            document.getElementById("search_input").focus();  //set focus first
            /*
            //var input = document.querySelector('[id="search_input"]')
            //var input = document.querySelector('[id="search"]')
            //var input = document.getElementById("search");
            var input = document.getElementById("search_input");
			var ev = document.createEvent('Event');
			ev.initEvent('keypress');
			ev.which = ev.keyCode = 13;
			input.dispatchEvent(ev);  //sIMULATE ENTER ON INPUT BOX - NOT WORKING for id=search or id=search_input (no error) | 
			*/

			//var evt = new KeyboardEvent('keydown', {'keyCode':13, 'which':13});
			var evt = new KeyboardEvent('keydown', {'keyCode':13});
				//document.querySelector('[id="search_input"]').dispatchEvent(evt);
				document.querySelector('[id="search"]').dispatchEvent(evt);
				//document.body.dispatchEvent(evt);

				//another test
				var keyboardEvent = new KeyboardEvent('keypress', {bubbles:true}); 
				Object.defineProperty(keyboardEvent, 'charCode', {get:function(){return this.charCodeVal;}}); 
				keyboardEvent.charCodeVal = [13];
				document.body.dispatchEvent(keyboardEvent);
				//window.dispatchEvent(keyboardEvent); //test - hit enter key now that focus on input box
				window.document.dispatchEvent(keyboardEvent); //test - hit enter key now that focus on input box

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
	     console.error('Clicking map ...');
	     //app.map.emit('click', {mapPoint: new esri.geometry.Point(-13630239.432707999, 5983932.398006234, esri.SpatialReference({wkid:102100}))}); // Click map @ Marcourt Building - doesn't work
	     app.map.emit('click', {mapPoint: new esri.geometry.Point(-122.442478, 47.255346, esri.SpatialReference({wkid:4326}))}); // Click map @ Marcourt Building - doesn't work
	     //app.map.emit('click', {mapPoint: new esri.geometry.Point(-1, 5, esri.SpatialReference({wkid:102100}))}); // Click map @ Marcourt Building
	     // app.map.emit("click", { bubbles: true, cancelable: true });
	     //app.map.emit("click", { bubbles: true, cancelable: true, screenPoint: scrPt, mapPoint: mpPt });
	     //app.map.emit("click", { bubbles: true, cancelable: true, mapPoint: new esri.geometry.Point(-13630239.432707999, 5983932.398006234, esri.SpatialReference({wkid:102100})) });  //doesn't work
	     //console.error(app.map.spatialReference); // test
	     //console.error(app.featureLayer.geometry.getExtent().getCenter()); // test - mapPoint: featureLayer.geometry.getExtent().getCenter()
	     console.error('featureLayer? ', app.map) //TRY TO FIND FEATURELAYER
	     console.error('featureLayer? ', app.map._layers.graphicsLayer1) //TRY TO FIND FEATURELAYER
	     console.error('Testing done!');
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
	     testElementsArray.push("Search");  //test Geocode search
	     //testElementsArray.push(document.querySelector('[title="Search by address"]'));  // - DOESN'T WORK
	     //testElementsArray.push(document.querySelector('[id="search"]'));  // - DOESN'T WORK
	     //testElementsArray.push(document.querySelector('[id="map_root"]'));  // - nothing happens
	     //testElementsArray.push(document.querySelector('[id="map_container"]'));  // - nothing happens
	     //testElementsArray.push(document.querySelector('[id="map_layers"]'));  // - nothing happens
	     //testElementsArray.push(document.querySelector('[id="map_gc"]'));  // - error
     processArray(testElementsArray, simulateButtonClick); //Run a async operation on each item in array, but one at a time serially such that the next operation does not start until the previous one has finished.
   }, 10000);
