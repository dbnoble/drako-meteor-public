//var query = Meteor.users.find({}, {fields: {_id: 1, level: 1, exp: 1, name: 1, updatehash: 1}});
//var handle = query.observe({
//  changed: function (newDocument, oldDocument) {
//    if (newDocument.updatehash != oldDocument.updatehash) {
//    var theName = newDocument.name;
//    var theId = newDocument._id;
//    var theLevel = newDocument.level + 1;
//    var currentXP = newDocument.exp;
//      if (currentXP > 267*(theLevel*(theLevel - 1)/2)) {
//      Meteor.users.update({_id: theId}, {$inc: {level: 1}});
//      console.log(theName + " leveled up!");
//      }
//    }
//  }
//});