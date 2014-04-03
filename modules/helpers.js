/**
 * Various helpers to be made available
 */
exports = module.exports = function(grunt){
	
	// Modules
	var path = require('path'),
		_ = require('lodash');

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
	 * Helper functions specific to the Jade language (http://jade-lang.com/)
	 * @param {String} dest - The destination of the file being exported
	 * @param {String} src - The src files used to create the jade file
	 * 
	 * @returns {Object} jade - Jade helper object
	 * @returns {Underscore} jade._ - Underscore.JS and Underscore.string
	 * @returns {Function(url)} jade.relPath - Returns the relative path to this page
	 * @returns {Object} jade.project - The data from the project json file
	 * @returns {String} jade.pageTitle - The title for this page
	 */
	exports.jade = function(dest, src){
		var cwd = grunt.task.current.target === 'build' ? projectDirs.build : projectDirs.dev;
		dest = dest.replace(cwd + '/', '');

		var destDir = path.dirname(dest),
			page = getPageByUrl(dest);

		return {
			_: _,
			relPath: _.partial(relPath, destDir),
			navigation: navigationDetails(page),
			project: projectData,
			pageTitle: page && page.title || undefined
		};
	}
};