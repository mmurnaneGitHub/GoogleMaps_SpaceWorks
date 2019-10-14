  var gmap = null; //map
  var overlay;  //to get map pixel location
  var MY_MAPTYPE_ID = 'gray';  // map style
  var bounds;  //map extent
  var dialog;  //lightbox

  //MarkerClusterer v3 -  http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/docs/examples.html
  var markers = [];  //array of marker points to be used by MarkerClusterer
  
  //for clickable side panel - link to markers
  var studioMarker = ["0"];  //empty a placeholder for first record [0], so that i matches Studio Number
  
//for Itinerary directions
	var Itinerary;  //Itinerary list
  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var directionsService;
  var origin = null;
  var destination = null;
  var waypoints = [];
  var markers = [];
  var directionsVisible = false;

  //=== Set marker attributes ===
    //create at http://gmaps-utility-library.googlecode.com/svn/trunk/mapiconmaker/1.1/examples/markericonoptions-wizard.html
    var imageIcon = new google.maps.MarkerImage('images/mapIcons/mm_20_blue.png',
        new google.maps.Size(12, 20),
        new google.maps.Point(0,0),
        new google.maps.Point(0, 20));
    var shadow = new google.maps.MarkerImage('images/mapIcons/mm_20_shadow.png',
        new google.maps.Size(22, 20),
        new google.maps.Point(0,0),
        new google.maps.Point(0, 20));
    var shape = {
        coord: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
        };
    var imageOver = new google.maps.MarkerImage('images/mapIcons/s_orange.png',
        new google.maps.Size(12, 20),
        new google.maps.Point(0,0),
        new google.maps.Point(0, 20));

    var myMarker = false;  //marker for mobile location

  function initialize() {
    //Buttons - create programmatically:
    var button = new dijit.form.Button({
        label: "Get Directions!",
        onClick: function() {
            reset();calcRoute();
        }
    },
    "buttonDirections");

    var button = new dijit.form.Button({
        label: "Reset",
        onClick: function() {
            reset();destroyAll();
        }
    },
    "buttonRemove");

    var button = new dijit.form.Button({
        label: "Delete selected Studio(s)",
        onClick: function() {
            deleteSelected();
        }
    },
    "buttonDelete");



  //mobile device check
    var useragent = navigator.userAgent;  

    var myLatlng = new google.maps.LatLng(47.250138520439556, -122.47643585205077); //Studio Tour center

    //map style----------
      var styleGray = [
      {
        featureType: "administrative",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      },{
        featureType: "landscape",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      },{
        featureType: "poi",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      },{
        featureType: "road",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      },{
        featureType: "transit",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      },{
        featureType: "water",
        elementType: "all",
        stylers: [
          { saturation: -100 }
        ]
      }
      ];
    //end map style ------

    var myOptions = {
      zoom: 19,
      center: myLatlng,
      panControl: false,
      zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_TOP
        },
      mapTypeControl: true,
        mapTypeControlOptions: {
           mapTypeIds: [MY_MAPTYPE_ID,google.maps.MapTypeId.HYBRID]
        },
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
      mapTypeId: MY_MAPTYPE_ID
    }

    gmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    //Map button
    var styledMapOptions = {
      name: "Map"
    };

    //Set background map  
    var GrayMapType = new google.maps.StyledMapType(styleGray, styledMapOptions);
    gmap.mapTypes.set(MY_MAPTYPE_ID, GrayMapType);

    //Add LOGO as a control------------------------
      // Create a div to hold the control.
      var controlDiv = document.createElement('DIV');
      
      // Offset the control from the edge of the map
      controlDiv.style.padding = '5px 5px 3px 5px';
      
      // Set CSS for the control border
      var controlUI = document.createElement('DIV');
      controlUI.style.backgroundColor = 'white';
      controlUI.style.borderStyle = 'solid';
      controlUI.style.borderWidth = '2px';
      controlUI.style.borderColor = '#b2b2b2';
      controlUI.style.cursor = 'pointer';
      
      //Add logo image
      var myLogo = document.createElement("img");
          myLogo.src = "images/Logo/Spaceworks.png";
          myLogo.style.width = '99px';
          myLogo.style.height = '31px';
          myLogo.title = "SpaceWorks website";
          //Append to each div
          controlUI.appendChild(myLogo);
          controlDiv.appendChild(controlUI);
      
      //Add logo control to map
      gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
      
      // Set logo as link to website
      google.maps.event.addDomListener(controlUI, 'click', function() {
        window.open('http://spaceworkstacoma.com/');
      });
    //End Add LOGO as a control------------------------

    //Add Itinerary button as a control------------------------
      // Create a div to hold the control.
      var controlDiv = document.createElement('DIV');
      
      // Offset the control from the edge of the map
      controlDiv.style.padding = '0px 0px 0px 5px';
      
      // Set CSS for the control border
      var controlUI = document.createElement('DIV');
      controlUI.title = 'Toggle Itinerary panel';
      controlUI.style.backgroundColor = 'black';
      controlUI.style.borderStyle = 'solid';
      controlUI.style.borderWidth = '1px';
      controlUI.style.borderColor = '#b2b2b2';
      controlUI.style.textAlign = "center";
      controlUI.style.width = '99px';
      controlUI.style.cursor = 'pointer';

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.color = 'white';
      controlText.style.fontFamily = 'Arial,sans-serif';
      controlText.style.fontSize = '12px';
      controlText.style.paddingLeft = '4px';
      controlText.style.paddingRight = '4px';
      controlText.innerHTML = 'ITINERARY';
      controlUI.appendChild(controlText);
      controlDiv.appendChild(controlUI);
      
      //Add Itinerary button to map legend
      gmap.controls[google.maps.ControlPosition.LEFT_TOP].push(controlDiv);
      //Add events
      google.maps.event.addDomListener(controlUI, 'click', function() {
        dijit.byId('myExpando').toggle();  //Toggle Itinerary panel
      });
      google.maps.event.addDomListener(controlUI, 'mouseover', function() {
      });

    //End Legend as a control------------------------

    //Add Zoom Home image as a control------------------------
      // Create a div to hold the control.
      var controlDiv = document.createElement('DIV');
      
      // Offset the control from the edge of the map
      controlDiv.style.padding = '0px 7px 5px 5px';
      
      // Set CSS for the control border
      var controlUI = document.createElement('DIV');
      controlUI.style.cursor = 'pointer';
      
      //Add logo image
      var myLogo = document.createElement("img");
          myLogo.src = "images/HomeBlue.png";
          myLogo.style.width = '16px';
          myLogo.style.height = '16px';
          myLogo.title = "Zoom to All Studios";
          //Append to each div
          controlUI.appendChild(myLogo);
          controlDiv.appendChild(controlUI);
      
      //Add logo control to map
      gmap.controls[google.maps.ControlPosition.RIGHT_TOP].push(controlDiv);

      // Set logo as link to website
      google.maps.event.addDomListener(controlUI, 'click', function() {
        gmap.fitBounds(bounds);
        //dijit.byId('myExpando').toggle();      //Toggle - Create Itinerary   !!!!Use this for Itinerary button
      });

      
    //End Zoom Home as a control------------------------


    //Add overlay to map to get pixel location for mouse hover
    overlay = new google.maps.OverlayView();
    overlay.draw = function() {};
    overlay.setMap(gmap); //add empty OverlayView and link the map div to the overlay 

    //Mobile device check
  			// allow iPhone or Android to track movement (watchPosition)
  			if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
  				navigator.geolocation.watchPosition(displayLocation, handleError);					
  
  			// or let other geolocation capable browsers to get their static position (W3C Geolocation method)
  			} else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayLocation, handleError);
  			// all other devices
  			} else {
          //default location
          displayLocation('default');
  			};

    //Update html text in tab windows -
    var tabText = "<div><b>Create your own itinerary:</b>";
    tabText += "<ul><li>Enter Starting Point information</li>";
    tabText += "<li>Click map marker</li>";
    tabText += "<li>Select <i>Add to my Itinerary</i> <br>(up to 9 Studios)</li>";
    tabText += "</ul></div>";

    tabText += "<div style='border-top:1px solid #C0C0C0;background:#EEEEEE;padding:4px 4px 4px 4px;'>";
    tabText += "<b>Starting Point:</b>";
    tabText += "</div>";

    tabText += "<div style='float:right;'>Address: <input type='text' name='StartAddress1' id='StartAddress1' value='747 Market St' /></div>";
    tabText += "<div style='float:right;'>City: <input type='text' name='StartAddress2' id='StartAddress2' value='Tacoma' /><br />&nbsp;</div>";

    tabText += "<div style='clear:both;background:#EEEEEE;padding:4px 4px 4px 4px;'><b>Itinerary: </b></div>";
    tabText += "<div class='Itinerary Container' style='clear:both;width:230px;'><ol id='Itinerary Node' class='container'></ol></div>";

    dojo.byId("theItinerary1").innerHTML = tabText;
    dojo.byId("theItinerary2").innerHTML = "<i>No Studios selected.</i>";
    dojo.byId("directions1").innerHTML = "<a href='javascript:PrintContent();'>Print Directions</a>";
    dojo.byId("directions2").innerHTML = "<a href=\"javascript:togglePane('rightPane','rightTabs','ItineraryTab');\">Modify Itinerary</a>";

