var mapMaker = {
    mapHeight: 275,
    mapWidth:  550,

    // latLongToPixels: converts latitude and longitude (floats) into a
    // two-element array with the [top, left] pixels, ready to use in CSS.
    latLongToPixels : function(latitude, longitude) {
        return [ parseInt(((latitude * -1) + 90)  * (this.mapHeight / 180)),
                 parseInt((longitude       + 180) * (this.mapWidth  / 360)) ];
    },

    // placeIdByLatitudeAndLongitude: adds appropriate CSS to the given style
    // element (identified by mapStyleElementSelector) placing the given
    // element (identified by css selector "dotSel") in the given latitude and
    // longitude
    placeIdByLatitudeAndLongitude: function (mapStyleElementSelector, dotSel,
                                             latitude, longitude) {
      var cssTop, cssLeft;
      [pxTop, pxLeft] = this.latLongToPixels(latitude, longitude);
      cssRule = dotSel + ' {top:  ' + pxTop  + 'px; ' +
                           'left: ' + pxLeft + 'px; ' +
                           'z-index: 2 }\n';
      $(mapStyleElementSelector).append(cssRule);
    }
};
