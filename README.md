# angular-challenge.ivanbylinkin.github.io
Demo site for the angular challenge

Access the site: http://ivanbylinkin.github.io/angular-challenge.ivanbylinkin.github.io/

##How & Why

###Tools

I made use of bower as a package manager for all of the JavaScript libraries I needed.
* Angular v1.4.x
  * this was a requirement of the challenge
* ui-router
  * this was a requirement of the challenge
* bootstrap/ui-bootstrap
  * this was used to allow for quicker building of basic layouts and helpful hints (tooltip)
  * also used to allow functionality on a mobile device
* font awesome
  * this was used to provide a visual representation for some of the functions, as well as to add to the app asthetics
* jQuery 1.12.0
  * decided to use the full version of jQuery instead of the Angular provided one

###Structure

####List
The list is kept in 2 formats - both are arrays of objects.
* An original format without a root
  * attributes
    * id - the position of the node in the array
    * project - the project's name
    * deadline - the project's deadline stored as a Date object
    * department - the project's department
    * resources - an array of the assigned resources
  * this format of the list is the one that gets sorted before a root is created
* A secondary format with a root
  * attributes
    * root - this could be the project's name, department, or deadline
    * projects - if the root is not the project's name this is an array of projects with the original attributes
      * totalresources - replaces the resources array if viewing by resources
    * original attributes - if project's name is the root, the remaining attributes are just the original attributes of the project

The original dataset is reformatted into the above formats with a random amount of resources and attributes that correspond with it's id (cycle through the projects array and assign an id, deadline, and department based off it's index).

The list is put into a more clearly visible hiearchial view using Angular's HTML bindings.

####Factories
I made use of 3 factories.
* NavList
  * this factory provides access to a navigation list for the sidebar navigation
  * the navigation list was updated using the public "updateList" function
    * this function was called each time there was a URL change
* OriginalListParameters
  * this factory provides access to the original dataset given for the challenge
  * the original dataset was used as a starting point for categories
  * the original dataset was formatted into a list that matched my list structure using the public "formatted" function
* ListData
  * this factory provides all functions that interracted with the persistent list
  * it provides 12 public access functions - including save & load which are only added when the browser supports local storage
  * the list nodes are only edited indirectly by the controllers through this factory

####Directives
I made use of 1 directive
* navSection
  * takes 2 parameters - sectionTitle & list
  * quickly adds the sidebar navigation list items and an overarching title
  * keeps track of which link to set as primary

####Controllers
I broke up the controllers into 3 categories: controllers (handle main pages), modal controllers, and navigation controllers.

I chose to handle the creation/editing of projects/departments/resources in modals in an attempt to make the UI more appealing and engaging.

Very little logic was put into controllers, they were used mainly to link the data to the HTML pages. A few controllers are on the longer side because they have 1-2 functions that open a modal using ui-bootstrap (which can get lengthy).

####app.js
I put the creation of the module inside its own file. This file contains the variable challengeApp, which is a reference to the angular module, the module configuration function, and the definition of a simple mapping function (which is attached to the prototype of Arrays so it seemed to fit here as it is global).

###Styles
* Bootstrap Dashboard
  * I borrowed the stylings of the bootstrap dashboard example: http://getbootstrap.com/examples/dashboard/
  * This was done to provide a more consistent clean UI that took less time to develop (as it is already made)
* Hierarchical List
  * I used the styles found at: https://jsfiddle.net/u3gd85cj/
  * This is just a simple styling that indents the list properly depending on the level

###Usablity
I tried to incorporate as many safe-guards as I could to prevent the user from accidentally doing something, or not understanding something.

I put in explanations in the modals, I set off alerts when the user edited or deleted a project (I also made a confirmation modal for deletion).
