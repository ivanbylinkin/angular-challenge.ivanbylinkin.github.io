challengeApp.controller('MainCtrl',['NavList','ListData','$uibModal','$location',function(NavList,ListData,$uibModal,$location){
    // MainCtrl handles the root url view: '/'
    
    // redirect if data exists
    var data = new ListData().returnProjects();
    if ($location.$$url == '/home'){ this.list = data; }
    else if (data.length){ $location.path('/departments'); }
    // expose controller scope to entire controller
    var self = this;
    // update the navigation
    new NavList().updateList();
    // allows access to assignment tool
    self.assign = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size:'lg',
            templateUrl: 'templates/assignment.html',
            controller: 'AssignmentCtrl as assign'
        });
    };
}]);

challengeApp.controller('TopLevelSort',['$stateParams','$timeout','$location','$uibModal','NavList','ListData',function($stateParams,$timeout,$location,$uibModal,NavList,ListData){
    // expose controller scope to entire controller
    var self = this;
    // update the navigation
    new NavList().updateList();
    // setup list data
    var factory = new ListData();
    self.list = factory.formattedList();
    self.topLevel = $stateParams.topLevel;
    // setup alerts
    self.alerts = {};
    
    // setup delete operation
    self.delete = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/delete.html',
            controller: 'DeletionCtrl as deleted',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a deleted alert
            var deletedAlert = {deleted: {
                type: 'success',
                msg: 'You successfully deleted project '+item.project+' from the list of assigned projects.'
            }};
            // add the alert
            $.extend(self.alerts, deletedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.deleted; }, 1500);
            // send user to root if no more data is left
            if (!self.list.length){ $location.path('/'); }
        });
    };
    // setup edit operation
    self.edit = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'templates/assignment.html',
            controller: 'EditCtrl as assign',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a edited alert
            var editedAlert = {edited: {
                type: 'success',
                msg: 'You successfully edited the project '+item.project+''
            }};
            // add the alert
            $.extend(self.alerts, editedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.edited; }, 1500);
        });
    };
    // setup date checking
    self.isDate = function(n){
        if (typeof(n) == 'object'){ return true; }
        return false;
    };
}]);

challengeApp.controller('SecondaryLevelSort',['$stateParams','$timeout','$location','$uibModal','NavList','ListData',function($stateParams,$timeout,$location,$uibModal,NavList,ListData){
    // expose controller scope to entire controller
    var self = this;
    // update the navigation
    self.previous = new NavList().updateList().previous[0];
    // setup list data
    var factory = new ListData();
    self.list = factory.formattedList();
    self.topLevel = $stateParams.topLevel;
    // setup alerts
    self.alerts = {};
    // setup delete operation
    self.delete = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/delete.html',
            controller: 'DeletionCtrl as deleted',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a deleted alert
            var deletedAlert = {deleted: {
                type: 'success',
                msg: 'You successfully deleted project '+item.project+' from the list of assigned projects.'
            }};
            // add the alert
            $.extend(self.alerts, deletedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.deleted; }, 1500);
            // send user to root if no more data is left
            if (!self.list.length){ $location.path('/'); }
        });
    };
    // setup edit operation
    self.edit = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'templates/assignment.html',
            controller: 'EditCtrl as assign',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a edited alert
            var editedAlert = {edited: {
                type: 'success',
                msg: 'You successfully edited the project '+item.project+''
            }};
            // add the alert
            $.extend(self.alerts, editedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.edited; }, 1500);
        });
    };
    // setup date checking
    self.isDate = function(n){
        if (typeof(n) == 'object'){ return true; }
        return false;
    };
    // redirect to the project view
    self.redirect = function(id){
        var url = $location.$$url.replace('/resources','/project/'+id);
        $location.path(url);
    };
}]);

challengeApp.controller('ProjectView',['$stateParams','$timeout','$location','$uibModal','NavList','ListData',function($stateParams,$timeout,$location,$uibModal,NavList,ListData){
    // expose controller scope to entire controller
    var self = this;
    // update the navigation
    self.previous = new NavList().updateList().previous[0];
    self.previous.link += '/resources';
    // setup list data
    var factory = new ListData();
    self.project = factory.returnProject($stateParams.projectId);
    // setup alerts
    self.alerts = {};
    // setup delete operation
    self.delete = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/delete.html',
            controller: 'DeletionCtrl as deleted',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a deleted alert
            var deletedAlert = {deleted: {
                type: 'success',
                msg: 'You successfully deleted project '+item.project+' from the list of assigned projects.'
            }};
            // add the alert
            $.extend(self.alerts, deletedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.deleted; }, 1500);
            // send user to root if no more data is left
            if (!self.list.length){ $location.path('/'); }
        });
    };
    // setup edit operation
    self.edit = function(project){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'templates/assignment.html',
            controller: 'EditCtrl as assign',
            resolve: {
                listItem: project
            }
        });

        modalInstance.result.then(function(item){
            // create a edited alert
            var editedAlert = {edited: {
                type: 'success',
                msg: 'You successfully edited the project '+item.project+''
            }};
            // add the alert
            $.extend(self.alerts, editedAlert);
            // remove the alert in a second and a half
            $timeout(function(){ delete self.alerts.edited; }, 1500);
        });
    };
}])

challengeApp.controller('SaveCtrl', ['$location','$timeout','ListData',function($location,$timeout,ListData){
    var self = this;
    
    var factory = new ListData();
    
    if (factory.save){ 
        factory.save();
        self.msg = "Your data was saved."
    }
    else {
        self.msg = "Unable to Save, LocalStorage does not exist, try using a different browser."
    }
    
    var count = 3;
    self.redirect = count+' seconds';
    function countdown(){
        $timeout(function(){
            count--;
            self.redirect = count+' seconds';
            if (count > 0){ countdown(); }
            else { $location.path('/home'); }
        }, 1000);
    }
    
    countdown();
}]);

challengeApp.controller('LoadCtrl', ['$location','$timeout','ListData',function($location,$timeout,ListData){
    var self = this;
    
    var factory = new ListData();
    
    if (factory.load){ 
        var loaded = factory.load();
        if (loaded){ self.msg = "Your data was loaded." }
        else { self.msg = "Sorry, no saved data could be found."; }
    }
    else {
        self.msg = "Unable to Load, LocalStorage does not exist, try using a different browser."
    }
    
    var count = 3;
    self.redirect = count+' seconds';
    function countdown(){
        $timeout(function(){
            count--;
            self.redirect = count+' seconds';
            if (count > 0){ countdown(); }
            else { $location.path('/home'); }
        }, 1000);
    }
    
    countdown();
}]);
