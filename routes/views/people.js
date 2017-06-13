const keystone = require('keystone')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Init locals
	locals.section = 'people'


  locals.filters = {
		type: req.path.split("/")[1],
    page: req.params.page,
	}

	locals.data = {
    people: [],
	}

	locals.media = []

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('People').model.find().populate('image').lean()

		q.exec(function (err, results) {
      console.log(err);
      console.log("THE RESULTS", results)
      locals.data.people = results
			next(err)
		})
  });

	// Render the view
	view.render('people')
}
