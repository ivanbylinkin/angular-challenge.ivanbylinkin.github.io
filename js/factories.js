challengeApp.factory('NavList',['$location','ListData',function($location,ListData){
    // memory scope
    var projects = new ListData();
    var list = [], additional = [], previous = [];
    var factory = function(){
        // public scope
        this.updateList = function(){
            var url = geturl();
            if (!url.length){ 
                $location.path('/');
                url = '/';
            }
            // clear the previous links
            list.length = 0;
            additional.length = 0;
            previous.length = 0;
            // start with the default links
            var tmpList = defaultLinks;
            // check for correct resource link
            switch(url){
                case '/projects':
                    tmpList[0].active = true;
                    additional.push(resourceLinks[0]);
                    break;
                case '/deadlines':
                    tmpList[1].active = true;
                    additional.push(resourceLinks[1]);
                    break;
                case '/departments':
                    tmpList[2].active = true;
                    additional.push(resourceLinks[2]);
                    break;
                default:
                    additional.push(resourceLinks[2]);
                    additional[0].disabled = true;
                    break;
            }
            // just in case user is already in a resource link
            // create the back link & set the proper resource link
            if (url.indexOf('resources') > -1 || url.indexOf('project/') > -1){
                // reset the additional links
                additional.length = 0;
                // find the previous & resource links
                var prev = url.split('/')[1];
                defaultLinks.sMap(function(obj,i){
                    if (obj.link == '#/'+prev){ 
                        // relies on the fact that default links and resource links are in the same order
                        additional.push(resourceLinks[i]);
                        previous.push(obj);
                    }
                });
                $.extend(additional[0],{disabled:false,active:true});
            }
            
            if (url == '/'){ 
                tmpList.sMap(function(obj){ 
                    obj.disabled = true;
                    obj.link = '#/';
                });
            }
            
            $.merge(list,tmpList);
            
            // sort projects
            projects.sort();
            
            return {list:list,additional:additional,previous:previous};
        };
        // private scope
        var geturl = function(){ return $location.$$url; };
        var resourceLinks = [{
            display:'Resource Totals',
            link:'#/projects/resources',
            icon:'users'
        },{
            display:'Resource Totals',
            link:'#/deadlines/resources',
            icon:'users'
        },{
            display:'Resource Totals',
            link:'#/departments/resources',
            icon:'users'
        }],
        defaultLinks = [{
            display:'Projects',
            link:'#/projects',
            icon:'tasks'
        },{
            display:'Deadlines',
            link:'#/deadlines',
            icon:'calendar'
        },{
            display:'Departments',
            link:'#/departments',
            icon:'building'
        }];
    };
    // provide access
    return factory;
}]);

challengeApp.factory('OriginalListParameters',[function(){
    // memory scope
    var factory = function(){
        // public scope
        var self = this;
        self.data = function(which){
            if (which){ return originalDataset[which]; }
            return originalDataset;
        };
        self.formatted = function(){
            function randomResources(){
                return Math.floor((Math.random() * 7) + 1); // assign between 1 and 7 resources
            }
            return originalDataset.projects.sMap(function(project,i){
                // very boring format of data
                var nProject = {};
                nProject.id = i;
                nProject.project = project;
                nProject.deadline = new Date(originalDataset.deadlines[i]);
                nProject.department = originalDataset.departments[i];
                nProject.resources = function(){
                    var arr = [];
                    for (var k=0; k<randomResources(); k++){
                        arr.push(originalDataset.resources[k]);
                    }
                    return arr;
                }();
                nProject.totalresources = nProject.resources.length;
                return nProject;
            });
        };
        // private scope
        var originalDataset =
        {
            "deadlines" : [
                "April 01, 2016 12:00:00",
                "March 15, 2016 12:00:00",
                "May 01, 2016 12:00:00",
                "January 01, 2016 12:00:00",
                "July 07, 2016 12:00:00"
            ],
            "projects" : [
                "Show Three Lists",
                "Make Stepped List",
                "Add UI-Router Rules",
                "Create Filters",
                "Sum Up Subtotals"
            ],
            "departments" : [
                "App Engineering",
                "Marketing",
                "DBAdmin",
                "SysOps",
                "Embedded",
                "GroceryOps"
            ],
            "resources" : [
                "Kirk Middleton",
                "Spenser Estrada",
                "Kierra Buckner",
                "Hunter Luna",
                "Ahmad Justice",
                "Breana Medina",
                "Shelbie Cervantes"
            ]
        };
    };
    // provide access
    return factory;
}]);

