// ==UserScript==
// @name         Gebäude Übersicht
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Eigene Konfiguration zum ein-/ausblenden von Gebäuden in der Gebäudeübersicht
// @author       Christian (LeitstelleHRO) / Jan (KBOE2)
// @grant        none
// @include      https://www.leitstellenspiel.de/
// ==/UserScript==

(function() {
    'use strict';

    $('.building_selection').each(function() {
        $(this).remove();
    });

    var buttons;

    if (localStorage.buildingListButtons) {
        buttons = JSON.parse(localStorage.buildingListButtons);
    } else {
        buttons = [
            {
                'ids': [0],
                'name': 'Feuerwehr'
            },
            {
                'ids': [2],
                'name': 'Rettung'
            },
            {
                'ids': [6],
                'name': 'Polizei'
            },
            {
                'ids': [9],
                'name': 'THW'
            },
            {
                'ids': [15],
                'name': 'Wasserrettung'
            },
            {
                'ids': [1, 3, 8, 10],
                'name': 'Schulen'
            },
            {
                'ids': [7],
                'name': 'Leitstelle'
            },
            {
                'ids': [5, 12],
                'name': 'SEG/RTH'
            },
            {
                'ids': [11],
                'name': 'Bepol'
            },
            {
                'ids': [13, 17],
                'name': 'PolHeli/Pol-Sonder'
            },
            {
                'ids': [4],
                'name': 'Krankenhäuser'
            }
        ];
        localStorage.buildingListButtons = JSON.stringify(buttons);
    }

    var gebaeude_typen = ['Feuerwache', 'Feuerwehrschule', 'Rettungswache', 'Rettungsschule', 'Krankenhaus', 'Rettungshubschrauber-Station', 'Leitstelle', 'Polizeiwache', 'Polizeischule', 'THW', 'THW Bundesschule', 'Bereitschaftspolizei', 'Schnelleinsatzgruppe (SEG)', 'Polizeihubschrauberstation', 'Bereitstellungsraum', 'Wasserrettung', 'Verbandzellen', 'Polizei-Sondereinheiten'];

    $('#building_panel_heading > .btn-group').append('<a class="btn btn-xs btn-default" id="customizeBuildingFilter">Gebäude-Filter anpassen</a>');

    for (var i = 0; i < buttons.length; i++) {
        $('#btn-group-building-select').append('<a building_type_ids="' + JSON.stringify(buttons[i].ids) + '" class="btn btn-xs btn-success building_selection" id="building_selection_' + buttons[i].name.replace(new RegExp(' ', 'g'), '').toLowerCase() + ' title="Grün = Die Gebäude werden in der Leiste angezeigt. Rot = Die Gebäude werden nicht angezeigt.">' + buttons[i].name + '</a>');
    }

    $('.building_selection').on('click', function() {
        if ($(this).hasClass('btn-success')) {
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
            for (var i = 0; i < JSON.parse($(this).attr('building_type_ids')).length; i++) {
                for (var j = 0; j < $('.building_list_li[building_type_id="' + JSON.parse($(this).attr('building_type_ids'))[i] + '"]').length; j++) {
                    $($('.building_list_li[building_type_id="' + JSON.parse($(this).attr('building_type_ids'))[i] + '"]')[j]).hide();
                }
            }
        } else {
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-success');
            for (var k = 0; k < JSON.parse($(this).attr('building_type_ids')).length; k++) {
                for (var l = 0; l < $('.building_list_li[building_type_id="' + JSON.parse($(this).attr('building_type_ids'))[k] + '"]').length; l++) {
                    $($('.building_list_li[building_type_id="' + JSON.parse($(this).attr('building_type_ids'))[k] + '"]')[l]).show();
                }
            }
        }
    });

    $('.building_selection').on('dblclick', function() {
        $('.building_list_li').each(function() {
            $(this).show();
        });
        $('.building_selection[id!="' + $(this).attr('id') + '"]').each(function(){
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
        });
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        for (var i = 0; i < $('.building_list_li').length; i++) {
            var building = $('.building_list_li')[i];
            if (JSON.parse($(this).attr('building_type_ids')).indexOf(parseInt($(building).attr('building_type_id'))) == -1) {
                $(building).hide();
            } else {
                $(building).show();
            }
        }
    });

    $('#customizeBuildingFilter').on('click', function() {
        var markup = "";
        markup += '<div id="buildingFilterCustomizer" ';
        markup += 'style="background: #fff; z-index: 10000; position: absolute; left: 50%; top: 50%; ';
        markup += 'transform: translate(-50%,-50%); min-width: 200px; ';
        markup += 'max-width: 600px; max-height: ' + (screen.height - 10) + 'px;width: 80%; border: 1px solid rgb(66, 66, 66); color: black; padding: 5px; overflow: auto;">';
        markup += '<button type="button" class="close buildingFilterCustomizerClose aria-label="Schliessen" style="margin: 5px;">×</button>';
        markup += '<div class="container-fluid">';
        markup += '<h3>Gebäude-Filter anpassen</h3><hr>';
        markup += '<div class="row"><div class="col col-md-6"><button class="btn btn-success" id="newFilter"><i class="glyphicon glyphicon-plus"></i></button><label for="newFilter">&nbsp;Neuen Filter hinzufügen</label></div><div class="col col-md-6"><button class="btn btn-success" id="saveFilters"><i class="glyphicon glyphicon-floppy-disk"></i></button><label for="saveFilters">&nbsp;Filter speichern</label></div></div><hr>';
        markup += '<div id="filterConfigurations"></div>';
        markup += '</div>';
        markup += '</div>';

        $('body').append(markup);

        $('.buildingFilterCustomizerClose').click(function() {
            $('#buildingFilterCustomizer').remove();
        });

        var filter = JSON.parse(localStorage.buildingListButtons);

        for (var i = 0; i < filter.length; i++) {
            var gebaeude_liste_formatiert = "";
            for (var j = 0; j < filter[i].ids.length; j++) {
                if (j != 0) {
                    gebaeude_liste_formatiert += ', ';
                }
                gebaeude_liste_formatiert += gebaeude_typen[filter[i].ids[j]];
            }
            var filterMarkup = '<div class="buildingFilter" style="float: left;"><div class="input-group string required"><div class="input-group-addon"><label class="string required " for="filter_name_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Name Filter ' + $('.buildingFilter').length + '</label> <button class="btn btn-danger btn-xs deleteFilter"><i class="glyphicon glyphicon-trash"></i></button></div><input class="string required form-control" id="filter_name_' + $('.buildingFilter').length + '" name="filter_name_' + $('.buildingFilter').length + '" size="50" type="text" value="' + filter[i].name + '"></div>';
            filterMarkup += '<div class="input-group string required"><div class="input-group-addon"><label class="string required " for="filter_ids_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Gebäudetypen Ausgewählt Filter ' + $('.buildingFilter').length + '</label><input class="input required form-control disabled" id="filter_ids_' + $('.buildingFilter').length + '" name="filter_ids_' + $('.buildingFilter').length + '" disabled value="' + gebaeude_liste_formatiert + '"></input></div></div>';
            filterMarkup += '<div class="input-group select required"><div class="input-group-addon"><label class="select required " for="filter_id_selection_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Gebäudetypen-Auswahl Filter ' + $('.buildingFilter').length + '</label><select multiple class="select required form-control filterIdSelection" id="filter_id_selection_' + $('.buildingFilter').length + '">';
            for (var k = 0; k < gebaeude_typen.length; k++) {
                filterMarkup += '<option>' + gebaeude_typen[k] + '</option>';
            }
            filterMarkup += '</select></div></div>';
            filterMarkup += '</div>';
            $('#filterConfigurations').append(filterMarkup);

            var selected = [];

            for (var n = 0; n < filter[i].ids.length; n++) {
                selected[n] = [gebaeude_typen[filter[i].ids[n]]];
            }

            $('#filter_id_selection_' + ($('.buildingFilter').length - 1)).val(selected);
        }

        $('.filterIdSelection').on('change', function() {
            $($(this).parent().parent().parent().children()[1]).children().children()[1].value = "";
            for (var l = 0; l < $(this).val().length; l++) {
                if (l != 0) {
                    $($(this).parent().parent().parent().children()[1]).children().children()[1].value += ', ';
                }
                $($(this).parent().parent().parent().children()[1]).children().children()[1].value += $(this).val()[l];
            }
        });

        $('#newFilter').click(function() {
            var filterMarkup = '<div class="buildingFilter" style="float: left;"><div class="input-group string required"><div class="input-group-addon"><label class="string required " for="filter_name_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Name Filter ' + $('.buildingFilter').length + '</label> <button class="btn btn-danger btn-xs deleteFilter"><i class="glyphicon glyphicon-trash"></i></button></div><input class="string required form-control" id="filter_name_' + $('.buildingFilter').length + '" name="filter_name_' + $('.buildingFilter').length + '" size="50" type="text"></div>';
            filterMarkup += '<div class="input-group string required"><div class="input-group-addon"><label class="string required " for="filter_ids_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Gebäudetypen Ausgewählt Filter ' + $('.buildingFilter').length + '</label><input class="input required form-control disabled" id="filter_ids_' + $('.buildingFilter').length + '" name="filter_ids_' + $('.buildingFilter').length + '" disabled></input></div></div>';
            filterMarkup += '<div class="input-group select required"><div class="input-group-addon"><label class="select required " for="filter_id_selection_' + $('.buildingFilter').length + '"><abbr title="required">*</abbr> Gebäudetypen-Auswahl Filter ' + $('.buildingFilter').length + '</label><select multiple class="select required form-control filterIdSelection" id="filter_id_selection_' + $('.buildingFilter').length + '">';
            for (var k = 0; k < gebaeude_typen.length; k++) {
                filterMarkup += '<option>' + gebaeude_typen[k] + '</option>';
            }
            filterMarkup += '</select></div></div>';
            filterMarkup += '</div>';
            $('#filterConfigurations').append(filterMarkup);

            var selected = [];

            for (var n = 0; n < filter[i].ids.length; n++) {
                selected[n] = [gebaeude_typen[filter[i].ids[n]]];
            }

            $('#filter_id_selection_' + ($('.buildingFilter').length - 1)).val(selected);
        });

        $('#saveFilters').click(function() {
            var filter = [];
            for (var m = 0; m < $('.filterIdSelection').length; m++) {
                var wachen = $($('.filterIdSelection')[m]).val();
                var ids = [];
                for (var o = 0; o < wachen.length; o++) {
                    ids[o] = gebaeude_typen.indexOf(wachen[o]);
                }
                filter[m] = {};
                filter[m].ids = ids;
                filter[m].name = $($($('.filterIdSelection')[m]).parent().parent().parent().children()[0]).children()[1].value;
            }
            localStorage.buildingListButtons = JSON.stringify(filter);
            alert("Die Filter wurden erfolgreich gespeichert.\nDu musst das Spiel neu laden, um die Änderungen zu übernehmen!");
        });

        $('.deleteFilter').click(function() {
            $(this).parent().parent().parent().remove();
        });
    });


    $('.building_list_li').each(function() {
        $(this).show();
    });
})();
