const keystone = require('keystone')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Init locals
	locals.section = ''


  locals.filters = {
		type: req.path.split("/")[1],
    page: req.params.page,
	}

	locals.data = {
    pages: [],
		page: [],
		categories: [],
		years: []
	}

	locals.media = []

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('Page').model.find({
			state: 'published',
			type: locals.filters.type,
		}).populate('author workType media').lean()

		q.exec(function (err, results) {
      locals.data.pages = _.filter(results, {type: locals.filters.type })
      locals.data.page = (locals.filters.page === undefined) ? locals.data.pages[0] : _.find(locals.data.pages, {slug: locals.filters.page});
      locals.data.page.active = true;
      locals.section = locals.data.pages[0].type
			next(err)
		})
  });

	// Render the view
	view.render('page')
}
