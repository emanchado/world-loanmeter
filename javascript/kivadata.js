function kivaData () {
    // See http://build.kiva.org/docs/data/loans
    this.linkTemplate = 'http://kiva.org/app.php?page=businesses&action=about&id=LOANID';
    // See http://build.kiva.org/docs/data/media
    this.imageTemplates = [
        {"id":      1,
         "pattern": "http:\/\/www.kiva.org\/img\/<size>\/<id>.jpg"}
    ];

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

    // loanInfo: for now, just a static copy of some old data retrieved from
    // the Kiva API
    this.loanInfo = {"paging":{"page":1,"total":194,"page_size":20,"pages":10},"loans":[{"id":88443,"name":"Fatoumata Coly","status":"fundraising","loan_amount":775,"funded_amount":225,"borrower_count":1,"image":{"id":269902,"template_id":1},"activity":"Cloth & Dressmaking Supplies","sector":"Retail","use":"sale of locally dyed cloth made using indigo","location":{"country":"Senegal","town":"Ziguinchor","geo":{"level":"town","type":"point","pairs":"12.5833 -16.2719"}},"partner_id":105,"posted_date":"2009-02-11T19:30:10Z","description":{"languages":["fr","en"]}},{"id":88441,"name":"Marie Gomis","status":"fundraising","loan_amount":600,"funded_amount":75,"borrower_count":1,"image":{"id":269897,"template_id":1},"activity":"Food Market","sector":"Food","use":"bolster her business buying and selling palm oil and lemon juice","location":{"country":"Senegal","town":"Ziguinchor","geo":{"level":"town","type":"point","pairs":"12.5833 -16.2719"}},"partner_id":105,"posted_date":"2009-02-11T19:30:09Z","description":{"languages":["fr","en"]}},{"id":88452,"name":"Lydia Afriyie","status":"fundraising","loan_amount":300,"funded_amount":25,"borrower_count":1,"image":{"id":269917,"template_id":1},"activity":"Traveling Sales","sector":"Retail","use":"To buy increased stock of plastic goods and kitchen sets  ","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T19:20:07Z","description":{"languages":["en","en"]}},{"id":88454,"name":"Kwami Kodja","status":"fundraising","loan_amount":900,"funded_amount":50,"borrower_count":1,"image":{"id":269931,"template_id":1},"activity":"Poultry","sector":"Agriculture","use":"purchase of hens for re-sale","location":{"country":"Togo","town":"Agoe","geo":{"level":"country","type":"point","pairs":"8 1.16667"}},"partner_id":111,"posted_date":"2009-02-11T19:20:07Z","description":{"languages":["fr","en"]}},{"id":88451,"name":"Svetlana Suhomlin","status":"fundraising","loan_amount":650,"funded_amount":75,"borrower_count":1,"image":{"id":269909,"template_id":1},"activity":"Office Supplies","sector":"Retail","use":"to increase her assortment","location":{"country":"Ukraine","town":"Ivano-frankivsk","geo":{"level":"town","type":"point","pairs":"48.8842 24.6861"}},"partner_id":26,"posted_date":"2009-02-11T19:10:07Z","description":{"languages":["en","en"]}},{"id":88449,"name":"Esther Adu","status":"fundraising","loan_amount":750,"funded_amount":75,"borrower_count":1,"image":{"id":269910,"template_id":1},"activity":"Food Market","sector":"Food","use":"To buy cereals, yams, and traveling bags for re-sale  ","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T19:00:11Z","description":{"languages":["en","en"]}},{"id":88448,"name":"Alhasan Ursala","status":"fundraising","loan_amount":300,"funded_amount":100,"borrower_count":1,"image":{"id":269907,"template_id":1},"activity":"Catering","sector":"Food","use":"To buy raw materials like maize, meat, fish, vegetables, firewood, and bunches of bananas","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T19:00:11Z","description":{"languages":["en","en"]}},{"id":88446,"name":"Afia Boadu","status":"fundraising","loan_amount":375,"funded_amount":175,"borrower_count":1,"image":{"id":269904,"template_id":1},"activity":"Food Production\/Sales","sector":"Food","use":"To buy more bags of palm nuts and an electric milling machine ","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T18:50:08Z","description":{"languages":["en","en"]}},{"id":88045,"name":"Ala Apoka","status":"fundraising","loan_amount":375,"funded_amount":0,"borrower_count":1,"image":{"id":268973,"template_id":1},"activity":"Grocery Store","sector":"Food","use":"To procure groceries.","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T18:50:08Z","description":{"languages":["en","en"]}},{"id":88043,"name":"Abena Yeboah","status":"fundraising","loan_amount":675,"funded_amount":175,"borrower_count":1,"image":{"id":268968,"template_id":1},"activity":"Food Market","sector":"Food","use":" To procure bananas and cassavas. ","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T18:40:09Z","description":{"languages":["en","en"]}},{"id":88444,"name":"Akosua Kosah","status":"fundraising","loan_amount":375,"funded_amount":250,"borrower_count":1,"image":{"id":269901,"template_id":1},"activity":"Food Production\/Sales","sector":"Food","use":"to buy more palm nuts and bananas to restock her inventory","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T18:30:10Z","description":{"languages":["en","en"]}},{"id":88445,"name":"Olena Koolbit","status":"fundraising","loan_amount":975,"funded_amount":225,"borrower_count":1,"image":{"id":269895,"template_id":1},"activity":"Manufacturing","sector":"Manufacturing","use":"to purchase raw materials","location":{"country":"Ukraine","town":"Ivano-frankivsk","geo":{"level":"town","type":"point","pairs":"48.8842 24.6861"}},"partner_id":26,"posted_date":"2009-02-11T18:30:09Z","description":{"languages":["en","en"]}},{"id":88440,"name":"Happy Habibu's Group","status":"fundraising","loan_amount":1300,"funded_amount":150,"borrower_count":7,"image":{"id":269896,"template_id":1},"activity":"Clothing Sales","sector":"Clothing","use":"To open a salon","location":{"country":"Tanzania","town":"Dar Es Salaam","geo":{"level":"town","type":"point","pairs":"-6.8 39.2833"}},"partner_id":87,"posted_date":"2009-02-11T18:20:09Z","description":{"languages":["en","en"]}},{"id":88437,"name":"Eribarik Paulo's Group","status":"fundraising","loan_amount":3050,"funded_amount":25,"borrower_count":16,"image":{"id":269880,"template_id":1},"activity":"Catering","sector":"Food","use":"To increase his stock of food for food service","location":{"country":"Tanzania","town":"Dar Es Salaam","geo":{"level":"town","type":"point","pairs":"-6.8 39.2833"}},"partner_id":87,"posted_date":"2009-02-11T18:20:09Z","description":{"languages":["en","en"]}},{"id":88424,"name":"Asia Kassimu's Group","status":"fundraising","loan_amount":4875,"funded_amount":50,"borrower_count":16,"image":{"id":269855,"template_id":1},"activity":"Soft Drinks","sector":"Food","use":"To reinforce the working capital of the various businesses","location":{"country":"Tanzania","town":"Dar Es Salaam","geo":{"level":"town","type":"point","pairs":"-6.8 39.2833"}},"partner_id":87,"posted_date":"2009-02-11T18:10:08Z","description":{"languages":["en","en"]}},{"id":88169,"name":"Mari Sulemana","status":"fundraising","loan_amount":375,"funded_amount":75,"borrower_count":1,"image":{"id":269196,"template_id":1},"activity":"Food Production\/Sales","sector":"Food","use":"To buy more raw materials for her porridge business.","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T18:00:08Z","description":{"languages":["en","en"]}},{"id":88418,"name":"Emmanuel  Amofah","status":"fundraising","loan_amount":375,"funded_amount":75,"borrower_count":1,"image":{"id":269845,"template_id":1},"activity":"Manufacturing","sector":"Manufacturing","use":" additional capital  for the production of the palm oil","location":{"country":"Ghana","town":"Siwdo","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":91,"posted_date":"2009-02-11T18:00:08Z","description":{"languages":["en","en"]}},{"id":88420,"name":"Richard  Boafo","status":"fundraising","loan_amount":225,"funded_amount":175,"borrower_count":1,"image":{"id":269848,"template_id":1},"activity":"Bakery","sector":"Food","use":"to buy sugar, flour, margarine etc. for baking bread","location":{"country":"Ghana","town":"Siwdo","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":91,"posted_date":"2009-02-11T18:00:08Z","description":{"languages":["en","en"]}},{"id":84740,"name":"Musalam Sultonova","status":"fundraising","loan_amount":1025,"funded_amount":325,"borrower_count":1,"image":{"id":258871,"template_id":1},"activity":"Clothing Sales","sector":"Clothing","use":"To buy women's pullovers","location":{"country":"Tajikistan","town":"Dushanbe","geo":{"level":"town","type":"point","pairs":"38.56 68.7739"}},"partner_id":47,"posted_date":"2009-02-11T17:56:44Z","description":{"languages":["ru","en"]}},{"id":88166,"name":"Salamatu Salifu","status":"fundraising","loan_amount":450,"funded_amount":100,"borrower_count":1,"image":{"id":269190,"template_id":1},"activity":"Fruits & Vegetables","sector":"Food","use":"To buy more palm nut fruits and bananas to expand her business.","location":{"country":"Ghana","town":"Offinsu","geo":{"level":"country","type":"point","pairs":"8 -2"}},"partner_id":88,"posted_date":"2009-02-11T17:50:08Z","description":{"languages":["en","en"]}}]};

    return true
};
