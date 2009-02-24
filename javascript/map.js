var mapMaker = {
    mapHeight: 275,
    mapWidth:  550,

    // latLongToPixels: converts latitude and longitude (floats) into a
    // two-element array with the [top, left] pixels, ready to use in CSS.
    latLongToPixels : function(latitude, longitude) {
        return [ parseInt(((latitude * -1) + 90)  * (this.mapHeight / 180)),
                 parseInt((longitude       + 180) * (this.mapWidth  / 360)) ];
    },

    // placeIdByLatitudeAndLongitude: defines a CSS style block placing the
    // given element (identified by css selector "cssSel") in the given
    // latitude and longitude
    placeIdByLatitudeAndLongitude: function (cssSel, latitude, longitude) {
      var cssTop, cssLeft;
      [pxTop, pxLeft] = this.latLongToPixels(latitude, longitude);
      var styleElement = document.createElement("style");
      styleElement.type = 'text/css';
      cssRule = cssSel + ' {top:  ' + pxTop  + 'px; ' +
                           'left: ' + pxLeft + 'px}';
      styleElement.appendChild(document.createTextNode(cssRule));
      document.body.appendChild(styleElement);
    }
};
