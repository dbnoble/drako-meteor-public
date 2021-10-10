Slingshot.createDirective("inventoryUploads", Slingshot.S3Storage, {
  AWSAccessKeyId: process.env.AWSKEYID,
  AWSSecretAccessKey: process.env.AWSACCESSKEY,
  bucket: process.env.AWSBUCKET,

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    return "inventory/" + file.name;
  },
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});
