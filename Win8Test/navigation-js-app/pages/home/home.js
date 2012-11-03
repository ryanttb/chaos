(function () {
    "use strict";
    var app = WinJS.Application;
    var map = null;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
      
      ready: function (element, options) {

        var locationJson = null, //window.localStorage.getItem("location"),
            location = map ? {
                center: map.geomap("option", "center"),
                zoom: map.geomap("option", "zoom")
              } : { zoom: 3 };

        if (locationJson) {
          $.extend(location, JSON.parse(locationJson));
        }

        if (options && options.searchResult) {
          location.center = options.searchResult.center;
        }

        
        if (map) {
          map.geomap("destroy");
        }

        map = $("#map").geomap($.extend(location,
          {
            scroll: "off",
            shapeStyle: {
              width: 0,
              height: 0
            },
            bboxchange: function(e, geo) {
              window.localStorage.setItem("location", JSON.stringify({
                center: map.geomap("option", "center"),
                zoom: map.geomap("option", "zoom")
              }));
            }
          }
        ));

        if (options && options.searchResult) {
          map.geomap("append", {
            type: "Point",
            coordinates: options.searchResult.center
          },
          '<div style="position: relative; top: -32px; left: -32px;"><img src="' + options.searchResult.backgroundImage + '" style="vertical-align: top;" /><span style="background: white; margin-left: 4px; padding: 4px; border-radius: 8px;">' + options.searchResult.description + '</span></div>');
        }

        window.localStorage.setItem("location", JSON.stringify({
          center: map.geomap("option", "center"),
          zoom: map.geomap("option", "zoom")
        }));
        //} else {
          //map.geomap("option", location);
        //}


      }
    });

    app.oncheckpoint = function (args) {
      // TODO: This application is about to be suspended. Save any state
      // that needs to persist across suspensions here. If you need to 
      // complete an asynchronous operation before your application is 
      // suspended, call args.setPromise().
    };

})();
