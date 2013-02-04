$(function () {
    $.getJSON("http://api.hostip.info/get_json.php").done(function (result) {
        var harvardRanges = [ "140.247", "128.103", "131.142", "132.183", "134.174" ];
        var heDebug = result.ip;
        var network = "external"; //< client network (external | internal)
        var $iframe, src;

        $.each( harvardRanges, function() {
            if ( result.ip.indexOf( this ) === 0 ) {
                heDebug += " (Harvard)";
                network = "internal";
                return false;
            }
        } );
        
        $("iframe").each( function() {
            // check every iframe for harvard-embed data
            $iframe = $(this);
            src = $iframe.data( "he-" + network );
            
            if ( src ) {
                // actually change the iframe's src
                $iframe.attr( "src", src );
                heDebug += "<br>" + src;
            }            
        } );
        
        // push IP & flag to debug element if present
        $(".he-debug").html(heDebug);
    });
});

