function KivaMap (mapSelector, mapCssSelector, data) {
    this.mapSelector         = mapSelector;
    this.mapCssSelector      = mapCssSelector;
    this.data                = data;
    this.htmlChunksForPlace  = {};
    this.htmlChunksForSector = {};

    this.placeLoans = function () {
        var self = this;
        this.data.eachLoan(function () {
          var loan = this;
          var loanHtml = self.data.loanInfoWithTemplate(loan,
                          '<div class="loan-info">' +
                            '<a href="LOANLINK"><img src="LOANSMALLIMGURL" ' +
                            'alt="LOANTOWN, LOANCOUNTRY" /></a>' +
                            '<div class="loan-title">' +
                              '<a href="LOANLINK">BORROWERNAME</a></div>' +
                              '<div class="loanuse">LOANUSE</div>' +
                              '<div class="loanstatus">LOANSTATUS</div>' +
                              '<div class="loansectoractivity"><a href="#" onclick="map.showSectorInfoInPanel(\'LOANSECTOR\')">LOANSECTOR</a> - ' +
                                'LOANACTIVITY</div>' +
                            '</div>');

          // Collect all the loans in each place, and put only one dot in the
          // map for each place
          var placeId = 'location' +
                            loan.location.country.replace(/[^a-z]/gi, '-');
          if (self.htmlChunksForPlace[placeId] == undefined) {
            [lat, lon] = loan.location.geo.pairs.split(' ');

            mapMaker.placeIdByLatitudeAndLongitude(self.mapCssSelector,
                                                   '#'+placeId,
                                                   parseFloat(lat),
                                                   parseFloat(lon));
            htmlString = '<a class="location" href="#" ' +
                            'id="' + placeId +
                            '">' + placeId + '</a>';

            $(self.mapSelector).prepend(htmlString);
            var f = function () { map.showLocationInfoInPanel(placeId); return false };
            $('#'+placeId).mouseover(f).focus(f);

            self.htmlChunksForPlace[placeId] =
                ['<div class="loan-group-title">' +
                    loan.location.country +
                    ' (<a href="#" ' +
                       'onclick="map.showSectorDirectoryInPanel()">Browse ' +
                       'Sectors</a>)</div>'];
          }

          self.htmlChunksForPlace[placeId].push(loanHtml);

          var sectorId = loan.sector;
          if (self.htmlChunksForSector[sectorId] == undefined) {
              self.htmlChunksForSector[sectorId] =
                  ['<div class="loan-group-title">' + loan.sector +
                    ' (<a href="#" ' +
                        'onclick="map.showSectorDirectoryInPanel()">' +
                        'All Sectors</a>)</div>'];
          }

          self.htmlChunksForSector[sectorId].push(loanHtml);

          // If any of the loans needs more money, add the 'needmoney' class
          if (parseFloat(loan.loan_amount) -
                  parseFloat(loan.funded_amount) > 0 &&
                  ! $('#' + placeId).hasClass('needmoney')) {
              $('#' + placeId).addClass('needmoney');
          }
        });
    };

    this.refresh = function () {
        this.htmlChunksForPlace = {};
        $(this.mapSelector).html('');
        $(this.mapCssSelector).html('');
        this.placeLoans();
    };

    this.showLocationInfoInPanel = function (locationId) {
        $('#info-panel').html(this.htmlChunksForPlace[locationId].join(''));
    };

    return true;
};
