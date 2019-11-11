let ns = {};

ns.model = (function() {
    'use strict';
    let $event_pump = $('body');

    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'v1/forwards',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    return {
        build_table: function(forwards) {
            let rows = ''
            $('.forwards table > tbody').empty();
            if (forwards) {
                for (let i=0, l=forwards['forwards'].length; i < l; i++) {
                  rows += `<tr data-forward-id="${forwards['forwards'][i.toString()]['rowid']}"><td class="rowid">${forwards['forwards'][i.toString()]['rowid']}</td><td class="bron">${forwards['forwards'][i.toString()]['bron']}</td><td class="doel">${forwards['forwards'][i.toString()]['doel']}</td><td class="methode">${forwards['forwards'][i.toString()]['methode']}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body');

    setTimeout(function() {
        model.read();
    }, 100)

    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
