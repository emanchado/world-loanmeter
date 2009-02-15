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
            [lat, lon] = loan.location.geo.pairs.split(' ');

            mapMaker.placeIdByLatitudeAndLongitude('#'+placeId,
                                                   parseFloat(lat),
                                                   parseFloat(lon));
            htmlString = '<a class="location" href="#" ' +
                            'id="' + placeId +
                            '">' + placeId + '</a>';

            $('#main-map').prepend(htmlString);
            var f = function () { map.showInfoInPanel(placeId); return false };
            $('#'+placeId).mouseover(f).focus(f);

            self.loansInPlace[placeId] = ['<div class="loan-location">' +
                                            loan.location.town + ', ' +
                                            loan.location.country
                                            '</div>'];
          }

          var infoExtraClass = (self.loansInPlace[placeId].length % 2 == 0) ?
                                'odd' : 'even';
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

    this.showInfoInPanel = function (locationId) {
        $('#info-panel').html(this.loansInPlace[locationId].join(''));
    };

    return true;
};
