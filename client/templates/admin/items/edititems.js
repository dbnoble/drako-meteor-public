Template.uploadItemImage.helpers({
  uploadedItemImg: function() {
    return {
        finished: function(index, fileInfo, context) {
          $('#newItemImageUrl').val(fileInfo.url);
          $('#item-admin-image-preview').css('background-image', 'url(' + fileInfo.url + ')');
          $('.uploadLabel').fadeOut('slow');
          $('.uploadPanel').fadeOut('slow');
        }
    }
  }
});

Template.edititems.rendered = function() {
  Slingshot.fileRestrictions("inventoryUploads", {
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
  });
  inventoryUploader = new Slingshot.Upload("inventoryUploads");
};

Template.edititems.helpers({
  url: function () {
    //if we are uploading an image, pass true to download the image into cache
    //this will preload the image before using the remote image url.
    return this.inventoryUploader.url(true);
  }
});

Template.bundleItemOpts.helpers({
  availableItems: function() {
    return Items.find({});
  }
});

Template.bundleItemOpts.events({
  "click .addBundleOption": function(e) {
    e.preventDefault();
    toClone = $('.bundleCloner:last');
    theClone = $(toClone.clone()).insertAfter('.bundleCloner:last');
  }
});

Template.edititems.events({
"click #clearItemFields" : function () {
   $('.itemAdminClear').val('');
    $('.uploadLabel').show();
   $('.uploadPanel').show();
   $('.uploadPanel .upload-control:last-child').click();
   $('#item-admin-image-preview').css('background-image', 'url(/addItemPlaceholder.png)');
  },
  "change #item-image-upload" : function (e) {
     inventoryUploader.send(document.getElementById('item-image-upload').files[0], function (error, downloadUrl) {
      if (error) {
        // Log service detailed response
        console.error('Error uploading', uploader.xhr.response);
        alert (error);
      }
      else {
        $('#newItemImageUrl').val(downloadUrl);
        $('#item-admin-image-preview').css('background-image', 'url(' + downloadUrl + ')');
        Meteor.call('addItemImage', downloadUrl);
        console.log(downloadUrl);
      }
    });
  },
  "change #newItemType" : function (e) {
   if ($(e.target).val() == 'bundle') {
     $('#bundleItemOpts').show();
   } else {
     $('#bundleItemOpts').hide();
   }
    if ($(e.target).val() == 'key') {
     $('#keyItemOpts').show();
   } else {
     $('#keyItemOpts').hide();
   }
    if ($(e.target).val() == 'buff') {
     $('#buffItemOpts').show();
     } else{
     $('#buffItemOpts').hide();
   }
    if ($(e.target).val() == 'userSubmission') {
     $('#submissionItemOpts').show();
   } else {
     $('#submissionItemOpts').hide();
   }
  },
  "click #isShopItem" : function (e) {
   if ($(e.target).is(':checked')) {
     $('#shopItemOpts').show();
   } else {
     $('#shopItemOpts').hide();
   }
  },
    "click #addNewItem" : function () {
      var itemPrice = 0;
      if ($('#isShopItem').is(':checked')){
        itemPrice = $('input#newItemCost').val();
      }
      var itemDetails = {};
      if ($('#newItemType').val() == 'bundle') {
       var bundledItemList = [];
       $('.bundledItems').each(function() {
         var pushItem = $(this).val();
         bundledItemList.push(pushItem);
       });
      itemDetails = {
        title: $('input#newItemTitle').val(),
        slug: $('input#newItemSlug').val(),
        image: $('input#newItemImageUrl').val(),
        description: $('textarea#newItemDescription').val(),
        type: $('select#newItemType').val(),
        shopItem: $('#isShopItem').is(':checked'),
        shopPrice: itemPrice,
        gravity: $('input#newItemPosition').val(),
        levelReq: $('input#reqLev').val(),
        craftable: $('#isCraftable').is(':checked'),
        stacked: $('#isStacked').is(':checked'),
        essential: $('#isEssential').is(':checked'),
        bundledItems: bundledItemList
      }; } else 
       if ($('#newItemType').val() == 'buff') {
      itemDetails = {
        title: $('input#newItemTitle').val(),
        slug: $('input#newItemSlug').val(),
        image: $('input#newItemImageUrl').val(),
        description: $('textarea#newItemDescription').val(),
        type: $('select#newItemType').val(),
        shopItem: $('#isShopItem').is(':checked'),
        shopPrice: itemPrice,
        gravity: $('input#newItemPosition').val(),
        levelReq: $('input#reqLev').val(),
        craftable: $('#isCraftable').is(':checked'),
        stacked: $('#isStacked').is(':checked'),
        essential: $('#isEssential').is(':checked'),
        stat: $('#buffStat').val(),
        bonus: $('#buffBonus').val(),
        expires: $('#buffDuration').val()
      }; } else 
      if ($('#newItemType').val() == 'userSubmission') {
      itemDetails = {
        title: $('input#newItemTitle').val(),
        slug: $('input#newItemSlug').val(),
        image: $('input#newItemImageUrl').val(),
        description: $('textarea#newItemDescription').val(),
        type: $('select#newItemType').val(),
        shopItem: $('#isShopItem').is(':checked'),
        shopPrice: itemPrice,
        gravity: $('input#newItemPosition').val(),
        levelReq: $('input#reqLev').val(),
        craftable: $('#isCraftable').is(':checked'),
        stacked: $('#isStacked').is(':checked'),
        essential: $('#isEssential').is(':checked'),
        modalSlug: $('#modalSlug').val(),
      }; } else 
       if ($('#newItemType').val() == 'key') {
      itemDetails = {
        title: $('input#newItemTitle').val(),
        slug: $('input#newItemSlug').val(),
        image: $('input#newItemImageUrl').val(),
        description: $('textarea#newItemDescription').val(),
        type: $('select#newItemType').val(),
        shopItem: $('#isShopItem').is(':checked'),
        shopPrice: itemPrice,
        gravity: $('input#newItemPosition').val(),
        levelReq: $('input#reqLev').val(),
        craftable: $('#isCraftable').is(':checked'),
        stacked: $('#isStacked').is(':checked'),
        essential: $('#isEssential').is(':checked'),
        game: $('input#serverGame').val(),
        server: $('input#serverName').val(),
        pass: $('input#serverPass').val(),
        isKey: true
      }; } else {
        itemDetails = {
        title: $('input#newItemTitle').val(),
        slug: $('input#newItemSlug').val(),
        image: $('input#newItemImageUrl').val(),
        description: $('textarea#newItemDescription').val(),
        type: $('select#newItemType').val(),
        shopItem: $('#isShopItem').is(':checked'),
        shopPrice: itemPrice,
        gravity: $('input#newItemPosition').val(),
        levelReq: $('input#reqLev').val(),
        craftable: $('#isCraftable').is(':checked'),
        stacked: $('#isStacked').is(':checked'),
        essential: $('#isEssential').is(':checked'),
      }; }
      Meteor.call('addNewItem', itemDetails, function(){
         $('.itemAdminClear').val('');
         $('.uploadLabel').show();
         $('.uploadPanel').show();
         $('.uploadPanel .upload-control:last-child').click();
         $('#item-admin-image-preview').css('background-image', 'url(/addItemPlaceholder.png)');
      });
    }
});