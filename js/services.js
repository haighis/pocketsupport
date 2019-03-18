angular.module('ngApp.services', [])
.factory('NEDBService',function(){
  
  //var Datastore = require('nedb');
  var Datastore = require('nedb-promises');
  var electron = require('electron');
  
  var db = {};

  return {

    bootstrap : function(){
      
      var app = electron.remote.app;
      //var userData = app.getAppPath('userData'); 
      var userData = app.getAppPath('userData'); 
      console.log('in boostrap file path is ', userData)
     db.customers = new Datastore({
        filename: '../db/customers.db', // provide a path to the database file 
        ///Users/johnhaigh/Projects/icmapp/pocketsupport/
        autoload: true, // automatically load the database
        timestampData: true // automatically add and manage the fields createdAt and updatedAt
      });

      db.orders = new Datastore({
        //filename:  '/Users/johnhaigh/Projects/icmapp/pocketsupport/orders.db', // provide a path to the database file 
        filename:  userData + '../db/orders.db', // provide a path to the database file 
        autoload: true, // automatically load the database
        timestampData: true // automatically add and manage the fields createdAt and updatedAt
      });      
      return db;
    },
    test : function(){
        

    },
    close : function(){
    },
    find : function(table,offset,limit){
      var db = this.bootstrap();
      // db[table].find({}).sort({
      //   updatedAt: -1
      // }).exec(function(err, items) {
      //   console.log('in find ', items)
      //   if (err) {
      //     return null;
      //   }
        
      // }).then(function(results){
      //   console.log('in find 2', results)
      //   return results;
      // });
      return db[table].find({}).sort({
        updatedAt: -1
      });
      // .exec(function(err, items) {
      //   console.log('in find ', items)
      //   if (err) {
      //     return null;
      //   }
        
      // }).then(function(results){
      //   console.log('in find 2', results)
      //   return results;
      // });

    },
   insert: function(table,item){
     var db = this.bootstrap();
      db[table].insert(item, function(err, item) {
        console.log('insert ', item._id)
        
        //var test = get('orders', item._id)
        //console.log('get item after create ', test)
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
}) 
.factory('DBService',function(MongooseService){
    
    this.pageSize = 10;
    this.offset = 0;
    this.limit = 10;
    var self = this;    
    
    function size(table){

    }
    function find(table,offset,limit){
        return NEDBService.find(table,offset,limit);
    }
    return {
      bootstrap : function(info){
        NEDBService.bootstrap();
        //NEDBService.test();
      },
      getPager: async function(table,pageSize)
      {
          
          self.pageSize = pageSize;
          self.limit = self.pageSize;
          self.size = await size();
          var o =  {
              
              initialPage:function(){

                return find(table,self.offset,self.limit);
              },
              prevPage:function(){
                if(self.offset > 0 )
                { 
                  self.offset -= self.pageSize;
                } 
                 return find(table,self.offset,self.limit);         
              },
              nextPage:function(){
                  if(self.offset  + self.limit <= self.size )
                  {  
                    self.offset +=  self.pageSize;
                  }
                  return find(table,self.offset,self.limit);  
              }
          }
          return o;
          
      }        
    }
});
