const sideMenu = document.querySelector("aside");
const closeBtn = document.querySelector("#close-btn");
const navBar = document.querySelector(".sidebar ul");

//check active aside menu
$(function () {
    $('#sidebar').on('click', 'li', function (event) {
        event.preventDefault();
        var current_url = this.querySelector('a').href;
        window.location.href = current_url;
    });
});

$(function() { 
    var location = window.location.href;
    var cur_url = '/' + location.split('/')[3]  + '/';
    $('#sidebar > ul li > a').each(function (ind, e) {
        var link = $(this).attr('data_target')
        $(this).parent().removeClass("active")
        if (cur_url == link)
            $(this).parent().addClass("active");
     });
});

function updateCounter() {
    $.post('/json/counter', { csrfmiddlewaretoken: window.CSRF_TOKEN }, function (data) {
        Counter = data.data['trouble_ticket_counter']
        vipCounter = data.data['trouble_ticket_vip_counter']
        if (Counter < 1) {
            $('#sidebar .task-status-on-the-group-count').text('').css('display', 'none');
        }
        else {
            $('#sidebar .task-status-on-the-group-count').text(Counter).css('display', 'inline');
        }
        if (vipCounter < 1) {
            $('#sidebar .task-status-on-the-vip-count').text('').css('display', 'none');
        }
        else {
            $('#sidebar .task-status-on-the-vip-count').text(vipCounter).css('display', 'inline');
        }
    });
}

$(document).ready(function(){
    updateCounter()
    setInterval('updateCounter()', 60000);
});