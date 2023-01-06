$(document).ready(function () {
    $('#trouble-table thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#trouble-table thead');

    var table = $('#trouble-table').DataTable({
        "ajax": "/json/table",
        "columns": [
            {"data": "number"},
            {"data": "vip_contragent"},
            {"data": "name"},
            {"data": "issue_type"},
            {"data": "name_contragent"},
            {"data": "name_service"},
            {"data": "step_time"},
            {"data": "step"},
            {"data": "responsible"},
            {"data": "last_edit_time"},

        ],
        "order": [[6, 'asc']],
        'rowCallback': function(row, data, index){
            if(data["step_time"] > 540 && data["step"] == 'передано в работу (напр тех под В2В)'){
                $(row).css('background-color', '#ff7B7B');
            } else if (data["step_time"] > 1140 && data["step"] == 'принято в работу') {
                $(row).css('background-color', '#ff7B7B');
            }
            var timestamp = data["step_time"];
            var days = Math.floor(timestamp / 60 / 60 / 24);
            var hours = Math.floor(timestamp / 60 / 60 - days * 24);
            var minutes = Math.floor(timestamp / 60) - (hours * 60) - (days * 24 * 60);
            time = days + ' дней ' + hours + ' ч ' + minutes + ' мин ';
            $(row).find('td:eq(3)').text(time);

        },
        "autoWidth": false,
        "bAutoWidth": false,
        orderCellsTop: true,
        fixedHeader: true,
        initComplete: function () {
            var api = this.api();
 
            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" placeholder="' + title + '" />');
 
                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('change', function (e) {
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();
 
                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('keyup', function (e) {
                            e.stopPropagation();
 
                            $(this).trigger('change');
                            $(this)
                                .focus()[0];
                        });
                });
        },
    });

    function resizeTable() {
        if (window.innerWidth > 1800) {
            table.column(0).visible(false);
            table.column(1).visible(false);
            table.column(2).visible(true);
            table.column(3).visible(false);
            table.column(4).visible(true);
            table.column(5).visible(true);
            table.column(4).visible(true);
            table.column(5).visible(true);
            table.column(6).visible(true);
            table.column(7).visible(true);
            table.column(8).visible(true);
            table.column(9).visible(false);
        } else if (window.innerWidth < 1800 && window.innerWidth > 1200) {
            table.column(0).visible(false);
            table.column(1).visible(false);
            table.column(2).visible(true);
            table.column(3).visible(false);
            table.column(4).visible(false);
            table.column(5).visible(false);
            table.column(6).visible(true);
            table.column(7).visible(true);
            table.column(8).visible(true);
            table.column(9).visible(false);
        } else if (window.innerWidth < 1200 && window.innerWidth > 500){
            table.column(0).visible(false);
            table.column(1).visible(false);
            table.column(2).visible(true);
            table.column(3).visible(false);
            table.column(4).visible(false);
            table.column(5).visible(false);
            table.column(6).visible(false);
            table.column(7).visible(true);
            table.column(8).visible(true);
            table.column(9).visible(false);
        } else {
            table.column(0).visible(false);
            table.column(1).visible(false);
            table.column(2).visible(true);
            table.column(3).visible(false);
            table.column(4).visible(false);
            table.column(5).visible(false);
            table.column(6).visible(false);
            table.column(7).visible(false);
            table.column(8).visible(false);
            table.column(9).visible(false);
        }
    }
    resizeTable();
    setInterval( function () {
        table.ajax.reload();
    }, 30000 );
    $(window).resize(function() {
        resizeTable();
        });
        
});