//for Itinerary list
		Itinerary  = new dojo.dnd.Source("Itinerary Node");
		Itinerary.insertNodes(false, []);

    // replace the avatar string to make it more readable
    dojo.dnd.Avatar.prototype._generateText = function(){
      return (this.manager.copy ? "copy" : "Move to here");
    };


    //for Itinerary directions
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(gmap);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));

    //for updating map extent to marker extent
    bounds = new google.maps.LatLngBounds();
                
  }

			function displayLocation(position){
			 //mobile device marker
				if (position=="default") {
  				  var myLatLng = new google.maps.LatLng(47.255851508377994, -122.4417709827423); //TMB
  				  var myTitle = "Tacoma Arts";
        } else {
  				  var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  				  var myTitle = "You are here";
        };

    				// build entire marker first time thru
    				if (! myMarker) {
    
    
    					// define the 'you are here' marker image
    					var image = new google.maps.MarkerImage('images/bounce.gif',
    						new google.maps.Size(27, 38), // size
    						new google.maps.Point(0, 0), // origin
    						new google.maps.Point(14, 19) // anchor
    					);
    
    					// then create the new marker
    					myMarker = new google.maps.Marker({
    						position: myLatLng,
    						map: gmap,
    						icon: image,
    						flat: true,
    						draggable: true,
    						title: myTitle
    					});
    					
    				// just change marker position on subsequent passes
    				} else {
    					myMarker.setPosition(myLatLng);
    				}

			}

			function handleError(error){
			 //mobile device error messages
				switch (error.code){
					case error.TIMEOUT:
						alert('Sorry. Timed out.');
						break;
					case error.PERMISSION_DENIED:
						alert('Sorry. Permission to find your location has been denied.');
						break;
					case error.POSITION_UNAVAILABLE:
						alert('Sorry. Position unavailable.');
						break;
					default:
						alert('Sorry. Error code: ' + error.code);
						break;
				}
			}
			
  function getFilePreventCache() {
      //The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
      var xhrArgs = {
          url: "SpaceWorks.txt",
          handleAs: "json",
          preventCache: true,
          load: function(jsonData) {

              //Title/Description/Studio# variables
              var detail_content = "";
              var theThumbnails = "";
              
              //Format the data into html - loop through each record
              for (var i=0; i<jsonData.items.length; i++) {
                 // only attempt to add markers with Latitude & Longitude
                if(jsonData.items[i].Latitude >0 && jsonData.items[i].Longitude <0 && jsonData.items[i].Active=='Yes') {

              //Studio thumbnail summary - use array of studio markers (studioMarker) for click event
                  theThumbnails += "<img src=\"images/studios/" + jsonData.items[i].Photo_name +"T.jpg\" style=\"width:75px;height:100px;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px\" title='" + jsonData.items[i].Project_Name + " - Click for details' onclick='google.maps.event.trigger(studioMarker[" + jsonData.items[i].ID_num + "], \"click\")' onmouseover='google.maps.event.trigger(studioMarker[" + jsonData.items[i].ID_num + "], \"mouseover\")'  onmouseout='google.maps.event.trigger(studioMarker[" + jsonData.items[i].ID_num + "], \"mouseout\")' />";

                  var sum_content =  "<div style=\"text-align:center;\"><b>" +  jsonData.items[i].Project_Name + "</b>";
                      sum_content += "<br><img src=\"images/studios/" + jsonData.items[i].Photo_name +"T.jpg\" style=\"height:100px;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px\" />";
                      sum_content += "<br><i>Click marker for details</i></div>";

                        //Address fixes for links
                        //remove extra notes from address and use first item in resulting array - , & (
                        var iAddress = jsonData.items[i].Street_Add.split(/,|\(/)[0];  //address for Itinerary & Get Directions

                        //Opera Alley & Steele fix
                        if (jsonData.items[i].Street_Add.search(/opera/i)!=-1) {
                          iAddress = "705 Court C";
                        } else if (jsonData.items[i].Street_Add.search(/2926 S. Steele St./i)!=-1) {
                          iAddress = "2926 S. Steele St.";
                        } else if (jsonData.items[i].Street_Add.search(/1901 Commerce St./i)!=-1) {
                          iAddress = "1901 Commerce St.";
                        }
                        
                        //replace &
                        iAddress = iAddress.replace("&","and")

                  
                      var detail_content = "<div style='clear:both;float:left;'>";
                           //format lightbox string for names like D'Agostino, Chandler O'Leary
                      detail_content += "<a href=\"javascript:myLightbox('images/studios/" + jsonData.items[i].Photo_name +".jpg','" +  jsonData.items[i].Project_Name.replace(/'/g,"\\'") + "')\"><img style ='float:left;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px' src='images/studios/" + jsonData.items[i].Photo_name +"T.jpg' title='Click to enlarge photo' height='100px'></a>";
                      detail_content += "</div>";

                      detail_content += "<div style='width: 200px;float:left;'>";

                      detail_content += jsonData.items[i].Description.replace(/""/g,"\"");     //replace any "" with "

                      //Only show if project dates filled in
                      if (jsonData.items[i].Project_Dates != "") {
                        detail_content += "<br><b>Project Dates: </b>" + jsonData.items[i].Project_Dates;
                      }
                      
                      detail_content += "<br><a href=\"http://" + jsonData.items[i].Website + "\" target='_blank'>" + jsonData.items[i].Website + "</a><br>&nbsp;";
                      detail_content += "</div>";

                      detail_content += "<div style='clear:both;'>";

                      detail_content += "<span style='color:rgb(196,0,0);'>" + jsonData.items[i].Street_Add + "</span><br>";

                      detail_content += "<a href=\"http://maps.google.com/?output=classic&cbll=" + jsonData.items[i].Latitude +"," + jsonData.items[i].Longitude +"&cbp=13,0,,,&layer=c&z=17\" target='_blank'>Street View</a>";
                      detail_content += " | <a href=\"https://maps.google.com/maps?saddr=my+location&daddr=" + jsonData.items[i].Latitude +"," + jsonData.items[i].Longitude + "\" target='_blank'>Directions from My Location</a>";

                        //Itinerary!!!!!!!!!!!!!!!!
                        var iStudio = "Studio " + jsonData.items[i].ID_num + " - " + iAddress;  //Itinerary Studio Address
                        detail_content += "<br><span style=clear:both;float:left;'><b>Add to my Itinerary?</b> <input type='radio' name='Itinerary' id='y' onclick='addStudio(\"" + iStudio + "\");togglePane(\"rightPane\",\"rightTabs\",\"ItineraryTab\");'/>Yes</span><br>";

                      detail_content += "</div>";

                  var title_content = "<span style='color:rgb(196,0,0);'>" + jsonData.items[i].Project_Name + "</span><br><span>&nbsp;" + jsonData.items[i].Artist + "</span>";
  
                  //put marker on map
                  addMarker(jsonData.items[i].Latitude, jsonData.items[i].Longitude, sum_content, detail_content, title_content, imageIcon);
                  //Extend map extent
                   bounds.extend(new google.maps.LatLng(jsonData.items[i].Latitude, jsonData.items[i].Longitude));

                }   //end loop through records with lat/long
              }   //end loop through all records

              //Adjust map extent to all markers
              gmap.fitBounds(bounds);

            //update thumbnail panel
            dojo.byId("Studios1").innerHTML = theThumbnails;

          },
          error: function(error) {
              alert("An unexpected error occurred: " + error);
          }
      }

      //Call the asynchronous xhrGet - asynchronous call to retrieve data
      var deferred = dojo.xhrGet(xhrArgs);
  }

 function showIconLegend(icon) {
    //dijit.byId('iconGTCF').show();
    dijit.byId(icon).show();
 }

  function addMarker(Latitude, Longitude, sum, info, title, imageIcon) {
    var location = new google.maps.LatLng(Latitude, Longitude);
    
    //Add marker to map
    var marker = new google.maps.Marker({
      position: location,
      shadow: shadow,
      icon: imageIcon,
      shape: shape,
      optimized: false,  //so draggable marker can be put behind theses markers
      map: gmap
    });

    //Add marker events
    google.maps.event.addListener(marker, 'mouseover', function() {
      //show popup, highlight marker if currently visible on map - no popups if zoomed in, etc
      if (gmap.getBounds().contains(marker.getPosition())) {
      
        marker.setIcon(imageOver);  //highlight marker

      //map tip - summary window
        var evt = marker.getPosition();
        var containerPixel = overlay.getProjection().fromLatLngToContainerPixel(evt);

        closeDialog();  //close any open map tips

        var dialog = new dijit.TooltipDialog({
          id: "tooltipDialog",
          content: sum,
          style: "position: absolute;z-index:100"
        });

        dialog.startup();
        dojo.style(dialog.domNode, "opacity", 0.85);
        //summary popup offset
        dijit.placeOnScreen(dialog.domNode, {x: containerPixel.x, y: containerPixel.y}, ["BL","TL","BR","TR"], {x: 15, y: 10});

      }
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      marker.setIcon(imageIcon);
      closeDialog();
    });

    google.maps.event.addListener(marker, 'click', function() {
      myDialog(info, title);
    });


    //for clickable side panel - started w/ record 0, so first one pushed in is i=1
    studioMarker.push(marker);

  }

  function closeDialog() {
    //close any open map tips
    var widget = dijit.byId("tooltipDialog");
    if (widget) {
      widget.destroy();
    }
  }
      
  function myDialog(info, title){
    myDlg = new dijit.Dialog({
        draggable: false
    });
    //add additional attributes...
    myDlg.titleNode.innerHTML = title;
    myDlg.attr("content", info);
    myDlg.show();

    //Close dialog when underlay (outside window) is clicked
    dojo.connect(dijit._underlay , "onClick", function(e){ myDlg.destroy(); });

  }


  function myLightbox(url,title){
   dialog.show({ href: url, title:title});
  }

//start direction functions ---------------------------------------------------

  function calcRoute() {
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));

      origin = dojo.byId("StartAddress1").value + "," + dojo.byId("StartAddress2").value;
    
    //get all studios from Itinerary list - loop
		var list = dojo.byId("Itinerary Node"),
			items = list.getElementsByTagName("li");

      for (i=0;i<items.length;i++) {
        destination = items[i].innerHTML + ",Tacoma,WA";  //last in list becomes destination

        if (i+1!=items.length) {
          waypoints.push({ location: destination, stopover: true });
        }
      }

    var mode = google.maps.DirectionsTravelMode.DRIVING;
    
    var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: mode,
        optimizeWaypoints: document.getElementById('optimize').checked
    };

    if ( items.length==0) {
      //no Studios
      alert("No Studios in Itinerary.");
    } else if (dojo.byId("StartAddress1").value=="") {
      alert("Please enter a Starting Point Address.");
    } else {
      //get directions
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          //change panel to results
          togglePane('rightPane','rightTabs','DirectionsTab');
        }
      });
      clearMarkers();
      directionsVisible = true;
    }    
    
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  
  function clearWaypoints() {
    markers = [];
    origin = null;
    destination = null;
    waypoints = [];
    directionsVisible = false;
  }
  
  function reset() {
    clearMarkers();
    clearWaypoints();
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(gmap);
    directionsDisplay.setPanel(document.getElementById("theDirections"));
    gmap.fitBounds(bounds);  //Adjust map extent to all markers   
  }

  function togglePane(panel,tab,tabPick) {

    if (!(dijit.byId('myExpando')._showing)) { dijit.byId('myExpando').toggle();}  //show Expando panel

      if (!(dijit.byId(panel)._showing)) {
          //open panel & show tab
          dijit.byId(tab).selectChild(tabPick);
      } else { 
          if (dijit.byId(tab).selectedChildWidget.id != tabPick) {
              //change tab
              dijit.byId(tab).selectChild(tabPick);
          } else {
              //close panel
              dijit.byId(panel).toggle();
          }
      }
  }

