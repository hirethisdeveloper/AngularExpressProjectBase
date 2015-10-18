Angular Express Project Base
============================
*Author: Phil Pastorek (contact@hirethisdeveloper.com)*

Description
-----------

This serves as a project starting point which will allow a developer to start out with a functional AngularJS client and ExpressJS node server with routing that has a three part login (username - password - choose organization) which is usable out of the box.

This project is tuned for projects which will serve as a SaaS platform, where your users are companies which will have their own set of users. All user accounts can be part of one or many organizations. 

SaaS Company ---
|_ Organization 1
...|_ user 1
...|_ user 2
|_ Organization 2
...|_ user 2
...|_ user 3

When a user logs in, after the initial authentication (username/password) the included ExpressJS server returns a listing of organizations the user is a part of for them to select which one they wish to log in under.

The database schema includes a pattern of fields which will allow a developer to follow, for creating the rest of their application, for data segregation between organizations.

Installation
------------

 1. clone this repository
 2. run "npm install" in the main project folder to download libraries needed in the client
 3. run "npm install" in the server/ folder to download libraries needed by the server
 4. rename "server/utils/sample_database.js" to "server/utils/database.js. Then edit the file and insert your database information.
 5. import the included database sql file to set up your database



 
