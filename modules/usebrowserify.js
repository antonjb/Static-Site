'use strict';

module.exports = function(grunt) {

	var path = require('path');
	var _ = require('lodash');

	/**
	 * 
	 */
	grunt.registerMultiTask('useBrowserify', 'Dynamically adds targets for Browserify', function() {

		var pattern = /<!-- ?\[use:browserify\] ?-->([^]*?)<!-- ?\[end\] ?-->/gm;
		var scriptPattern = /<script [^]*?src=["']([^'"]*?)['"]/gm;
		var scriptTags = [];
		var contents, browserifyConfig;
		var rootDir = this.options().root || '.';
		var destDir = this.options().dest;
		var browserifyTaskFiles = {};
		var fileDirectories;

		// Get the Javascript links
		this.filesSrc.forEach(function(file) {
			contents = grunt.file.read(file);
			contents = contents.match(pattern);
			fileDirectories = path.dirname(file).split(path.sep);

			if (!contents) return;

			contents.forEach(function(scriptBlock) {
				var scriptSrc;
				var scriptDirectories;

				// Find the script blocks in each file. Determine the path
				// relative to the root folder
				scriptBlock.match(scriptPattern).forEach(function(scriptTag){
					scriptSrc = scriptTag.replace(scriptPattern, '$1');
					scriptDirectories;

					scriptSrc = path.join(path.dirname(file), scriptSrc);
					scriptDirectories = scriptSrc.split(path.sep);

					for (var i = 0; i < scriptDirectories.length; i+=1) {
						if (scriptDirectories[i] !== fileDirectories[i]) {
							scriptSrc = _.rest(scriptDirectories, i).join(path.sep);
							break;
						}
					}

					scriptTags.push(scriptSrc);
				});

			});
		});

		scriptTags = _.unique(scriptTags);

		// Set the Grunt file object
		// {dest: source}
		var browserifyDestPath;
		scriptTags.forEach(function(scriptTag){
			browserifyDestPath = [destDir, scriptTag].join(path.sep);
			browserifyTaskFiles[browserifyDestPath] = [rootDir, scriptTag].join(path.sep);
		});

		browserifyConfig = grunt.config('browserify');
		browserifyConfig[this.target] = {
			files: browserifyTaskFiles,
			options: this.options().taskOptions || {}
		};
		
		grunt.config('browserify', browserifyConfig);
	});

};