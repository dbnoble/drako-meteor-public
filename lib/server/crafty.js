function Craft(opts) {
  if (!(this instanceof Craft)) return new Craft(opts || {});
  this.recipes = opts.recipes || [];
  this.separator = opts.separator || '|';
}
  
  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Craft;
    }
    exports.Craft = Craft;
  } else {
    root.Craft = Craft;
  }
 

Craft.prototype.recipe = function(data) {
  var self = this;
  if (Array.isArray(data)) {
    data.forEach(function(r) { self.recipe(r); });
    return this;
  }
  data.have = _.flatten(data.have);
  // create a key based on have for quicker/easier read
  this.recipes.push(data);
  return this;
};

Craft.prototype.craft = function(iHave) {
  console.log('Looking for recipe...');
  var give = false;
  // nothing!
  if (iHave.length < 1) return false;

var found = _.find(this.recipes, function(recipe){return _.difference(recipe.have, iHave).length === 0 && _.difference(iHave, recipe.have).length === 0;});
    if (!found) {
      console.log("didn't find anything");
      give = found;
      return false;
    } else {
      console.log("BINGO!");
      give = found;
    }
  
  console.log('Okay back to you');
  return give;
};