angular.module('ngApp.services', [])
.factory('NEDBService',function(){
  var Datastore = require('nedb-promises');
  var electron = require('electron');
  
  var db = {};

  return {

    bootstrap : function(){
      
      var app = electron.remote.app;
      var userData = app.getAppPath('userData'); 
      db.support = new Datastore({
        filename:  userData + '../db/support.db', // provide a path to the database file 
        autoload: true, // automatically load the database
        timestampData: true // automatically add and manage the fields createdAt and updatedAt
      });      
      return db;
    },
    close : function(){
    },
    find : function(table,offset,limit){
      var db = this.bootstrap();
      return db[table].find({}).sort({
        updatedAt: -1
      });
    },
   insert: function(table,item){
     var db = this.bootstrap();
      db[table].insert(item, function(err, item) {
        if (err) {
          return null;
        }
        return item;
      });
   }, 
   get: function (table,id){
      db[table].findOne({
        _id: id
      }, {}, function(err, item) {
        if (err) return null;
        return item;
      });

   },
   delete(table,id){
      db[table].remove({
        _id: id
      }, {}, function(err, item) {
        if (err) return null;
        return 1;
      });
   }
  }
});