//end direction functions ---------------------------------------------------

//begin Itinerary list functions---------------------
	function destroyAll(){
		dojo.empty("Itinerary Node");
		//show No Studios
    dojo.byId("theItinerary2").style.display = 'block' 
    //hide direction buttons
    dojo.byId("theItinerary3").style.display = 'none';
    dojo.byId("theItinerary4").style.display = 'none';
	}

	function addStudio(studio){
    var exist = "No";
		var list = dojo.byId("Itinerary Node"),
			items = list.getElementsByTagName("li");

      if (items.length == 9) {
        alert("Itinerary limited to 9 Studios.  Please remove a Studio from Itinerary before adding additional Studios.")
      } else {
        for (i=0;i<items.length;i++) {
    		  if (items[i].innerHTML == studio){
            exist = "Yes";
          }
        }
        if (exist == "No") {
          Itinerary.insertNodes(false, [
      			studio
      		]);
        }
      }

      if (dojo.byId("theItinerary2").style.display = 'block') {
        //hide No Studios
        dojo.byId("theItinerary2").style.display = 'none' 
        //show direction buttons
        dojo.byId("theItinerary3").style.display = 'block';
        dojo.byId("theItinerary4").style.display = 'block';
      }

	}

	function deleteSelected(){
		Itinerary.deleteSelectedNodes();
	} 

