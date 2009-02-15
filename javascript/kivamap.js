function kivaMap (data) {
    this.data         = data;
    this.loansInPlace = {};

    this.placeLoans = function () {
        var self = this;
        jQuery.each(this.data.loanInfo.loans, function () {
          var loan = this;

          // Collect all the loans in each place, and put only one dot in the
          // map for each place
          var placeId = 'location' +
                          loan.location.geo.pairs.replace(/[^0-9]/g, '-');
          if (self.loansInPlace[placeId] == undefined) { // First loan
            self.loansInPlace[placeId] = [];
            [lat, lon] = loan.location.geo.pairs.split(' ');

            mapMaker.placeIdByLatitudeAndLongitude('#'+placeId,
                                                   parseFloat(lat),
                                                   parseFloat(lon));
            htmlString = '<a class="location" href="#" ' +
                            'onmouseover="map.showInfoInPanel(\'' + placeId +
                            '\'); return false;" id="' + placeId +
                            '">' + placeId + '</a>';

            $('#main-map').prepend(htmlString);
          }

          var extraClass = (self.loansInPlace[placeId].length % 2 == 0) ?
                                'odd' : 'even';
          self.loansInPlace[placeId].push(self.data.loanInfoWithTemplate(loan,
            '<div class="loan-info ' + extraClass +
              '"><a href="LOANLINK"><img src="LOANSMALLIMGURL" width="80" ' +
              'height="80" LOANTOWN, LOANCOUNTRY" /></a>' +
              '<div class="loan-title"><a href="LOANLINK">BORROWERNAME</a></div>' +
              '<div class="loanuse">LOANUSE</div>' +
              '<div class="loanstatus">LOANSTATUS</div>' +
              '<div class="loansectoractivity">LOANSECTOR - LOANACTIVITY</div>' +
              '</div>'));
        });
    };

    this.showInfoInPanel = function (locationId) {
        $('#info-panel').html(this.loansInPlace[locationId].join(''));
    };

    return true;
};
