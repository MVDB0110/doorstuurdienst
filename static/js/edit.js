/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};
var rew = 0;
var ed = 0;
// Create the model instance
ns.model = (function() {
    let $event_pump = $('body');

    // Return the API
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
        create: function(forward) {
            var user = prompt("Username");
            var password = prompt("Password");
            let ajax_options = {
                type: 'POST',
                url: 'v1/forwards',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                },
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(forward)
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(rowid, forward) {
            var user = prompt("Username");
            var password = prompt("Password");
            let ajax_options = {
                type: 'PUT',
                url: `v1/forwards/${rowid}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                },
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(forward)
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(forward_id) {
            var user = prompt("Username");
            var password = prompt("Password");
            let ajax_options = {
                type: 'DELETE',
                url: `v1/forwards/${forward_id}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                },
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'rewind': function(timestamp) {
            var user = prompt("Username");
            var password = prompt("Password");
            let ajax_options = {
                type: 'PUT',
                url: `v1/archive?timestamp=${timestamp}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                },
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'archive': function(id) {
            var user = prompt("Username");
            var password = prompt("Password");
            let ajax_options = {
                type: 'PUT',
                url: `v1/archive/${id}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                },
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    let $rowid = $('#rowid'),
        $bron = $('#bron'),
        $doel = $('#doel'),
        $methode = $('#methode'),
        $rewindval = $('#rewindval');

    // return the API
    return {
        reset: function() {
            $bron.val('');
            $doel.val('');
            $methode.val('');
            $rewindval.val('');
        },
        update_editor: function(forward) {
            $rowid.val(forward.rowid);
            $bron.val(forward.bron).focus();
            $doel.val(forward.doel);
            $methode.val(forward.methode);
        },
        build_table: function(forwards) {
            let rows = ''
            $('table > tbody').empty();
            if (forwards) {
                for (let i=0, l=forwards['forwards'].length; i < l; i++) {
                  if (forwards['forwards'][i.toString()]['archive'] == 'n' && forwards['forwards'][i.toString()]['provision'] == 'present') {
                    rows += `<tr class="table-success" data-forward-id="${forwards['forwards'][i.toString()]['rowid']}"><td class="rowid">${forwards['forwards'][i.toString()]['rowid']}</td><td class="bron">${forwards['forwards'][i.toString()]['bron']}</td><td class="doel">${forwards['forwards'][i.toString()]['doel']}</td><td class="methode">${forwards['forwards'][i.toString()]['methode']}</td><td class="timestamp">${forwards['forwards'][i.toString()]['timestamp']}</td><td class="provision">${forwards['forwards'][i.toString()]['provision']}</td><td><button class="archive btn btn-warning">Archive</button></td></tr>`;
                  }
                }
                for (let i=0, l=forwards['forwards'].length; i < l; i++) {
                  if (forwards['forwards'][i.toString()]['archive'] == 'n' && forwards['forwards'][i.toString()]['provision'] == 'absent') {
                    rows += `<tr class="table-warning" data-forward-id="${forwards['forwards'][i.toString()]['rowid']}"><td class="rowid">${forwards['forwards'][i.toString()]['rowid']}</td><td class="bron">${forwards['forwards'][i.toString()]['bron']}</td><td class="doel">${forwards['forwards'][i.toString()]['doel']}</td><td class="methode">${forwards['forwards'][i.toString()]['methode']}</td><td class="timestamp">${forwards['forwards'][i.toString()]['timestamp']}</td><td class="provision">${forwards['forwards'][i.toString()]['provision']}</td><td><button class="archive btn btn-success">Activate</button></td></tr>`;
                  }
                }
                for (let i=0, l=forwards['forwards'].length; i < l; i++) {
                  if (forwards['forwards'][i.toString()]['archive'] == 'y') {
                    rows += `<tr class="table-danger" data-forward-id="${forwards['forwards'][i.toString()]['rowid']}"><td class="rowid">${forwards['forwards'][i.toString()]['rowid']}</td><td class="bron">${forwards['forwards'][i.toString()]['bron']}</td><td class="doel">${forwards['forwards'][i.toString()]['doel']}</td><td class="methode">${forwards['forwards'][i.toString()]['methode']}</td><td class="timestamp">${forwards['forwards'][i.toString()]['timestamp']}</td><td class="provision">${forwards['forwards'][i.toString()]['provision']}</td><td><button class="delete btn btn-danger">Verwijder</button></td></tr>`;
                  }
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
    let model = m,
        view = v,
        $event_pump = $('body'),
        $rowid = $('#rowid'),
        $bron = $('#bron'),
        $doel = $('#doel'),
        $methode = $('#methode'),
        $rewindval = $('#rewindval');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(bron, doel, methode) {
        return bron !== "" && doel !== "" && methode !== "" && bron !== doel;
    }

    function validateTimestamp(timestamp) {
        return timestamp !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let bron = $bron.val(),
            doel = $doel.val()
            methode = $methode.val();

        e.preventDefault();

        if (validate(bron, doel, methode)) {
            ed = 0;
            rew = 0;
            model.create({
                'bron': bron,
                'doel': doel,
                'methode': methode,
            })
        } else {
            alert('Problem with input');
        }
    });

    $('#update').click(function(e) {
        let rowid = $rowid.val(),
            bron = $bron.val(),
            doel = $doel.val();
            methode = $methode.val();

        e.preventDefault();

        if (validate(bron, doel, methode)) {
            ed = 0;
            rew = 0;
            model.update(rowid, {
                bron: bron,
                doel: doel,
                methode: methode,
            })
        } else {
            alert('Problem with input');
        }
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('#showeditor').click(function() {
        if (ed == 0) {
          $('#editor').show();
          $('#rewinder').hide();
          ed = 1;
          rew = 0;
        } else {
          $('#editor').hide();
          $('#rewinder').hide();
          ed = 0;
        }
    })

    $('#showrewinder').click(function() {
        if (rew == 0) {
          $('#editor').hide();
          $('#rewinder').show();
          rew = 1;
          ed = 0;
        } else {
          $('#editor').hide();
          $('#rewinder').hide();
          rew = 0;
        }
    })

    $('#rewind').click(function() {
        let rewindval = $rewindval.val();

        if (validateTimestamp(rewindval)) {
            model.rewind(rewindval);
        } else {
            alert('Problem with input');
        }
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            rowid,
            bron,
            doel,
            methode;

        rowid = $target
            .parent()
            .attr('data-forward-id');

        bron = $target
            .parent()
            .find('td.bron')
            .text();

        doel = $target
            .parent()
            .find('td.doel')
            .text();

        methode = $target
            .parent()
            .find('td.methode')
            .text();

        view.update_editor({
            rowid: rowid,
            bron: bron,
            doel: doel,
            methode: methode,
        });

        $('#create').hide();
        $('#update').show();
    });

    $(document).on('click', '.delete', function(e) {
        let $target = $(e.target),
            rowid;

        rowid = $target
            .parent()
            .parent()
            .attr('data-forward-id');

        model.delete(rowid)
    });

    $(document).on('click', '.archive', function(e) {
        let $target = $(e.target),
            rowid;

        rowid = $target
            .parent()
            .parent()
            .attr('data-forward-id');

        model.archive(rowid)
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        $('#update').hide();
        view.reset();
        $('#editor').hide();
        $('#rewinder').hide();
    });

    $event_pump.on('model_create_success', function(e, data) {
        alert(JSON.stringify(data));
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        alert(JSON.stringify(data));
        model.read();
        $('#create').show();
        $('#update').hide();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        alert(data);
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        alert(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
