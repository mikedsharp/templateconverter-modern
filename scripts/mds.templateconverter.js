/*
    Author: Mike Sharp 
    Created: 10-May-2014 
    Modified: 12-May-2014
    Description: SaleCycle V1 to V2 Email template converter/parser. 
    Version: 0.02
*/

__mds = (typeof __mds == "undefined") ? {} : __mds;
__mds.templateconverter = __mds.templateconverter || {};

__mds.templateconverter.markup = {
    "style": {},
    "repeaterMarkup": {},
    "outerRepeaterMarkup": {}
};

__mds.templateconverter.placeholderData = {
    "sessionData": [],
    "innerRepeaterItemData": [],
    "outerRepeaterItemData": []
};

__mds.templateconverter.boilerplateTemplate = '';

__mds.templateconverter.bodyText = '';


// I've added this to my project from Stackoverflow: http://stackoverflow.com/questions/280793/case-insensitive-string-replacement-in-javascript
// credit where credit is due. This prepares a string for a regex search when you don't want the regex engine to recognise any of the regex characters
function preg_quote(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

__mds.templateconverter.converttemplate = function (str) {
    var body, style;
    var sessionDataSection = '';


    // clear UI for new conversion 
    __mds.templateconverter.cleardata();

    __mds.templateconverter.extractmarkup(document.getElementById('templateArea').value);
    __mds.templateconverter.extractstyle(document.getElementById('templateArea').value);

    // update placeholders to use Razor syntac
    __mds.templateconverter.markup.outerRepeaterMarkup = __mds.templateconverter.convertplaceholders('firstProduct', __mds.templateconverter.markup.outerRepeaterMarkup);

    // do we have a repeater? 
    if (__mds.templateconverter.markup.repeaterMarkup != null) {
        __mds.templateconverter.markup.repeaterMarkup = __mds.templateconverter.convertplaceholders('product', __mds.templateconverter.markup.repeaterMarkup);

    }
    __mds.templateconverter.loadboilerplatetemplate();
    __mds.templateconverter.addouterrepeatermarkuptotemplate(); 
    // if we have repeater, add that markup (include razor iteration code) back into template 
    if (__mds.templateconverter.markup.repeaterMarkup != null) {
        __mds.templateconverter.replaceitemrepeater();
        __mds.templateconverter.replaceitemrepeaterdata();
    }
    //
    __mds.templateconverter.replaceitemrepeater();
    __mds.templateconverter.applysessiondata();
    __mds.templateconverter.upgradelinks();
    __mds.templateconverter.escapemediaqueries();
    __mds.templateconverter.addstyletotemplate();
    __mds.templateconverter.setoutputmarkup(__mds.templateconverter.bodyText);
}

__mds.templateconverter.cleardata = function () {

    __mds.templateconverter.markup = {
        "style": {},
        "repeaterMarkup": {},
        "outerRepeaterMarkup": {}
    };

    __mds.templateconverter.placeholderData = {
        "sessionData": [],
        "innerRepeaterItemData": [],
        "outerRepeaterItemData": []
    };

    __mds.templateconverter.bodyText = '';
    // clear results view
    document.getElementById('bodyArea').value = ''; 

}

__mds.templateconverter.addouterrepeatermarkuptotemplate = function () {
    // add markup to template 
    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split('@(templateBody)').join(__mds.templateconverter.markup.outerRepeaterMarkup);
}
__mds.templateconverter.loadboilerplatetemplate = function () {
    // load boilerplate template into body 
    __mds.templateconverter.bodyText = __mds.templateconverter.boilerplateTemplate;
}
__mds.templateconverter.replaceitemrepeater = function () {
    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split('@(ItemRepeater)').join('@foreach(var product in Model.Products)\n{\n<div>@(itemRepeaterData)\n' + __mds.templateconverter.markup.repeaterMarkup + '</div>\n}\n');
}
__mds.templateconverter.setoutputmarkup = function (markup) {
    document.getElementById('bodyArea').value = markup;
}

__mds.templateconverter.addstyletotemplate = function () {
    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split("@(templateStyle)").join(__mds.templateconverter.markup.style);
}

__mds.templateconverter.escapemediaqueries = function () {
    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split('@media').join('@@media');
    __mds.templateconverter.markup.style = __mds.templateconverter.markup.style.split('@media').join('@@media');
}

__mds.templateconverter.applysessiondata = function () {

    //define a session data section
    sessionDataSection = '';
    for (var i = 0; i < __mds.templateconverter.placeholderData['sessionData'].length; i++) {
        sessionDataSection += '\n' + __mds.templateconverter.placeholderData['sessionData'][i];
    }

    for (var i = 0; i < __mds.templateconverter.placeholderData['outerRepeaterItemData'].length; i++) {
        sessionDataSection += '\n' + __mds.templateconverter.placeholderData['outerRepeaterItemData'][i];
    }

    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split('@(sessionFields)').join(sessionDataSection);
}

__mds.templateconverter.extractstyle = function (html) {
    // Some assumptions made here, the first style tag is start of CSS, file may contain additional closing style tags, so I'm taking last closing style tag of 'head' as my end point
    __mds.templateconverter.markup.style = html.substring(html.indexOf('<style'), html.lastIndexOf('</head>'));
    __mds.templateconverter.markup.style = __mds.templateconverter.markup.style.substring(__mds.templateconverter.markup.style.indexOf('>') + 1, __mds.templateconverter.markup.style.lastIndexOf('</style>'));
}

__mds.templateconverter.extractmarkup = function (html) {

    var start, end, startLength, endLength;
    var bodyText = html.substring(html.indexOf('<body'));
    bodyText = bodyText.substring(bodyText.indexOf('>') + 1, bodyText.lastIndexOf('</body>'));

    //repeaters 
    if (bodyText.match(/(<!--){0,1}\[\[productlist:start\]\](-->){0,1}/gi) != null && bodyText.match(/(<!--){0,1}\[\[productlist:end\]\](-->){0,1}/gi) != null) {
        start = bodyText.indexOf(bodyText.match(/(<!--){0,1}\[\[productlist:start\]\](-->){0,1}/gi)[0]);
        end = bodyText.indexOf(bodyText.match(/(<!--){0,1}\[\[productlist:end\]\](-->){0,1}/gi)[0]);
        startLength = bodyText.match(/(<!--){0,1}\[\[productlist:start\]\](-->){0,1}/gi)[0].length;
        endLength = bodyText.match(/(<!--){0,1}\[\[productlist:end\]\](-->){0,1}/gi)[0].length;
        __mds.templateconverter.markup.outerRepeaterMarkup = bodyText.replace(bodyText.substring(start, end + endLength), '\n@(ItemRepeater)\n');
        __mds.templateconverter.markup.repeaterMarkup = bodyText.substring(start + startLength, end);

    }
    else {
        __mds.templateconverter.markup.outerRepeaterMarkup = bodyText;
        __mds.templateconverter.markup.repeaterMarkup = null;

    }

}

__mds.templateconverter.splitbodystyle = function (html) {

    // Some assumptions made here, the first style tag is start of CSS, file may contain additional closing style tags, so I'm taking last closing style tag of 'head' as my end point
    __mds.templateconverter.styleText = html.substring(html.indexOf('<style'), html.lastIndexOf('</head>'));
    __mds.templateconverter.styleText = __mds.templateconverter.styleText.substring(__mds.templateconverter.styleText.indexOf('>') + 1, __mds.templateconverter.styleText.lastIndexOf('</style>'));

    // take first closing tag (of body) as place to start parsing 
    __mds.templateconverter.bodyText = html.substring(html.indexOf('<body'));
    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.substring(__mds.templateconverter.bodyText.indexOf('>') + 1, __mds.templateconverter.bodyText.lastIndexOf('</body>'));

}

__mds.templateconverter.convertplaceholders = function (prefix, markup) {
    // regex gets all old style placeholders  (without the colon)
    //var placeholders = __mds.templateconverter.bodyText.match(/\[\[[^\^:[]+\]\]/g);

    var placeholders = markup.match(/(\[){2}([^\[:\]])+(\]){2}/gi);

    if (placeholders != null && placeholders.length > 0) {
        // remove duplicates (case sensitive)
        placeholders = placeholders.filter(function (elem, pos, self) {
            return self.indexOf(elem) == pos;
        });

        // convert all 'default' placeholders, i.e. the old style ones that usually correlate with a DB field
        __mds.templateconverter.schema.placeholders.map(function (obj) {
            for (var i = 0; i < placeholders.length; i++) {
                // check each placeholder in a non-case sensitive manner 
                if (obj.name.toLowerCase() == placeholders[i].toLowerCase()) {

                    if (typeof obj.legacy == "undefined" || obj.legacy == null) {

                        // added prepend and append variables so we can replace functionality lost from moving to V2 portal (e.g. image replace URL) 
                        var prepend = '';
                        var append = '';

                        if (typeof obj.prepend != "undefined" && obj.prepend != null) {
                            prepend = eval('document.getElementById(\"' + obj.prepend.id + '\").' + obj.prepend.value);
                        }
                        if (typeof obj.append != "undefined" && obj.append != null) {
                            append = eval('document.getElementById(\"' + obj.append.id + '\").' + obj.append.value);
                        }


                        var reg = new RegExp("(" + preg_quote(placeholders[i]) + ")", 'gi');


                        if (typeof obj.code != "undefined" && obj.code != null) {

                            // add a declaration in the session or item data sections (in C#) 
                            if (obj.scope == 'session') {
                                markup = markup.replace(reg, prepend + '@(' + prefix + '_session_' + obj.razor + ')' + append);
                                __mds.templateconverter.placeholderData['sessionData'].push(obj.code.split('[[scope]]_').join(prefix + '_session_').split('[[scope]]').join(prefix + '_session'));
                            }
                            else if (obj.scope == 'item') {
                                markup = markup.replace(reg, prepend + '@(' + prefix + '_' + obj.razor + ')' + append);
                                if (prefix == 'firstProduct') {
                                    __mds.templateconverter.placeholderData['outerRepeaterItemData'].push(obj.code.split('[[scope]]_').join(prefix + '_').split('[[scope]]').join(prefix));
                                }
                                else if (prefix == 'product') {
                                    __mds.templateconverter.placeholderData['innerRepeaterItemData'].push(obj.code.split('[[scope]]_').join(prefix + '_').split('[[scope]]').join(prefix));
                                }
                            }
                        }
                        break;

                    }
                    else if (typeof obj.legacy != "undefined" || obj.legacy != null && obj.legacy == true) {
                        // lowercase legacy placeholders
                        markup = markup.split(placeholders[i]).join(placeholders[i].toLowerCase());
                    }
                    // make no changes if template in V2 is using the legacy placeholder
                }
            }
        });
    }



    // now for the 'custom' session and item fields that contain a colon, these are session and items fields defined by implementation in the script
    var customPlaceholders = markup.match(/\[\[([iI]|[sS])(ession|tem):[A-z0-9-_^\[]+\]\]/gi);

    if (customPlaceholders != null && customPlaceholders.length > 0) {
        // remove duplicates (in a case insensitive manner)
        customPlaceholders = customPlaceholders.filter(function (elem, pos, self) {
            return self.indexOf(elem) == pos;
        });

        for (var i = 0; i < customPlaceholders.length; i++) {
            //extract the placeholder name from old placeholder 
            var itemVar = customPlaceholders[i].substring(customPlaceholders[i].indexOf(':') + 1).match(/[^\]]+/);



            // check the scope of the placeholder and push into appropriate data section 
            if (customPlaceholders[i].toLowerCase().indexOf('item:') > -1) {

                if (document.getElementById('downcasePlaceholdersYes').checked) {
                    itemVar[0] = itemVar[0].toLowerCase();
                }

                // paste new style razor placeholder into markup (global replace)
                markup = markup.split(customPlaceholders[i]).join('@(' + prefix + '_' + itemVar[0] + ')');

                if (prefix == "firstProduct") {
                    __mds.templateconverter.placeholderData['outerRepeaterItemData'].push('var ' + prefix + '_' + itemVar[0] + ' = ' + '@TryGetItemField(@' + prefix + ', \"' + itemVar[0] + '\");');
                }
                else if (prefix == "product") {
                    __mds.templateconverter.placeholderData['innerRepeaterItemData'].push('var ' + prefix + '_' + itemVar[0] + ' = ' + '@TryGetItemField(@' + prefix + ', \"' + itemVar[0] + '\");');
                }


            }
            else if (customPlaceholders[i].toLowerCase().indexOf('session:') > -1) {
                markup = markup.split(customPlaceholders[i]).join('@(' + prefix + '_' + 'session_' + itemVar[0] + ')');
                __mds.templateconverter.placeholderData['sessionData'].push('var ' + prefix + '_' + 'session_' + itemVar[0] + ' = ' + '@TryGetSessionField(\"' + itemVar[0] + '\");');
            }
        }
    }
    return markup;
}



__mds.templateconverter.replaceitemrepeaterdata = function () {

    var itemDataString = '';

    // if (productListStart != null && productListStart.length > 0 && productListEnd != null && productListEnd.length > 0) {
    itemDataString = '\n@{ ';

    for (var i = 0; i < __mds.templateconverter.placeholderData['innerRepeaterItemData'].length; i++) {
        itemDataString += '\n' + __mds.templateconverter.placeholderData['innerRepeaterItemData'][i];
    }

    itemDataString += '\n}\n';

    __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.split('@(itemRepeaterData)').join(itemDataString);

}

__mds.templateconverter.upgradelinks = function () {
    // match all links, it is assumed that a link will always close with a closing speech mark with the old style 
    var links = __mds.templateconverter.bodyText.match(/\[\[[Ll]ink\]\][0-9]+\|[^"]+/g);

    if (links != null && links.length > 0) {

        links.map(function (el) {
            // remove the old start tag and replace with new starting and closing tags
            var replaceWith = el.replace(/\[\[[Ll]ink\]\][0-9]+\|/, '[[link]]');
            replaceWith += '[[/link]]';
            __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.replace(el, replaceWith);
        });
    }
}

__mds.templateconverter.gatherLinks = function () {
    var links = null;
    var indexes = [];
    indexes.push(0);
    __mds.templateconverter.bodyText = document.getElementById('bodyArea').value;
    if (__mds.templateconverter.bodyText.length > 0) {
        links = __mds.templateconverter.bodyText.match(/\[\[link\]\](.*?)\[\[\/link\]\]/g);

        if (links != null) {
            for (var i = 0; i < links.length; i++) {
                //   indexes.push(__mds.templateconverter.bodyText.substring(indexes[i], __mds.templateconverter.bodyText.length - indexes[i]).search(/\[\[link\]\](.*?)\[\[\/link\]\]/g));
                //   console.log(__mds.templateconverter.bodyText.substring(indexes[i], __mds.templateconverter.bodyText.length - indexes[i]).search(/\[\[link\]\](.*?)\[\[\/link\]\]/g));
            }
        }


    }
}

__mds.templateconverter.compileSalutation = function () {

    if ($('#salutationList').children().length == 0) {
        var salutationText = $('#fallbackSalutationArea').val().trim();
        salutationText = salutationText.split(' ').join('&nbsp;');
        salutationText = '<text>' + salutationText + '</text>';
        __mds.templateconverter.bodyText = __mds.templateconverter.bodyText.replace(/(\[\[customername\]\])/gi, salutationText);
    }
    else {
        var razorLadder = '';

        var salutationRules = [];

        $.each($('#salutationList').children(), function (ix) {
            var salutationString = '';
            var conditions = [];
            salutationString = $(this).find('.salutationArea:first').val();
            conditions = salutationString.match(/(@Model.Customer){1}([^\s-])+/gi);

            salutationString = 'if('

            console.log('**** START OF CONDITION ' + ix + ' *****');
            for (var i = 0; i < conditions.length; i++) {
                salutationString += (' ' + conditions[i] + ' != null ' + '&& string.Format({0}, ' + conditions[i] + ') != "" ' + ((i < conditions.length - 1) ? '&&' : ''));
            }
            salutationString += ')';

            if (ix != 0) {
                salutationString = 'else ' + salutationString;
            }

            console.log(salutationString);
        });

    }

}

document.addEventListener('DOMContentLoaded', function () {
    //initialse fancy JQuery UI, this is the only part of the code that references JQuery, no other parts should use it
    $("#tabs").tabs();

    var icons = {
        header: " ui-icon-gear"
    };

    $("#accordion").accordion({
        header: "h3", collapsible: true, active: false, icons: icons
    });
    $("#radioEncodeStyle").buttonset();
    $("#radioEncodeBody").buttonset();
    $('#radioEscapeAt').buttonset();
    $('#radioDowncasePlaceholders').buttonset();
    //  $('#radioOverrideCurrency').buttonset();
    $('#radioUseCustomSalutation').buttonset();
    $("input[type=submit], a, button")
     .button();


    //SALUTATION 
    $('#addSaluation').on('click', function (event) {
        console.log('add another salutation to DOM');
        $('#salutationList').append(
              '<li>'
                    + '<div class="ui-widget-header ui-corner-all salutationSection">'
                     + '<textarea class="salutationArea"></textarea>'
                      + '<ul>'
                       + '<li>'
                        + '<button class="salutationRaisePriority"><span class="ui-icon ui-icon-arrowthick-1-n "></span></button>'
                         + '</li>'
                          + '<li>'
                           + '<button class="salutationLowerPriority"><span class="ui-icon ui-icon-arrowthick-1-s"></span></button>'
                           + '</li>'
                        + '</ul>'
                         + ' <button class="removeSalutationOption"><span class="">Remove</span></button>'
                    + '</div>'
                + '</li>'
        )

        $('#salutationList button').button();
    });

    $('#salutationList').on('click', 'button.removeSalutationOption', function (event) {
        $(this).parent().parent().remove();
    });

    $('#salutationList').on('click', '.salutationLowerPriority', function (event) {
        var current = $(this).parent().parent().parent().parent();
        current.next().after(current);
    });
    $('#salutationList').on('click', '.salutationRaisePriority', function (event) {
        var current = $(this).parent().parent().parent().parent();
        current.prev().before(current);
    });



    var button, templateArea;
    button = document.getElementById('convert');
    templateArea = document.getElementById('templateArea');
    var schemaRequest;

    schemaRequest = new XMLHttpRequest();
    schemaRequest.open('GET', 'schema/placeholder.js', true);

    schemaRequest.onload = function () {
        if (schemaRequest.status >= 200 && schemaRequest.status < 400) {
            // obtain the schema containing the rules for dealing with old placeholders 
            __mds.templateconverter.schema = JSON.parse(schemaRequest.responseText);

            // add all of our listeners 
            // button click event to fire process off
            button.addEventListener('click', function (event) {
                if (templateArea.value.length > 0) {
                    __mds.templateconverter.converttemplate(templateArea.value);
                }
                else {
                    alert('Please Add a V1 Template to the \'Raw HTML\' Field');
                }
            });

        } else {
            // We reached our target server, but it returned an error
            console.log('failed to retrieve schema');
        }
    };

    schemaRequest.onerror = function () {
        // There was a connection error of some sort
        console.log('failed to retrieve schema');
    };

    // get schema on page ready
    schemaRequest.send();


    var boilerplateRequest;

    boilerplateRequest = new XMLHttpRequest();
    boilerplateRequest.open('GET', 'schema/Boilerplate.txt', true);

    boilerplateRequest.onload = function () {
        if (boilerplateRequest.status >= 200 && boilerplateRequest.status < 400) {
            // obtain base template for building razor emails
            __mds.templateconverter.boilerplateTemplate = boilerplateRequest.responseText;

        }
    };

    boilerplateRequest.onerror = function () {
        // There was a connection error of some sort
        console.log('failed to retrieve boilerplate template');
    };

    // get schema on page ready
    boilerplateRequest.send();
});

