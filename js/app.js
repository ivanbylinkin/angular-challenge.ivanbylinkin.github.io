var challengeApp = angular.module('AngularChallenge',['ui.router','ui.bootstrap']);

challengeApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    // handle all unknown urls back to home
    $urlRouterProvider.otherwise("/");
    // setup the url states
    $stateProvider.state('home',{
        url:'/home',
        templateUrl:'pages/home.html',
        controller:'MainCtrl as main'
    }).state('empty',{
        url:'/',
        templateUrl:'pages/home.html',
        controller:'MainCtrl as main'
    }).state('save',{
        url:'/save',
        templateUrl:'pages/save.html',
        controller:'SaveCtrl as saved'
    }).state('load',{
        url:'/load',
        templateUrl:'pages/save.html',
        controller:'LoadCtrl as saved'
    }).state('project_view',{
        url:'/:topLevel/project/:projectId',
        templateUrl:'pages/project.html',
        controller:'ProjectView as view'
    }).state('secondary_sorted',{
        url:'/:topLevel/:resourceLevel',
        templateUrl:'pages/sorted.html',
        controller:'SecondaryLevelSort as sorted'
    }).state('sorted',{
        url:'/:topLevel',
        templateUrl:'pages/sorted.html',
        controller:'TopLevelSort as sorted'
    });
}]);

// create a simple mapping function
if (!Array.prototype.sMap){
    Array.prototype.sMap = function(callback){
        // requires a callback function
        if (!callback){ return; }
        // loops through all array items and returns a new array of returned objects
        var nArr = [];
        for (var i=0; i<this.length; i++){
            var obj = callback(this[i],i);
            if (obj){ nArr.push(obj); }
        }
        return nArr;
    }
}