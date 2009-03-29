function KivaMap (mapSelector, mapCssSelector, data) {
    this.mapSelector    = mapSelector;
    this.mapCssSelector = mapCssSelector;
    this.data           = data;
    this.loansInPlace   = {};

    this.placeLoans = function () {
        var self = this;
        this.data.eachLoan(function () {
          var loan = this;

          // Collect all the loans in each place, and put only one dot in the
          // map for each place
          var placeId = 'location' +
                            loan.location.country.replace(/[^a-z]/gi, '-');
          if (self.loansInPlace[placeId] == undefined) { // First loan
            [lat, lon] = loan.location.geo.pairs.split(' ');

            mapMaker.placeIdByLatitudeAndLongitude(self.mapCssSelector,
                                                   '#'+placeId,
                                                   parseFloat(lat),
                                                   parseFloat(lon));
            htmlString = '<a class="location" href="#" ' +
                            'id="' + placeId +
                            '">' + placeId + '</a>';

            $(self.mapSelector).prepend(htmlString);
            var f = function () { map.showInfoInPanel(placeId); return false };
            $('#'+placeId).mouseover(f).focus(f);

            self.loansInPlace[placeId] = ['<div class="loan-location">' +
                                            loan.location.country +
                                            '</div>'];
          }

          var infoExtraClass = (self.loansInPlace[placeId].length % 2 == 0) ?
                                'even' : 'odd';
          self.loansInPlace[placeId].push(self.data.loanInfoWithTemplate(loan,
            '<div class="loan-info ' + infoExtraClass +
              '"><a href="LOANLINK"><img src="LOANSMALLIMGURL" ' +
              'alt="LOANTOWN, LOANCOUNTRY" /></a>' +
              '<div class="loan-title"><a href="LOANLINK">BORROWERNAME</a></div>' +
              '<div class="loanuse">LOANUSE</div>' +
              '<div class="loanstatus">LOANSTATUS</div>' +
              '<div class="loansectoractivity">LOANSECTOR - LOANACTIVITY</div>' +
              '</div>'));

          // If any of the loans needs more money, add the 'needmoney' class
          if (parseFloat(loan.loan_amount) -
                  parseFloat(loan.funded_amount) > 0 &&
                  ! $('#' + placeId).hasClass('needmoney')) {
              $('#' + placeId).addClass('needmoney');
          }
        });
    };

    this.refresh = function () {
        this.loansInPlace = {};
        $(this.mapSelector).html('');
        $(this.mapCssSelector).html('');
        this.placeLoans();
    };

    this.showInfoInPanel = function (locationId) {
        $('#info-panel').html(this.loansInPlace[locationId].join(''));
    };

    return true;
};
