function kivaData () {
    // See http://build.kiva.org/docs/data/loans
    this.linkTemplate = 'http://kiva.org/app.php?page=businesses&action=about&id=LOANID';
    // See http://build.kiva.org/docs/data/media
    this.imageTemplates = [
        {"id":      1,
         "pattern": "http:\/\/www.kiva.org\/img\/<size>\/<id>.jpg"}
    ];
    // Cached copy of the loan information
    this.loanInfo = undefined;

    // Refresh the copy of the loan information. Takes an optional function,
    // that will be executed if given
    this.refresh = function (f) {
        var self = this;
        jQuery.getJSON('http://api.kivaws.org/v1/loans/newest.json',
                       {},
                       function (data) {
                           self.loanInfo = data;
                           if (f) {
                              f();
                           }
                       });
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
