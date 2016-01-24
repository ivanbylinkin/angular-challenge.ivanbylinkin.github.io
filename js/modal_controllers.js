// project assignment
challengeApp.controller('AssignmentCtrl',['$uibModal','$uibModalInstance','ListData',function($uibModal,$uibModalInstance,ListData){
    // AssignmentCtrl handles all new assignments using the assignment tool
    
    // expose controller scope to entire controller
    var self = this;
    // get the parameters to provide choices
    var factory = new ListData();
    
    self.projects = factory.choices('projects');
    self.deadlines = factory.choices('deadlines');
    self.departments = factory.choices('departments');
    self.resources = factory.choices('resources');
    // setup the new project
    self.newProject = {project:'',deadline:'',department:'',resources:[]};
    // setup the format to display deadline dates
    self.deadlineFormat = 'MM/dd/yyyy';
    self.assignBtnText = 'Assign';
    
    // activate a new modal when creating a new choice (dept/resource)
    // allows access to assignment tool
    self.createChoice = function(template,ctrl,which){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/'+template,
            controller: ctrl
        });
        
        modalInstance.result.then(function(newChoice){
            if (which == 'department'){ self.newProject.department = newChoice; }
            else if (which == 'resources'){ self.newProject.resources.push(newChoice); }
        }, function(){
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    
    // allows users to toggle assignment of a resource
    self.toggleResource = function(resource){
        var index = $.inArray(resource,self.newProject.resources);
        // removes resource if they are already assigned, otherwise assigns them
        if (index == -1){ self.newProject.resources.push(resource); }
        else { self.newProject.resources.splice(index,1); }
    }
    // checks whether resource is assigned
    self.resourceAssigned = function(resource){
        return $.inArray(resource,self.newProject.resources) > -1 ? true : false;
    };
    
    // setup alerts
    self.alerts = {};
    
    var clicks = 0;
    self.ok = function(required){
        clicks++;
        if (!required){ required = []; }
        // check for errors in the form
        var errors = (required.length || !self.newProject.resources.length) && clicks == 1 ? true : false;
        var errorAlert = {type:'warning',fieldsMsg:null,fields:[],resourceMsg:null};
        required.sMap(function(input){ 
            errorAlert.fields.push(input.$name);
            $('[name="assignment"] [name="'+input.$name+'"]').parent().addClass('has-warning');
            $('[name="assignment"] [name="'+input.$name+'"]').one('keydown',function(){
                $(this).parent().removeClass('has-warning')
            })
        });
        if (errors){ 
            if (required.length){ errorAlert.fieldsMsg = 'You are missing information in these fields: '+errorAlert.fields.join(', '); }
            if (!self.newProject.resources.length){ errorAlert.resourceMsg = 'You did not assign any resources.'; }
            $.extend(self.alerts,{optional:errorAlert});
            return;
        }
        else if(self.alerts.optional){ delete self.alerts.optional; }
        
        factory.addProject(self.newProject);
        $uibModalInstance.close(self.newProject);
    };

    self.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
}]);

// project editing
challengeApp.controller('EditCtrl',['$uibModal','$uibModalInstance','ListData','listItem',function($uibModal,$uibModalInstance,ListData,listItem){
    // EditCtrl handles all edits using the assignment tool
    
    // expose controller scope to entire controller
    var self = this;
    // get the parameters to provide choices
    var factory = new ListData();
    
    self.projects = factory.choices('projects');
    self.deadlines = factory.choices('deadlines');
    self.departments = factory.choices('departments');
    self.resources = factory.choices('resources');
    // setup the project
    var project = factory.returnProject(listItem.id);
    // allow the user to edit a temp copy instead of the actual project
    self.newProject = $.extend(true,{},project);
    // setup the format to display deadline dates
    self.deadlineFormat = 'MM/dd/yyyy';
    self.assignBtnText = 'Confirm';
    
    // activate a new modal when creating a new choice (dept/resource)
    // allows access to assignment tool
    self.createChoice = function(template,ctrl,which){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/'+template,
            controller: ctrl
        });
        
        modalInstance.result.then(function(newChoice){
            if (which == 'department'){ self.newProject.department = newChoice; }
            else if (which == 'resources'){ self.newProject.resources.push(newChoice); }
        }, function(){
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    
    // allows users to toggle assignment of a resource
    self.toggleResource = function(resource){
        var index = $.inArray(resource,self.newProject.resources);
        // removes resource if they are already assigned, otherwise assigns them
        if (index == -1){ self.newProject.resources.push(resource); }
        else { self.newProject.resources.splice(index,1); }
    }
    // checks whether resource is assigned
    self.resourceAssigned = function(resource){
        return $.inArray(resource,self.newProject.resources) > -1 ? true : false;
    };
    
    // setup alerts
    self.alerts = {};
     
    var clicks = 0;
    self.ok = function(required){
        clicks++;
        if (!required){ required = []; }
        // check for errors in the form
        var errors = (required.length || !self.newProject.resources.length) && clicks == 1 ? true : false;
        var errorAlert = {type:'warning',fieldsMsg:null,fields:[],resourceMsg:null};
        required.sMap(function(input){ 
            errorAlert.fields.push(input.$name);
            $('[name="assignment"] [name="'+input.$name+'"]').parent().addClass('has-warning');
            $('[name="assignment"] [name="'+input.$name+'"]').one('keydown',function(){
                $(this).parent().removeClass('has-warning')
            })
        });
        if (errors){ 
            if (required.length){ errorAlert.fieldsMsg = 'You are missing information in these fields: '+errorAlert.fields.join(', '); }
            if (!self.newProject.resources.length){ errorAlert.resourceMsg = 'You did not assign any resources.'; }
            $.extend(self.alerts,{optional:errorAlert});
            return;
        }
        else if(self.alerts.optional){ delete self.alerts.optional; }
        
        factory.editProject(self.newProject);
        $uibModalInstance.close(self.newProject);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

// project deletion
challengeApp.controller('DeletionCtrl',['$uibModalInstance','listItem','ListData',function($uibModalInstance,listItem,ListData){
    // expose controller scope to entire controller
    var self = this;
    // setup list data factory
    var factory = new ListData();
    // setup controller variables
    self.project = listItem.project ? listItem.project : listItem.root;
    self.details = factory.returnProject(listItem.id);
    // add the new resource upon clicking "Create"
    self.delete = function () {
        factory.removeProject(self.details);
        $uibModalInstance.close(self.details);
    };
    // close the modal upon clicking "Cancel"
    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

// categories
challengeApp.controller('CategoryEditorCtrl', ['$uibModal','$uibModalInstance','ListData',function($uibModal,$uibModalInstance,ListData){
    // CategoryEditorCtrl handles all category edits using the category editor
    
    // expose controller scope to entire controller
    var self = this;
    // get the parameters to provide choices
    var factory = new ListData();
    
    self.projects = factory.choices('projects');
    self.deadlines = factory.choices('deadlines');
    self.departments = factory.choices('departments');
    self.resources = factory.choices('resources');
    
    // activate a new modal when creating a new choice (dept/resource)
    // allows access to assignment tool
    self.createChoice = function(template,ctrl,which){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/'+template,
            controller: ctrl
        });
    };
    
    self.removeCategory = function(which,choice){
        factory.removeChoice(which,choice);
    };
    
    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

challengeApp.controller('DeptCreationCtrl',['$uibModalInstance','ListData',function($uibModalInstance,ListData){
    // expose controller scope to entire controller
    var self = this;
    // gain access to the ListData factory
    var factory = new ListData();
    // expose the new department variable to bind to
    self.newDept = '';
    self.alerts = {};
    // add the new department upon clicking "Create"
    self.ok = function () {
        if (!self.newDept.length){
            self.alerts.required = {
                type:'danger',
                msg:'New departments must have a name, please fill in the input before submitting.'
            };
            return;
        }
        factory.addChoice('departments',self.newDept);
        $uibModalInstance.close(self.newDept);
    };
    // close the modal upon clicking "Cancel"
    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

challengeApp.controller('ResourceCreationCtrl',['$uibModalInstance','ListData',function($uibModalInstance,ListData){
    // expose controller scope to entire controller
    var self = this;
    // gain access to the ListData factory
    var factory = new ListData();
    // expose the new department variable to bind to
    self.newResource = '';
    self.alerts = {};
    // add the new resource upon clicking "Create"
    self.ok = function(){
        if (!self.newResource.length){
            self.alerts.required = {
                type:'danger',
                msg:'New departments must have a name, please fill in the input before submitting.'
            };
            return;
        }
        factory.addChoice('resources',self.newResource);
        $uibModalInstance.close(self.newResource);
    };
    // close the modal upon clicking "Cancel"
    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);