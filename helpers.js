// Jade Helpers

module.exports = function(grunt){
	
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
	var isCurrentPage = function(){

	};

	/**
	 *
	 */
	var navigationDetails = function(){
		return {
			pages: projectData.nav,
			isCurrentPage: true,
			nextPage: {},
			prevPage: {}
		};
	};

	/**
	 *
	 */
	return {
		jade: function(dest, src){

			var destDir = path.dirname(dest.replace(projectDirs.tmp + '/', ''));

			return {
				relPath: _.partial(relPath, destDir),
				navigation: navigationDetails,
				isCurrentPage: isCurrentPage,
				project: projectData
			}
		}
	}
};