challengeApp.factory('ListData',['OriginalListParameters','$location',function(OriginalListParameters,$location){
    // memory scope
    var params = new OriginalListParameters().data();
    var list = new OriginalListParameters().formatted();
    var sorted = [];
    // runs through the deadlines and turns them into dates
    params.deadlines = params.deadlines.sMap(function(date){ return new Date(date); });
    var factory = function(){
        var self = this;
        // public scope
        self.choices = function(which){
            if (which){ return params[which]; }
            return params;
        };
        self.addChoice = function(which,choice){
            if (!which){ return; }
            params[which].push(choice);
        };
        self.removeChoice = function(which,choice){
            if (!which){ return; }
            // find the index
            var index = null;
            params[which].sMap(function(obj,i){ if(obj == choice){ index = i; } });
            // change projects that contain the removed choice
            if (which == 'departments'){
                list.sMap(function(obj){ if (obj.department == choice){ obj.department = 'Unknown'; } });
            }
            if (which == 'resources'){
                list.sMap(function(obj){ 
                    var rIndex = $.inArray(choice,obj.resources);
                    if (rIndex > -1){
                        obj.resources.splice(rIndex,1);
                    }
                });
            }
            // re-sort & reformat
            self.sort();
            self.formattedList();
            // delete the parameter
            params[which].splice(index,1);
        };
        self.addProject = function(project){
            // assign the project a auto incrementing id
            project.id = list.length;
            // calculate the # of resources assigned
            project.totalresources = project.resources.length;
            // add the project
            list.push(project);
            // re-sort & reformat
            self.sort();
            self.formattedList();
        };
        self.removeProject = function(project){
            // find the index of the project to remove
            var index = 0;
            list.sMap(function(obj,i){ if (obj == project){ index = i; }});
            // remove project
            list.splice(index,1);
            // re-sort && re-format
            self.sort();
            self.formattedList();
        };
        self.editProject = function(project){
            // extend the project with the new parameters
            var original = self.returnProject(project.id);
            $.extend(original,project);
            // re-sort & reformat
            self.sort();
            self.formattedList();
        };
        self.sort = function(){
            // sorts the list based off url parameters
            var sort = sortBy();
            switch(sort.top){
                case 'project':
                    list.sort(function(a,b){
                        if(a.project < b.project) return -1;
                        if(a.project > b.project) return 1;
                        return 0;
                    });
                    break;
                case 'deadline':
                    list.sort(function(a,b){
                        var aDate = new Date(a.deadline),
                        bDate = new Date(b.deadline);
                        
                        if(aDate < bDate) return -1;
                        if(aDate > bDate) return 1;
                        return 0;
                    });
                    break;
                default: // department
                    list.sort(function(a,b){
                        if(a.department < b.department) return -1;
                        if(a.department > b.department) return 1;
                        return 0;
                    });
                    break;
            }
        };
        self.formattedList = function(){
            var sort = sortBy();
            var top = sort.top,
            resources = sort.second;
            
            sorted.length = 0;
            var uniqueRoots = [];
            list.sMap(function(obj){
                // create a key
                var key = obj[top];
                if (!key){ key = 'Unknown'; }
                else if (top == 'deadline'){ key = dateString(obj[top]); }
                // create a root with the proper value
                if ($.inArray(key,uniqueRoots) == -1){
                    sorted.push({ root: key });
                    uniqueRoots.push(key);
                }
                // get the needed root from sorted
                var root = null;
                sorted.sMap(function(rObj){ if (rObj.root == key){ root = rObj; } });
                // add in additional levels based on top level
                if (top == 'project'){
                    // adopt the properties because they are correctly formatted
                    $.extend(true,root,obj);
                    delete root[top];
                    if (resources){
                        // delete the resources array, but keep the totals
                        delete root.resources;
                    }
                }
                else {
                    if (!root.projects){ root.projects = []; }
                    var tmp = $.extend(true,{},obj);
                    delete tmp[top];
                    if (resources){ delete tmp.resources; }
                    root.projects.push(tmp);
                }
            });
            return sorted;
        };
        self.returnProjects = function(){ return list; };
        self.returnProject = function(id){ 
            if (id === undefined){ return; }
            var project = null;
            list.sMap(function(obj){ if (obj.id == id){ project = obj; }});
            return project;
        };
        if (typeof(Storage) !== 'undefined'){
            self.save = function(){
                localStorage.data = angular.toJson(list);
                localStorage.params = angular.toJson(params);
            };
            self.load = function(){
                var loaded = false;
                if (localStorage.data){ 
                    list.length = 0;
                    $.merge(list,angular.fromJson(localStorage.data));
                    loaded = true;
                }
                if (localStorage.params){
                    params.length = 0;
                    $.merge(params,angular.fromJson(localStorage.params));
                }
                return loaded;
            };
        }
        // private scope
        function sortBy(){
            // checks the current url to see how data should be sorted
            if ($location.$$url == '/'){ return 'department'; }
            if ($location.$$url.indexOf('/departments') > -1 || $location.$$url.indexOf('/home') > -1 || $location.$$url.indexOf('/save') > -1 || $location.$$url.indexOf('/load') > -1){ 
                if ($location.$$url.indexOf('resources') > -1){ return {top:'department',second:'resources'}; }
                return {top:'department'}; 
            }
            else if ($location.$$url.indexOf('/projects') > -1){ 
                if ($location.$$url.indexOf('resources') > -1){ return {top:'project',second:'resources'}; }
                return {top:'project'};
            }
            else if ($location.$$url.indexOf('/deadlines') > -1){
                if ($location.$$url.indexOf('resources') > -1){ return {top:'deadline',second:'resources'}; }
                return {top:'deadline'};
            }
        }
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        function dateString(date){
            var month = months[date.getMonth()];
            var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
            var mins = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
            var secs = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
            return month+' '+day+', '+date.getFullYear()+' '+hours+':'+mins+':'+secs;
        }
    };
    // provide access
    return factory;
}]);
