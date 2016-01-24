challengeApp.directive('navSection',function(){
    return {
        restrict: 'ECAM',
        scope: {
            title:'@sectionTitle',
            list:'=list'
        },
        templateUrl: 'templates/nav.html',
        link: function (scope) {
            // updateActive updates which list item receives the active class
            scope.updateActive = function(which){
                // don't update disabled links
                if (which.disabled){ return; }
                // find the currently active link & mark it inactive
                // activate the new link
                scope.list.sMap(function(obj){
                    if(obj.active){ obj.active = false; }
                    else if(obj == which){ obj.active = true; }
                });
            };
        }
    };
});