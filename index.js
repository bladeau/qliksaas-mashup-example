/*
 *    Fill in host and port for Qlik engine
 */
var config = {
  host: 'localhost', //for example, 'abc.us.qlikcloud.com'
  prefix: '/',
  port: 4848,
  isSecure: false,
  webIntegrationId: 'qlik-web-integration-id',
}
require.config({
  baseUrl:
    (config.isSecure ? 'https://' : 'http://') +
    config.host +
    (config.port ? ':' + config.port : '') +
    config.prefix +
    'resources', //,
  //webIntegrationId: config.webIntegrationId,
})

var app

// Load Qlik Javascript library to interface with Capability APIs
require(['js/qlik'], function (qlik) {
  console.log('qlik', qlik)

  qlik.on('error', function (error) {
    $('#popupText').append(error.message + '<br>')
    $('#popup').show()
  })
  $('#closePopup').click(function () {
    $('#popup').hide()
  })

  //callbacks -- inserted here --
  //open apps -- inserted here --
  var appId = '030b7d25-68db-4094-8511-1c8b3d6c1316'
  app = qlik.openApp('Test.qvf', config) //C:\Users\alalm\Documents\Qlik\Sense\Apps
  console.log('app', app)
  //get objects -- inserted here --

  app.visualization.get('XJjgfM').then(function (vis) {
    vis.show('QV01')
  })
  app.visualization.get('updW').then(function (vis) {
    vis.show('QV02')
  })
  app.visualization.get('ZJpZBZy').then(function (vis) {
    vis.show('QV03')
  })
  app.visualization.get('UAJNLd').then(function (vis) {
    vis.show('QV04')
  })
  // app.visualization
  //   .get('a5e0f12c-38f5-4da9-8f3f-0e4566b28398')
  //   .then(function (vis) {
  //     vis.show('QV05')
  //   })
  // app.visualization.get('hRZaKk').then(function (vis) {
  //   vis.show('QV06')
  // })
})

function applySelection() {
  app.field('Employee Status').selectMatch('Terminated')
}

function clearSelections() {
  app.clearAll()
}

/**
 * Authentication check/redirect
 */
async function connect() {
  const urlQlikServer = `https://${config.host}`
  const urlLoggedIn = '/api/v1/users/me'
  const urlLogin = '/login'
  const webIntegrationId = config.webIntegrationId
  const returnToUrl = window.location.href

  //Check to see if logged in
  // --> i.e: Request to API endpoint https://bar.eu.qlikcloud.com/api/v1/users/me
  return await fetch(`${urlQlikServer}${urlLoggedIn}`, {
    credentials: 'include',
    headers: {
      'Qlik-Web-Integration-ID': webIntegrationId,
      'Content-Type': 'application/json',
    },
  })
    .then(async function (response) {
      //check if user is authenticated; if not, redirect to login page for SSO authentication
      // --> i.e: https://bar.eu.qlikcloud.com/login?returnto=https://foo.com&qlik-web-integration-id=xxxxxx
      if (response.status === 401) {
        const url = new URL(`${urlQlikServer}${urlLogin}`)
        url.searchParams.append('returnto', returnToUrl)
        url.searchParams.append('qlik-web-integration-id', webIntegrationId)
        window.location.href = url
      }
    })
    .catch(function (error) {
      console.error(error)
    })
}
