
var app = angular.module('ngApp',['ui.router','ngApp.services','angular-electron']);
app.config(config);

//const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2');
//const electron = require('electron')


// var googleAuth = require('google-auth-wrapper');
// var gdriveWrapper = require('google-drive-wrapper');

// googleAuth.execute('./', 'client_secret', function(auth, google) {
//   var wrapper = new gdriveWrapper(auth, google, 'goodpassword');
//   wrapper.downloadNewFiles('backups', './download', function(err) {
//     if(err) {
//       console.log(err);
//     }
//   });
// });

function config($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
      })    
      .state('support-list', {
        url: '/support-list',
        templateUrl: 'views/support-list.html',
        controller: 'SupportListCtrl',
        resolve: {
          itemsData: function (NEDBService) {
            return NEDBService.find('support',5,100).skip(0).limit(100).then(function(results){
              return results;
            });
          }
        },
        controllerAs: 'vm'
      })  
      .state('support-create', {
        url: '/support-create',
        templateUrl: 'views/support-create.html',
        controller: 'ProductCreateCtrl',
        controllerAs: 'vm'
      })  
      $urlRouterProvider.otherwise('/');
}

app.run(run);
run.$inject = ['$rootScope','$location'];

function run($rootScope){
}


app.controller('HomeCtrl', homeCtrl);

function homeCtrl ($scope, $rootScope , NEDBService, shell) {
  console.log('in home cgtrl', shell)

  NEDBService.bootstrap();

}

app.controller('SupportListCtrl',function ($scope, $rootScope , NEDBService, itemsData) {
	var vm = this;
  vm.items = [];
  vm.items = itemsData;
});

app.controller('ProductCreateCtrl',function ($scope, $rootScope , NEDBService, shell, dialog, webContents, webFrame, ipcRenderer) {
	var vm = this;
  
  vm.save = function(item) {
    NEDBService.insert('support',vm.item)
  }

  vm.login = function() {
    shell.beep();
    console.log('dialog ', dialog)

    //dialog.showMessageBox({ title: 'Error Title', buttonLabel: 'test', message: 'hello world!' });
    //app.on('ready', () => {
      // const myApiOauth = ElectronGoogleOAuth2(
      //   //61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com","project_id":"quickstart-1569165056380","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"neih-4yRIU021PH71aqAw85X","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
      //   '61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com',
      //   'neih-4yRIU021PH71aqAw85X',
      //   ['https://www.googleapis.com/auth/drive.metadata.readonly']
      // );
    
      // myApiOauth.openAuthWindowAndGetTokens()
      //   .then(token => {
      //     // use your token.access_token
      //   });
    //});
  }
  vm.show = function() {
    //shell.beep();
    console.log('dialog ', dialog)

    //dialog.showMessageBox({ title: 'Error Title', buttonLabel: 'test', message: 'hello world!' });
    dialog.showErrorBox('Error Title', 'test');
    //app.on('ready', () => {
      // const myApiOauth = ElectronGoogleOAuth2(
      //   //61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com","project_id":"quickstart-1569165056380","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"neih-4yRIU021PH71aqAw85X","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
      //   '61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com',
      //   'neih-4yRIU021PH71aqAw85X',
      //   ['https://www.googleapis.com/auth/drive.metadata.readonly']
      // );
    
      // myApiOauth.openAuthWindowAndGetTokens()
      //   .then(token => {
      //     // use your token.access_token
      //   });
    //});    
  }

  vm.sendToMain = function() {
    //console.log('in send to main webFrame', webFrame, ' ipcRenderer ', ipcRenderer)

    // Some data that will be sent to the main process
    let Data = {
        message: "Hi",
        someData: "Let's go"
    };

    // Add the event listener for the response from the main process
    ipcRenderer.on('mainprocess-response', (event, arg) => {
        console.log(arg); // prints "Hello World!"
    });

    // Send information to the main process
    // if a listener has been set, then the main process
    // will react to the request !
    ipcRenderer.send('request-mainprocess-action', Data);

  }
});