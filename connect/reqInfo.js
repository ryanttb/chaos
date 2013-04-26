var connect = require( "connect" );

connect( )
  .use( connect.logger( ) )
  .use( connect.query( ) ) // gives us req.query
  .use( connect.bodyParser( ) ) // gives us req.body
  .use( connect.cookieParser( ) ) // for session
  .use( connect.session( {
    secret: "foobar-connect",
    cookie: {
      maxAge: 60000
    }
  } ) )
  .use( function( req, res, next ) {
    res.write( "req.url: " + req.url + "\n\n" );
    res.write( "req.method: " + req.method + "\n\n" );
    res.write( "req.headers: " + JSON.stringify(req.headers) + "\n\n" );
    res.write( "req.query: " + JSON.stringify(req.query) + "\n\n" );
    res.write( "req.body: " + JSON.stringify(req.body) + "\n\n" );
    res.write( "req.cookies: " + JSON.stringify(req.cookies) + "\n\n" );
    res.write( "req.session: " + JSON.stringify(req.session) );
    res.end( );
  } )
  .use( connect.static( __dirname + "/public" ) )
  .listen( 3001 );




