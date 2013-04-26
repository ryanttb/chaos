var connect = require( "connect" );

connect( )
  .use( connect.logger( ) )
  .use( connect.cookieParser( ) )
  .use( connect.session( {
    secret: "foobar-connect",
    cookie: {
      maxAge: 30000
    }
  } ) )
  .use( function( req, res, next ) {
    var ses = req.session;
    var url = req.url.split( "/" );

    if ( url[ 1 ] === "name" && url[ 2 ] ) {
      ses.name = url[ 2 ];
      res.end( "name saved: " + url[ 2 ] );
    } else if ( ses.name ) {
      res.write( "session-stored name: " + ses.name );
      res.end( " stored for another: " + ( ses.cookie.maxAge / 1000 ) + " seconds" );
    } else {
      next( );
    }
  } )
  .use( connect.static( __dirname + "/public" ) )
  .listen( 3001 );




