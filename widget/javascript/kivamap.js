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
                              '<div class="loansectoractivity"><a href="#" ' +
                              'onclick="map.showSectorInfoInPanel' +
                              '(\'LOANSECTOR\'); return false">LOANSECTOR' +
                              '</a> - LOANACTIVITY</div>' +
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
            $('#'+placeId).click(f);

            self.htmlChunksForPlace[placeId] =
                ['<div class="loan-group-title">' +
                    loan.location.country +
                    ' (<a href="#" ' +
                       'onclick="map.showSectorDirectoryInPanel(); ' +
                       'return false">Browse Sectors</a>)</div>'];
          }

          self.htmlChunksForPlace[placeId].push(loanHtml);

          var sectorId = loan.sector;
          if (self.htmlChunksForSector[sectorId] == undefined) {
              self.htmlChunksForSector[sectorId] =
                  ['<div class="loan-group-title">' + loan.sector +
                    ' (<a href="#" ' +
                        'onclick="map.showSectorDirectoryInPanel(); ' +
                        'return false">All Sectors</a>)</div>'];
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

    this.showSectorInfoInPanel = function (sectorId) {
        $('#info-panel').html(this.htmlChunksForSector[sectorId].join(''));
    };

    this.toggleSectorStats = function () {
        var sectorInfo = {};
        var sectorList = [];
        this.data.eachLoan(function () {
            var s = this.sector;
            if (sectorInfo[s] == undefined) {
                sectorInfo[s] = {loan_amount:   0,
                                 funded_amount: 0};
                sectorList.push(s);
            }
            sectorInfo[s].loan_amount   += parseFloat(this.loan_amount);
            sectorInfo[s].funded_amount += parseFloat(this.funded_amount);
        });
        var sectorCount = 0;
        var plotInfo    = [];
        var axisLabels  = [];
        var loanAmount  = [];
        var fundedAmount = [];
        jQuery.each(sectorList.sort(), function () {
            loanAmount.push([sectorCount, sectorInfo[this].loan_amount]);
            fundedAmount.push([sectorCount, sectorInfo[this].funded_amount]);
            axisLabels.push([sectorCount, ""+this]);
            sectorCount++;
        });
        plotInfo.push({data: loanAmount,
                       label: "Needed",
                       lines: {show: true, fill: true},
                       points: {show: true, fill: true}});
        plotInfo.push({data: fundedAmount,
                       label: "Funded",
                       lines: {show: true, fill: true},
                       points: {show: true, fill: true}});

        if ($('#stats-container').css('z-index') == -1) {
            $('#stats-container').css('z-index', 5);
        } else {
            $('#stats-container').css('z-index', -1);
        }
        $.plot($('#stats'),
               plotInfo,
               {grid: {autoHighlight: true, tickColor: 'transparent'},
                xaxis: {ticks: axisLabels}});
    };

    this.showSectorDirectoryInPanel = function () {
        var foundSectors = {};
        var sectorList   = [];
        var html = '<div class="loan-group-title">Loans by Sector ' +
                        '(<a href="#" ' +
                            'onclick="map.toggleSectorStats(); ' +
                                     'return false">toggle stats</a>)</div>';
        this.data.eachLoan(function () {
            var s = this.sector;
            if (foundSectors[s] == undefined) {
                foundSectors[s] = 1;
                sectorList.push(s);
            }
        });
        jQuery.each(sectorList.sort(), function () {
            html += '<div class="loan-sector"><a href="#" ' +
                    'onclick="map.showSectorInfoInPanel(\'' +
                    this + '\'); return false">' + this + '</a></div>';
        });
        html += '<div class="loan-info instructions"><p>Click on a ' +
                'dot to get information about loans in that country. ' +
                'Click on a name or image for information and/or lend ' +
                'money on <a href="http://www.kiva.org">Kiva</a>.</p></div>';
        $('#info-panel').html(html);
    };

    return true;
};
