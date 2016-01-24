challengeApp.controller('TopNavCtrl',['$uibModal',function($uibModal){
    var self = this;
    // allows access to assignment tool
    self.assign = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size:'lg',
            templateUrl: 'templates/assignment.html',
            controller: 'AssignmentCtrl as assign'
        });
    };
    self.editCategories = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size:'lg',
            templateUrl: 'templates/categories.html',
            controller: 'CategoryEditorCtrl as editor'
        });
    };
}]);

challengeApp.controller('NavCtrl',['NavList',function(NavList){
    // NavCtrl controlls the sidebar navigation
    
    // expose controller scope to entire controller
    var self = this;
    // the navigation list is populated through a factory
    var navigation = new NavList();
    // the factory updates the list based on current url
    var allLists = navigation.updateList();
    self.list = allLists.list;
    self.additional = allLists.additional;
    
    // add the ability to trigger the off-canvas
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
}]);
