
var app = angular.module('ngApp',['ui.router', 'Issue.UI','angular-electron']);
app.config(config);

function config($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
      })    
      .state('issue-list', {
        url: '/issue-list',
        templateUrl: 'views/issue-list.html',
        controller: 'IssueListCtrl',
        resolve: {
          itemsData: function (IssueService) {
            return IssueService.find('support',5,100).skip(0).limit(100).then(function(results){
              return results;
            });
          }
        },
        controllerAs: 'vm'
      })  
      .state('issue-create', {
        url: '/issue-create',
        templateUrl: 'views/issue-create.html',
        controller: 'IssueCreateCtrl',
        controllerAs: 'vm'
      }) 
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'vm'
      }) 
      $urlRouterProvider.otherwise('/');
}

app.run(run);
run.$inject = ['$rootScope','$location'];

function run($rootScope){
}


app.controller('HomeCtrl', homeCtrl);

function homeCtrl ($scope, $rootScope , shell, IssueService) {
  //console.log('in home cgtrl', shell)
  IssueService.bootstrap();
}

app.controller('IssueListCtrl',function ($scope, $rootScope , IssueService, itemsData) {
	var vm = this;
  vm.items = [];
  vm.listOfItems = IssueService.getItems();
  vm.items = itemsData;
});

app.controller('SettingsCtrl',function ($scope, $rootScope) {
	var vm = this;
  vm.authGoogleDrive = function() {
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

app.controller('IssueCreateCtrl',function ($scope, $rootScope , IssueService, shell, dialog, webContents, webFrame, ipcRenderer) {
	var vm = this;
  
  vm.save = function(item) {
    IssueService.insert('support',vm.item)
  }
});