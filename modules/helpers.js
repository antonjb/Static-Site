/**
 * Various helpers to be made available
 */
exports = module.exports = function(grunt){
	
	// Modules
	var path = require('path'),
		_ = require('lodash'),
		imageSize = require('image-size');

	_.str = require('underscore.string');
	_.mixin(_.str.exports());

	// Variables
	var projectData = grunt.config('project'),
		projectDirs = grunt.config('paths');

	grunt.config.requires('project');

	if (!projectData.copyright) {
		projectData.copyright = grunt.template.today('yyyy');
	}

	// Methods

	/**
	 * Returns the relative path between from and to
	 * @param {String} from - The from pathway
	 * @param {String} to - The to pathway
	 * @returns {String}
	 */
	var relPath = function(from, to){
		return path.relative(from, to);
	};

	/**
	 * Returns the page based on the url parameter or undefined
	 * @param {String} url - The url to search for
	 * @returns {Object|Undefined}
	 */
	var getPageByUrl = function(url){
		return _.find(projectData.nav, function(page){
			return isCurrentPage(url, page.url);
		});
	};

	/**
	 * Checks whether path and url match
	 * @param {String} path - The path or the current page
	 * @param {String} url - URL of page to check against
	 * @returns {Boolean}
	 */
	var isCurrentPage = function(path, url){
		return path === url;
	};

	/**
	 * Returns an object with various navigation details
	 * for the current page.
	 * @param {Object} page - The page to create the navigation object for
	 * @param {Object} dest - The destination of the page
	 *
	 * @returns {Object} nav - The navigation object
	 * @returns {Array} nav.pages - All available pages
	 * @returns {Function(url)} nav.isCurrentPage - Checks if the url is this page
	 * @returns {Object|Undefined} nav.nextPage - The next page available
	 * @returns {Object|Undefined} nav.prevPage - The previous page available
	 */
	var navigationDetails = function(page, dest){
		var pageIndex = _.indexOf(page);

		return {
			pages: projectData.nav,
			isCurrentPage: _.partial(isCurrentPage, page ? page.url : dest),
			nextPage: projectData.nav[pageIndex + 1],
			prevPage: projectData.nav[pageIndex - 1]
		};
	};

	/**
	 * Converts val and name into a HTML attribute
	 * @param {*} val - The value of the attribute. Can be empty for boolean attributes
	 * @param {String} name - The name of the attribute
	 * @return {String}
	 */
	var toHTMLAttribute = function(val, name){
		// Check for boolean attributes
		var attr = _.isUndefined(val) ? [' ', name] : [' ', name, '="', val.toString(), '"'];
		return attr.join('');
	};

	/**
	 * Returns a HTML tag
	 * @param {String} name - The name of the tag
	 * @param {String} attributes - The attributes as a string
	 * @param {Boolean} open - Whether it's an open tag
	 * @return {String}
	 */
	var tag = function(name, attributes, open) {
		open = _.isBoolean(open) ? open : false;
		return ['<', name, attributes, open ? '>' : '/>'].join('');
	}

	/**
	 * Creates an image tag taking care of the src and image width and height
	 * unless overwritten in the attributes property. Will look in the image directory
	 * property from the gruntfile
	 * @param {String} dest - The directory linking to the image
	 * @param {String} src - The name of the image to link to. 
	 * @param {Object} attributes - Object containing all the attributes
	 * @returns {String}
	 */
	var imageTag = function(dest, src, attributes){
		var remoteImg = src.indexOf('://') !== -1,
			dimensions;

		attributes = _.extend({alt: ' '}, attributes || {});

		// Only getting dimensions for local images
		if (!remoteImg) {
			src = [projectDirs.img, src].join('/');
			dimensions = imageSize(['source', src].join('/'));
			// Default to attributes width or height over actual width and height
			attributes.width = attributes.width || dimensions.width;
			attributes.height = attributes.height || dimensions.height;
			src = relPath(dest, src);
		}

		attributes = _.map(attributes, toHTMLAttribute);
		attributes.unshift(toHTMLAttribute(src, 'src')); // Putting src first
		
		return tag('img', attributes.join(''));
	};

	/**
	 * Helper functions specific to the Jade language (http://jade-lang.com/)
	 * @param {String} dest - The destination of the file being exported
	 * @param {String} src - The src files used to create the jade file
	 * 
	 * @returns {Object} jade - Jade helper object
	 * @returns {Underscore} jade._ - Underscore.JS and Underscore.string
	 * @returns {Function(url)} jade.relPath - Returns the relative path to this page
	 * @returns {Object} jade.project - The data from the project json file
	 * @returns {String} jade.pageTitle - The title for this page
	 * @returns {String} jade.imageTag - Creates an image tag with width and height set automatically
	 */
	exports.jade = function(dest, src){
		var cwd = grunt.task.current.target === 'build' ? projectDirs.build : projectDirs.tmp,
			srcDest = dest;
		dest = dest.replace(cwd + '/', '');

		var destDir = path.dirname(dest),
			page = getPageByUrl(dest);

		return {
			_: _,
			relPath: _.partial(relPath, destDir),
			navigation: navigationDetails(page),
			project: projectData,
			pageTitle: page && page.title || undefined,
			imageTag: _.partial(imageTag, destDir)
		};
	}
};