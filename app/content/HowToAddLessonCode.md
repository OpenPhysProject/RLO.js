### How To Add lesson code to this project
1. Add new file

2. Edit file

3. Add file to Index.html

#### Add new file
1. GoTo app/content/[yourLesson]/views
2. copy app/scripts/views/lessonTemplate/Row0_Col0.js into the new folder as a starting point.
3. renamed the copied file to match the template file it is associated with, for example Row0_Col3
4. Open the file in an editor

5. Change line 2, replacing lessonRoute with the route property of the related data file  
OER.Views.MoreParticles = OER.Views.MoreParticles || {};

6. change line 7, replace lessonRoute with the route property of the related data file, as above,
and changing the NavCardRoute with the route property of related entry in contentMapData.  
```
OER.Views.MoreParticles.MakeAParty = Backbone.View.extend({
```

7. change line 9 to reference the related template file  
template: JST['app/content/lesson3/templates/Row0_Col3.ejs'],

8. You can now add new behaviors.  This is a backbone.js view, to learn more about
what that means check out http://backbonejs.org/#View

#### Add file to Index.html
1. open app/index.html
2. scroll to the very bottom
3. following the existing pattern, add a reference for the view file you just created
above the related data file
```
<!-- lesson 3 -->  
<script src="content/lesson3/views/Row0_Col3.js"></script>
```