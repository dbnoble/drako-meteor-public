FlowRouter.route('/watch', {
    action: function() {
        BlazeLayout.render("layout", {main: "StrumTemplate"});
    }
});

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("layout", {main: "home"});
    }
});

FlowRouter.route('/clrchat', {
    action: function() {
        BlazeLayout.render("chatlayout", {main: "clrchat"});
    }
});

FlowRouter.route('/chat', {
    action: function() {
        BlazeLayout.render("chatlayout", {main: "flipper_front"});
    }
});

FlowRouter.route('/faq', {
    action: function() {
        BlazeLayout.render("layout", {main: "FAQ"});
    }
});

FlowRouter.route('/mobile', {
    action: function() {
        BlazeLayout.render("mobilelayout", {main: "mobilemain"});
    }
});

FlowRouter.route('/admin', {
    action: function() {
        BlazeLayout.render("admindashboard", {main: "adminmain"});
    }
});

FlowRouter.route('/streamevents', {
    action: function() {
        BlazeLayout.render("streamEventsLayout", {main: "streamEvents"});
    }
});