// For an introduction to the Search Contract template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512

(function () {
  "use strict";

  var appModel = Windows.ApplicationModel;
  var appViewState = Windows.UI.ViewManagement.ApplicationViewState
  var nav = WinJS.Navigation;
  var ui = WinJS.UI;
  var utils = WinJS.Utilities;
  var searchPageURI = "/searchResults.html";
  var appResults = null;
  var searchPanel = null, searchPanelElement = null;

  ui.Pages.define(searchPageURI, {
    /// <field elementType="Object" />
    filters: [],
    lastSearch: "",

    generateFilters: function () {
      this.filters = [];
      this.filters.push({ results: null, text: "Tweets", predicate: function (item) { return true; } });
      /*
      // TODO: Replace or remove example filters.
      this.filters.push({
        results: null, text: "Places", predicate: function (item) {
          return item.group === "places";
        }
      });
      this.filters.push({
        results: null, text: "Tweets", predicate: function (item) {
          return item.group === "tweets";
        }
      });
      */
    },

    itemInvoked: function (args) {
      args.detail.itemPromise.done(function itemInvoked(item) {
        // TODO: Navigate to the item that was invoked.
        // nav.navigate("/html/<yourpage>.html", {item: item.data});
        nav.navigate("/pages/home/home.html", { searchResult: item.data });
      });
    },

    // This function populates a WinJS.Binding.List with search results for the
    // provided query.
    searchData: function (queryText) {
      var originalResults;
      var regex;
      // TODO: Perform the appropriate search on your data.
      if (window.Data) {
        originalResults = Data.items.createFiltered(function (item) {
          regex = new RegExp(queryText, "gi");
          return (item.title.match(regex) || item.subtitle.match(regex) || item.description.match(regex));
        });
      } else {
        originalResults = new WinJS.Binding.List();
        originalResults.push({
          group: "places",
          title: "Boston",
          subtitle: "Massachusetts",
          description: "A fine city",
          backgroundImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC",
          center: [-71.037598, 42.363281]
        });

        originalResults.push({
          group: "places",
          title: "London",
          subtitle: "UK",
          description: "Host of 2012 Summer Olympics",
          backgroundImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC",
          center: [-0.12255859376977496, 51.458752215556146]
        });
      }
      return originalResults;
    },

    // This function filters the search data using the specified filter.
    applyFilter: function (filter, originalResults) {
      if (filter.results === null) {
        filter.results = originalResults.createFiltered(filter.predicate);
      }
      return filter.results;
    },

    // This function responds to a user selecting a new filter. It updates the
    // selection list and the displayed results.
    filterChanged: function (element, filterIndex) {
      var filterBar = element.querySelector(".filterbar");
      var listView = element.querySelector(".resultslist").winControl;

      utils.removeClass(filterBar.querySelector(".highlight"), "highlight");
      utils.addClass(filterBar.childNodes[filterIndex], "highlight");

      element.querySelector(".filterselect").selectedIndex = filterIndex;

      listView.itemDataSource = this.filters[filterIndex].results.dataSource;
    },

    // This function executes each step required to perform a search.
    handleQuery: function (element, args) {
      appResults = new WinJS.Binding.List();
      var originalResults;
      this.lastSearch = args.queryText;
      WinJS.Namespace.define("searchResults", { markText: this.markText.bind(this) });
      utils.markSupportedForProcessing(searchResults.markText);
      this.initializeLayout(element.querySelector(".resultslist").winControl, Windows.UI.ViewManagement.ApplicationView.value);
      this.generateFilters();
      
      searchPanel = this;
      searchPanelElement = element;

      /*
      document.frames["postAjax"].postMessage(JSON.stringify({
        url: "http://open.mapquestapi.com/nominatim/v1/search",
        data: {
          format: "json",
          q: args.queryText
        },
        dataType: "jsonp",
        jsonp: "json_callback"
      }), "ms-appx-web://" + document.location.host);
      */

      var center = JSON.parse(window.localStorage.getItem("location")).center,
          geocode = [
              center[0],
              center[1],
              "1km"
          ];


      document.frames["postAjax"].postMessage(JSON.stringify({
        url: "http://search.twitter.com/search.json",
        data: {
          rpp: 100,
          q: args.queryText,
          geocode: geocode.join(",")
        },
        dataType: "jsonp",
      }), "ms-appx-web://" + document.location.host);
    },

    // This function updates the ListView with new layouts
    initializeLayout: function (listView, viewState) {
      /// <param name="listView" value="WinJS.UI.ListView.prototype" />

      var modernQuotationMark = "&#148;";
      if (viewState === appViewState.snapped) {
        listView.layout = new ui.ListLayout();
        document.querySelector(".titlearea .pagetitle").innerHTML = modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
        document.querySelector(".titlearea .pagesubtitle").innerHTML = "";
      } else {
        listView.layout = new ui.GridLayout();
        document.querySelector(".titlearea .pagetitle").innerHTML = "Search";
        document.querySelector(".titlearea .pagesubtitle").innerHTML = "Results for " + modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
      }
    },

    // This function colors the search term. Referenced in /searchResults.html
    // as part of the ListView item templates.
    markText: function (source, sourceProperties, dest, destProperties) {
      var text = source[sourceProperties[0]];
      var regex = new RegExp(this.lastSearch, "gi");
      dest[destProperties[0]] = text.replace(regex, "<mark>$&</mark>");
    },

    // This function generates the filter selection list.
    populateFilterBar: function (element, originalResults) {
      var filterBar = element.querySelector(".filterbar");
      var listView = element.querySelector(".resultslist").winControl;
      var li, option, filterIndex;

      filterBar.innerHTML = "";
      for (filterIndex = 0; filterIndex < this.filters.length; filterIndex++) {
        this.applyFilter(this.filters[filterIndex], originalResults);

        li = document.createElement("li");
        li.filterIndex = filterIndex;
        li.tabIndex = 0;
        li.textContent = this.filters[filterIndex].text + " (" + this.filters[filterIndex].results.length + ")";
        li.onclick = function (args) { this.filterChanged(element, args.target.filterIndex); }.bind(this);
        li.onkeyup = function (args) {
          if (args.key === "Enter" || args.key === "Spacebar")
            this.filterChanged(element, args.target.filterIndex);
        }.bind(this);
        filterBar.appendChild(li);

        if (filterIndex === 0) {
          utils.addClass(li, "highlight");
          listView.itemDataSource = this.filters[filterIndex].results.dataSource;
        }

        option = document.createElement("option");
        option.value = filterIndex;
        option.textContent = this.filters[filterIndex].text + " (" + this.filters[filterIndex].results.length + ")";
        element.querySelector(".filterselect").appendChild(option);
      }

      element.querySelector(".filterselect").onchange = function (args) { this.filterChanged(element, args.currentTarget.value); }.bind(this);
    },

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    ready: function (element, options) {
      var listView = element.querySelector(".resultslist").winControl;
      listView.itemTemplate = element.querySelector(".itemtemplate")
      listView.oniteminvoked = this.itemInvoked;
      this.handleQuery(element, options);
      listView.element.focus();
    },

    // This function updates the page layout in response to viewState changes.
    updateLayout: function (element, viewState, lastViewState) {
      /// <param name="element" domElement="true" />
      /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
      /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

      var listView = element.querySelector(".resultslist").winControl;
      if (lastViewState !== viewState) {
        if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
          var handler = function (e) {
            listView.removeEventListener("contentanimating", handler, false);
            e.preventDefault();
          }
          listView.addEventListener("contentanimating", handler, false);
          var firstVisible = listView.indexOfFirstVisible;
          this.initializeLayout(listView, viewState);
          listView.indexOfFirstVisible = firstVisible;
        }
      }
    }
  });

  window.addEventListener("message", function (e) {
    var response = JSON.parse(e.data);

    if (response) {
      if (response.originalUrl.indexOf("mapquest") > 0 && response.results) {
        $.each(response.results, function () {
          var displayNameParts = this.display_name.split(",");
          appResults.push({
            group: "places",
            title: displayNameParts[0],
            subtitle: displayNameParts[1],
            description: this.type,
            backgroundImage: this.icon, // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC",
            center: [this.lon, this.lat]
          });
        });
      } else if (response.originalUrl.indexOf("twitter") > 0) {

        $.each(response.results.results, function () {
          if (this.geo) {
            appResults.push({
              group: "tweets",
              title: this.from_user,
              subtitle: "",
              description: this.text,
              backgroundImage: this.profile_image_url, //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC",
              center: [this.geo.coordinates[1], this.geo.coordinates[0] ]
            });
          }
        });
      }

      searchPanel.populateFilterBar(searchPanelElement, appResults);
      searchPanel.applyFilter(searchPanel.filters[0], appResults);
    }
  }, true);

  WinJS.Application.addEventListener("activated", function (args) {
    if (args.detail.kind === appModel.Activation.ActivationKind.search) {
      args.setPromise(ui.processAll().then(function () {
        if (!nav.location) {
          nav.history.current = { location: Application.navigator.home, initialState: {} };
        }

        return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
      }));
    }
  });

  appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) { nav.navigate(searchPageURI, args); };
})();
