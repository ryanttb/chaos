$(function () {
    $.getJSON("http://api.hostip.info/get_json.php").done(function (result) {
        var edxDebug = result.ip;
        var harvard = false;
        var $iframe, src;

        if (result.ip.substr(0, 3) === "140") {
            edxDebug += " (Harvard)";
            harvard = true;
        }
        
        $("iframe").each( function() {
            // check every iframe for edx data
            $iframe = $(this);
            src = null;
            
            if ( harvard ) {
                src = $iframe.data( "edx-internal" );
            } else {
                src = $iframe.data( "edx-external" );
            }
            
            if ( src ) {
                // actually change the iframe's src
                $iframe.attr( "src", src );
                
                edxDebug += "<br>" + src;
            }            
        } );
        
        // push IP & flag to debug element if present
        $(".edx-debug").html(edxDebug);
    });
});

