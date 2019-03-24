
var app = angular.module('ngApp',['ui.router','ngApp.services']);
app.config(config);

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

app.controller('HomeCtrl',function ($scope, $rootScope , NEDBService) {
  NEDBService.bootstrap();
});

app.controller('SupportListCtrl',function ($scope, $rootScope , NEDBService, itemsData) {
	var vm = this;
  vm.items = [];
  vm.items = itemsData;
});

app.controller('ProductCreateCtrl',function ($scope, $rootScope , NEDBService) {
	var vm = this;
  
  vm.save = function(item) {
    NEDBService.insert('support',vm.item)
  }
});