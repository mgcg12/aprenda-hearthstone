$('#top-image').mousemove(function(e){
    var amountMovedX = (e.pageX * 1 / 100) -10;
    var amountMovedY = (e.pageY * -1 / 1.8);
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});
$('#top-image').mouseout(function(e){
    var amountMovedX = 0;
    var amountMovedY = -178;
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});