//end Itinerary list functions ----------------------


  function PrintContent(){
    var DocumentContainer = document.getElementById("directionsPanel");
    var WindowObject = window.open('', 'PrintWindow','width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
  }

  function go2studio(lat,lon) {
    //Close open details dialog
    myDlg.destroy();

    //New map limits
    var studio_bounds = new google.maps.LatLngBounds();
    var studio_location = new google.maps.LatLng(lat,lon);
        studio_bounds.extend(studio_location);
        gmap.setZoom(17); //minimum zoom
        gmap.setCenter(studio_bounds.getCenter());
  }

  
  //Load map & markers after dojo load
	require([
    "dojo/parser", 
    "dijit/layout/BorderContainer", 
    "dijit/layout/TabContainer", 
    "dijit/layout/ContentPane",
    "dijit/form/Button", 
    "dojox/image/Lightbox", // image lightbox 
    "dijit/Dialog",  //details window
    "dijit/TooltipDialog",  //summary window
   	"dojo/dnd/Source",  //Itinerary list
    "dojox/layout/ExpandoPane",  //Expando panel
    "dojo/domReady!"
    ], 
  
    function(parser){
  		parser.parse();
        // script code that needs to run after parse
  
        //Create map
        initialize();
        
        //Put spacework locations on map
        getFilePreventCache();
            
        //FF fix for lightbox
        dialog = new dojox.image.LightboxDialog().startup();
        
        //Show Map Welcome
        dijit.byId('mapWelcome').show();
              
  	  }
  );


