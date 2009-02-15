var mapMaker = {
    latLongToPixels : function(latitude, longitude) {
        mapHeight = 275;
        mapWidth  = 550;
        return [ parseInt(((latitude * -1) + 90)  * (mapHeight / 180)),
                 parseInt((longitude       + 180) * (mapWidth  / 360)) ];
    },

    placeIdByLatitudeAndLongitude: function (id, latitude, longitude) {
      var cssTop, cssLeft;
      [pxTop, pxLeft] = this.latLongToPixels(latitude, longitude);
      var styleElement = document.createElement("style");
      styleElement.type = 'text/css';
      cssRule = '.map '+id+' {top: '+pxTop+'px; left: '+pxLeft+'px}';
      styleElement.appendChild(document.createTextNode(cssRule));
      document.body.appendChild(styleElement);
    },
};
