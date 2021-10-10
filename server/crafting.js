crafty = new Craft({});
  
  crafty.recipe({
  have: [
    ['coal'],
    ['stick'],
  ],
  give: ['torch', 4],
});

crafty.recipe(
  { have: [
    ['empty-flask'],
    ['reagent-blackheart'],
    ['serum-soul'],
  ],
   give: ['strange-potion'],
  }
);

crafty.recipe(
  { have: [
    ['parchment'],
    ['ink'],
    ['stamp-drako-draws'],
  ],
   give: ['drako-draws'],
  }
);

crafty.recipe(
  { have: [
    ['empty-vial'],
    ['herb-of-focus'],
  ],
   give: ['potion-focus-lesser'],
  }
);