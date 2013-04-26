var connect = require( "connect" );
var jade = require( "connect-jade" );

connect( )
  .use( connect.logger( ) )
  .use( jade( {
    root: __dirname + "/views",
    defaults: {
      title: "connect on node.js with jade"
    }
  } ) )
  .use( function( req, res ) {
    res.render( "index", {
      heading: "OHAI"
    } );
  } )
  .listen( 3001 );
