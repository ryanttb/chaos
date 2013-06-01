(function () {
    "use strict";

    var map = null;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
          if (!map) {
            map = $("#map").geomap({
              zoom: 3,
              cursors: { remove: "crosshair" },

              shape: function( e, geo ) {
                if ( map.geomap( "option", "mode" ).substr( 0, 3 ) == "dra" ) {
                  // grab the label (if any) from the input
                  var label = $( "#shapeLabels input" ).val( );
                  map.geomap( "append", geo, label );
                }
              },


              click: function( e, geo ) {
                if ( map.geomap( "option", "mode" ) == "remove" ) {
                  var shapes = map.geomap( "find", geo, 3 );
                  map.geomap( "remove", shapes );
                } else {
                  (new Windows.UI.Popups.MessageDialog(  "clicked [ " + geo.coordinates[0].toFixed(2) + ", " + geo.coordinates[1].toFixed(2) + " ]" )).showAsync();
                }
              }



            });

            $( ".modes input" ).click( function () {
              // set the map's mode option based on value of the input clicked
              var modeValue = $( this ).val( );
              map.geomap( "option", "mode", modeValue );
            } );

          }
        }
    });
})();
