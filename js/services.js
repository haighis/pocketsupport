
var issuesBackend = angular.module('Issue.UI', []);

issuesBackend.factory('IssueService', IssueService);

function IssueService () {
  var Datastore = require('nedb-promises');
  var electron = require('electron');

  var service = {
      getItems: getItems,
      find: find,
      insert: insert,
      get: get,
     // deleteItem: deleteItem,
      bootstrap: bootstrap
  };

  return service;

  //var db = {};

  function bootstrap(){  
    var app = electron.remote.app;
    var userData = app.getAppPath('userData'); 
    var db = {};
    db.support = new Datastore({
      // TODO - For Production use: filename:  userData + '../db/support.db', // provide a path to the database file 
      //console.log('user Data ', 'file path', userData);
      // TODO - for dev
      filename:  'db/support.db', // provide a path to the database file 
      autoload: true, // automatically load the database
      timestampData: true // automatically add and manage the fields createdAt and updatedAt
    });      
    return db;
  }

  function find(table,offset,limit){
    var db = bootstrap();
    return db[table].find({}).sort({
      updatedAt: -1
    });
  }

  function insert (table,item){
    var db = bootstrap();
      db[table].insert(item, function(err, item) {
        if (err) {
          return null;
        }
        return item;
      });
  }

  function get(table,id){
      db[table].findOne({
        _id: id
      }, {}, function(err, item) {
        if (err) return null;
        return item;
      });

  }

  function deleteItem(table,id) {
    db[table].remove({
      _id: id
    }, {}, function(err, item) {
      if (err) return null;
      return 1;
    });
  }

  function getItems() {
      var items = [
        {id: 1, name: "test 1"},
        {id: 2, name: "test 2"}
      ]
      return items;

      // var defer = $q.defer();
      // $http.post(config.URL + '/tenant/'+ 'api/tenant-subscription-creation', accountDto).then(function(success) {
      //     defer.resolve(success);
      // }, 
      // function(error){
      //     defer.reject(error);
      // });
      // return defer.promise;
  }
}