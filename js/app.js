
var app = angular.module('ngApp',['ui.router','ngApp.services']);
app.config(config);

function config($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        //controllerAs: 'ctrl'
      })    
      .state('support-list', {
        url: '/support-list',
        templateUrl: 'views/support-list.html',
        controller: 'SupportListCtrl',
        resolve: {
          itemsData: function (NEDBService) {
            
            //return InboxService.getMessages();
            return NEDBService.find('orders',5,100).skip(0).limit(100).then(function(results){
              return results;
              console.log('in ui router state resolve', results);
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

      // .state('location-list', {
      //   url: '/location-list',
      //   templateUrl: 'views/location-list.html',
      //   controller: 'LocationCtrl',
      //   controllerAs: 'ctrl'
      // })

      // .state('location-create', {
      //   url: '/location-create',
      //   templateUrl: 'views/location-create.html',
      //   controller: 'LocationCtrl',
      //   controllerAs: 'ctrl'
      // })
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
  // var itemsTest = NEDBService.find('orders',5,100);
  // console.log('in support list ctrl ', itemsTest)
  
  // NEDBService.find('orders',5,100).skip(0).limit(100).then(function(results){
  //   vm.items = results;
  //   console.log('support list controller loaded', vm.items);
  // });

  //vm.items = [{title: 'test 1'},{title: 'test 2'}]
  
  vm.save = function(item) {
    console.log('in save order')
  }
  
});

app.controller('ProductCreateCtrl',function ($scope, $rootScope , NEDBService) {
	var vm = this;
  
  vm.save = function(item) {
    NEDBService.insert('orders',vm.item)
  }
});

// app.controller('LocationCtrl',function ($scope) {
	
// 	console.log('location controller loaded');

// });
