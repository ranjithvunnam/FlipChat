$('.chat[data-chat=7845634502]').addClass('active-chat');
$('.person[data-chat=7845634502]').addClass('active');

$('.left .person').mousedown(function(){
	alert("Hello! I am an alert box!!");
    if ($(this).hasClass('.active')) {
        return false;
    } else {
        var findChat = $(this).attr('data-chat');
        var personName = $(this).find('.name').text();
        $('.right .top .name').html(personName);
        $('.chat').removeClass('active-chat');
        $('.left .person').removeClass('active');
        $(this).addClass('active');
        $('.chat[data-chat = '+findChat+']').addClass('active-chat');
    }
});