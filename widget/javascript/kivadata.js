function KivaData () {
    this.dataSource = 'http://api.kivaws.org/v1/loans/newest.json';
    // See http://build.kiva.org/docs/data/loans
    this.linkTemplate = 'http://kiva.org/app.php?page=businesses&action=about&id=LOANID';
    // See http://build.kiva.org/docs/data/media
    this.imageTemplates = [
        {"id":      1,
         "pattern": "http:\/\/www.kiva.org\/img\/<size>\/<id>.jpg"}
    ];
    // Cached copy of the loan information
    this.loanInfo = {'loans': []};
    // Number of loans to fetch
    this.numberLoans = 20;

    // Fetches the loan data from the data source. If dataSource is a string
    // (the default unless overriden), it's interpreted as a URL and an Ajax
    // call is made to fetch the data. If it's a function, the function is
    // called without parameters. Otherwise, its value is taken directly as the
    // value to fetch.
    // Parameters:
    //  n - Number of times the function has been called, including current.
    //  f - Callback function. It will be called with the received data.
    this.fetchLoanData = function(n, f) {
        if (typeof(this.dataSource) == 'string') {
            finalUrl = this.dataSource + "?page=" + n
            opera.postError('Requesting from ' + finalUrl);
            jQuery.getJSON(finalUrl, {}, f);
        } else if (typeof(this.dataSource) == 'function') {
            f(this.dataSource(n));
        } else {
            f(this.dataSource);
        }
    };

    // Adds the given loans to the current list of loans. If the second
    // parameter, atMost, is given, no more than that number of loans are
    // loaded
    this.addLoans = function(data, atMost) {
        var self = this;
        if (!atMost) { atMost = 9999; }
        jQuery.each(data.loans, function () {
            if (atMost-- > 0) {
                self.loanInfo.loans.push(this);
            }
        });
    };

    // Loads loans from the data source until there is no more data, or there
    // are enough (numberLoans property)
    this.loadLoans = function(n, f) {
        var self = this;
        var initialLoans = self.loanInfo.loans.length;
        if (initialLoans < self.numberLoans) {
            self.fetchLoanData(n, function (data) {
                                      self.addLoans(data,
                                                    self.numberLoans -
                                                       initialLoans);
                                      // If we didn't get any data stop now
                                      if (self.loanInfo.loans.length >
                                               initialLoans) {
                                          self.loadLoans(n+1, f);
                                      }
                                      else if (f) {
                                          f();
                                      }
                                  });
        } else {
            if (f) {
                f();
            }
        }
    };

    // Refresh the copy of the loan information. Takes an optional function,
    // that will be executed if given
    this.refresh = function (f) {
        var self = this;
        this.loanInfo = {'loans': []};
        this.loadLoans(1, f);
    };

    this.eachLoan = function(f) {
        jQuery.each(this.loanInfo.loans, f);
    };

    this._findImageTemplate = function (templateId) {
        var returnValue = undefined;
        jQuery.each(this.imageTemplates, function () {
            if (this.id == templateId) {
                returnValue = this.pattern;
            }
        });
        return returnValue;
    };

    // Return the image template for the given templateId. If necessary, it
    // will try to fetch the image templates from the Kiva website
    this.getImageTemplate = function (templateId) {
        if (this._findImageTemplate(templateId) == undefined) {
            var result = jQuery.getJSON('http://api.kivaws.org/v1/templates/images.json');
            this.imageTemplates = result.templates;
        }
        return this._findImageTemplate(templateId);
    };

    // loanInfoWithTemplate:
    // Interpolates certain special strings in the given "template". The
    // interpolation values are taken from the given "loan". It returns the
    // final, interpolated string
    this.loanInfoWithTemplate = function (loan, template) {
        return template.replace(/LOANLINK/g,
                                this.linkTemplate.replace('LOANID', loan.id)).
                        replace(/LOANSMALLIMGURL/g,
                                this.getImageTemplate(loan.image.template_id).
                                    replace('<size>', 'w80h80').
                                    replace('<id>',   loan.image.id)).
                        replace(/BORROWERNAME/g, loan.name).
                        replace(/LOANTOWN/g, loan.location.town).
                        replace(/LOANCOUNTRY/g, loan.location.country).
                        replace(/LOANACTIVITY/g, loan.activity).
                        replace(/LOANSECTOR/g, loan.sector).
                        replace(/LOANUSE/g, loan.use).
                        replace(/LOANSTATUS/g,
                                loan.status.charAt(0).toUpperCase() +
                                    loan.status.substr(1) + ' ($' +
                                    (parseFloat(loan.loan_amount) -
                                     parseFloat(loan.funded_amount)) +
                                    ' to go)');
    };

    return true;
};
