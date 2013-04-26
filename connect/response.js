var connect = require( "connect" );

connect( )
  .use( connect.logger( ) )
  .use( function( req, res, next ) {
    var accept = req.headers.accept.split( "," );

    var resType = "text/plain";
    var resBody = "o hai";

    /*
    res.writeHead( 200, {
      "Content-Length": resBody.length,
      "Content-Type": "text/plain"
    });
    */

    if ( accept.indexOf( "application/json" ) > -1 ) {
      resType = "application/json";
      resBody = JSON.stringify( {
        body: resBody
      } );
    } else if ( accept.indexOf( "text/html" ) > -1 ) {
      resType = "text/html";
      resBody = "<h1>" + resBody + "</h1>";
    }

    res.statusCode = 200;
    res.setHeader( "Content-Type", resType );
    res.end( resBody );
  } )
  .listen( 3001 );




