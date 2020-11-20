/*
 *    Fill in host and port for Qlik engine
 */
var config = {
	host: "QS_tenant_hostname", //for example, 'abc.us.qlikcloud.com'
	prefix: "/",
	port: 443,
    isSecure: true,
    webIntegrationId: 'qlik-web-integration-id'
};
require.config( {
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    webIntegrationId: config.webIntegrationId
} );	


var app;

// Load Qlik Javascript library to interface with Capability APIs
require( ["js/qlik"], function ( qlik ) {
	qlik.on( "error", function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).show();
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
    } );
    

	//callbacks -- inserted here --
    //open apps -- inserted here --
    var appId = 'd815ff1e-8deb-4534-a9e5-5065e6a31315';
    app = qlik.openApp( appId, config );
        
    //get objects -- inserted here --   

    app.visualization.get('uETyGUP').then(function(vis){
        vis.show("QV01");	
    } );
    app.visualization.get('xfvKMP').then(function(vis){
        vis.show("QV02");	
    } );
    app.visualization.get('rJFbvG').then(function(vis){
        vis.show("QV03");	
    } );
    app.visualization.get('PAppmU').then(function(vis){
        vis.show("QV04");	
    } );
    app.visualization.get('a5e0f12c-38f5-4da9-8f3f-0e4566b28398').then(function(vis){
        vis.show("QV05");	
    } );
    app.visualization.get('hRZaKk').then(function(vis){
        vis.show("QV06");	
    } );

} );


function applySelection(){
    app.field("Employee Status").selectMatch("Terminated");
}

function clearSelections(){
    app.clearAll();
}


/**
 * Authentication check/redirect
 */
async function connect() {
    
    const urlQlikServer = `https://${config.host}`;
    const urlLoggedIn = "/api/v1/users/me";
    const urlLogin = "/login";
    const webIntegrationId = config.webIntegrationId; 
    const returnToUrl = window.location.href;      

    //Check to see if logged in 
    // --> i.e: Request to API endpoint https://bar.eu.qlikcloud.com/api/v1/users/me
    return await fetch(`${urlQlikServer}${urlLoggedIn}`, {
        credentials: 'include',
        headers: {                  
            'Qlik-Web-Integration-ID':webIntegrationId,
            'Content-Type': 'application/json'
        }
    })
    .then(async function(response)
    {
        //check if user is authenticated; if not, redirect to login page for SSO authentication 
        // --> i.e: https://bar.eu.qlikcloud.com/login?returnto=https://foo.com&qlik-web-integration-id=xxxxxx
		if(response.status===401){
            const url = new URL(`${urlQlikServer}${urlLogin}`);
            url.searchParams.append('returnto', returnToUrl);
            url.searchParams.append('qlik-web-integration-id', webIntegrationId);
            window.location.href = url;
        }	
    })
    .catch(function(error)
    {
        console.error(error);
    });	
}	
