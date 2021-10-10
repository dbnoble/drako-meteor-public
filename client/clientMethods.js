Meteor.methods({
  openBundle: function(theBundle, theBundleId) {
    Tempinv.remove({_id: theBundleId});
    return 'bundle opened';
  },
  craftItem: function(theItems, itemList) {
        _.each(itemList, function(ingredient){
          if(ingredient.itemQty > 1){
          Tempinv.update({_id: ingredient.itemId}, {$inc: {qty: -1}});  
          } else {
          Tempinv.remove({userId: theUserId, _id: ingredient.itemId});
          }
        });
    checkCraftable();
  return 'crafting complete';
  },
});
