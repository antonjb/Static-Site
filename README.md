# Static Site generator
Grunt set-up for static site generation with relative links. The primary purpose of this is to support locally delivered content.

## Tasks

`grunt dev`

Tasks used for development. Loads into default browser and starts watch task. Will also run testing through Jasmine.

`grunt build`

Compiles everything into the build folder. Minifies JavaScript, CSS and images.

###project.json

JSON file for holding global site data.

##Helpers
###jade

**Underscore** `_`

Access to [Underscore.js](http://underscorejs.org/) methods

**relPath**: `relPath(to)`

Returns the relative path between the page and `to`

- `to` (String) - The item to link to

**navigation**: `navigation()`

Returns a navigation object for the current page with properties:

- `pages` (Array) - All available pages
- `isCurrentPage(url)` (Boolean) - Checks if the url is the current page
- `nextPage` (Object|undefined) - Next page data if available
- `prevPage` (Object|undefined) - Prev page data if available
- `project` (Object) - The data from the project json file

**pageTitle**: `pageTitle` (String)

The title for this page or undefined if not set.

**imageTag**: `imageTag(src, attributes)` 

Creates an image tag with width and height (for local images) taken from the image

- `src` (String) - The src of the image. Automatically looks in the images directory set in Gruntfile
- `attributes` (Object) - Object containing key/value pairs of HTML attributes. Setting width and height will overwrite the automatic values

##Preprocessors
- [jade](http://jade-lang.com/)
- [Compass](http://compass-style.org/)

##Dependencies
- [Grunt](http://gruntjs.com/)
- [grunt-contrib-jade](https://github.com/gruntjs/grunt-contrib-jade)
- [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass)
- [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
- [grunt-contrib-jasmine](https://github.com/gruntjs/grunt-contrib-jasmine)
- [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
- [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)
- [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
- [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
- [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
- [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)
- [grunt-contrib-symlink](https://github.com/gruntjs/grunt-contrib-symlink)
- [grunt-contrib-compress](https://github.com/gruntjs/grunt-contrib-compress)
- [grunt-usemin](https://github.com/yeoman/grunt-usemin)
- [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)
- [lodash](http://lodash.com/)
- [underscore.string](http://epeli.github.io/underscore.string/)
- [jshint-stylish](https://github.com/sindresorhus/jshint-stylish)
- [grunt-concurrent](https://github.com/sindresorhus/grunt-concurrent)
- [image-size](https://github.com/netroy/image-size)