var grunt = require('grunt');
var Scraper = require('grunt-scrape');

module.exports = function(grunt) {

  grunt.registerMultiTask('scrape', 'Extract data from web pages.', function() {
    var config = this.data;
    var done = this.async();

    Scraper.scrape(config)
      .then(function() {
        done();
      });
  });
};