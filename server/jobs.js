clearBuffs = function () {
  var currentTime = new Date();
  //var now = moment(currentTime).subtract('48 hours').toISOString();
  Buffs.remove({expires: {$lte : new Date()}}, function(err, success){
    var dbResult = 'never finished';
    if(err){
      dbResult = err;
    } else {
      if (success === 0){
        dbResult = 'No expired buffs found';
      } else {
        var pluralizer =  (success > 1 ? 'buffs' : 'buff');
        dbResult = 'Removed ' + success + ' ' + pluralizer + ' successfully';
      }
    }
    console.log(dbResult);
    return dbResult;
  });
  return 'Finished';
}

replenishItems = function () {
  var currentTime = new Date();
  //var now = moment(currentTime).subtract('48 hours').toISOString();
  Items.update({slug: 'stamp-drako-draws'}, {$set: {available: 0}}, function(err, success){
    var dbResult = 'never finished';
    if(err){
      dbResult = err;
    } else {
      if (success === 0){
        dbResult = 'Item not updated';
      } else {
        var pluralizer =  (success > 1 ? 'items' : 'item');
        dbResult = 'Updated ' + success + ' ' + pluralizer + ' successfully';
      }
    }
    console.log(dbResult);
    return dbResult;
  });
  return 'Finished';
}

SyncedCron.add({
  name: 'removeBuffs',
  schedule: function(parser){
    //var date = new Date(rightMeow);
    //return parser.recur().on(date).fullDate();
    return parser.text('every 5 minutes');
  },
  job: function() {
    console.log('Clearing buffs!');
    var clearedBuffs = clearBuffs();
    console.log(clearedBuffs);
    return clearedBuffs;
  }
});

SyncedCron.add({
  name: 'replenishStock',
  schedule: function(parser){
    //var date = new Date(rightMeow);
    //return parser.recur().on(date).fullDate();
    return parser.text('at 12:01 am');
  },
  job: function() {
    console.log('Clearing buffs!');
    var replenishedItems= replenishItems();
    console.log(replenishedItems);
    return replenishedItems;
  }
});
