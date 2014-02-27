/**
 * 
 */
exports = module.exports = function(grunt){
	
	// Modules
	var path = require('path'),
		_ = require('lodash');

	// Variables
	var projectData = grunt.config('project'),
		projectDirs = grunt.config('paths');

	grunt.config.requires('project');

	if (!projectData.copyright) {
		projectData.copyright = grunt.template.today('yyyy');
	}

	// Methods

	/**
	 * 
	 */
	var relPath = function(from, to){
		return path.relative(from, to);
	};

	/**
	 * 
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
	 */
	var isCurrentPage = function(path, url){
		return path === url;
	};

	/**
	 *
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
	 */
	exports.jade = function(dest, src){
		dest = dest.replace(projectDirs.tmp + '/', '');

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