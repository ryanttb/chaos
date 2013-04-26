var connect = require( "connect" );
var myMod = require( "./mymod.js" );

connect( )
  .use( connect.logger( ) )
  .use( myMod )
  .listen( 3001 );
