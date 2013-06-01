(function () {
    "use strict";

    var map = null;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
           if (!map) {
             map = $("#map").geomap({
               zoom: 3
             });

           }
        }
    });
})();
