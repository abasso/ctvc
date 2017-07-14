const keystone = require('keystone')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {
	console.log("YYAYYYYYYYYY")

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Init locals
	locals.section = 'work'
	locals.filters = {
		category: req.params.category,
	}
	locals.data = {
		work: [],
		categories: [],
		years: []
	}

	// Load all categories
	view.on('init', function (next) {

		keystone.list('WorkCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err)
			}

			locals.data.categories = _.sortBy(results, 'order');

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Work').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count
					next(err)
				})

			}, function (err) {
				next(err)
			})
		})
	})

	// Load the work
	view.on('init', function (next) {

		var q = keystone.list('Work').paginate({
			page: req.query.page || 1,
			perPage: 100,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-siteOrder')
			.populate('author workType')

		if (locals.data.category) {
			q.where('workType').in([locals.data.category])
		}

		q.exec(function (err, results) {
			let yearsObject = {}
			_.each(results.results, (data) => {
				if (_.isUndefined(data.broadcastDate)) {
					return
				}

				let broadCastDate = moment(data.broadcastDate)
				data.shortBroadcastDate = broadCastDate.format("MMMM YYYY")
				data.broadCastYear = broadCastDate.format("YYYY")
				if (_.isUndefined(_.find(locals.data.years, data.broadCastYear))) {
					locals.data.years.push(data.broadCastYear)
				}
			})
			locals.data.years = _.uniq(locals.data.years).reverse();
			locals.data.work = results
			next(err)
		})
	})

	// Render the view
	view.render('work')
}
