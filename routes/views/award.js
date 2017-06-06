const keystone = require('keystone')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Init locals
	locals.section = 'award'
	locals.filters = {
		category: req.params.category,
	}
	locals.data = {
		awards: [],
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

				keystone.list('Award').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count
					next(err)
				})

			}, function (err) {
				next(err)
			})
		})
	})

	// // Load the current category filter
	// view.on('init', function (next) {
	//
	// 	if (req.params.category) {
	// 		keystone.list('WorkCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
	// 			locals.data.category = result
	// 			next(err)
	// 		})
	// 	} else {
	// 		next()
	// 	}
	// })

	// Load the work
	view.on('init', function (next) {

		var q = keystone.list('Award').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories').lean()

		if (locals.data.category) {
			q.where('categories').in([locals.data.category])
		}

		q.exec(function (err, results) {
      console.log("THE IMAGE", results.thumbnail);
			let yearsObject = {}
			_.each(results.results, (data) => {
				if (_.isUndefined(data.receivedDate)) {
					return
				}
				let receivedDate = moment(data.receivedDate);
				data.receivedDate = receivedDate.format("MMMM YYYY")
				data.receivedYear = receivedDate.format("YYYY")
        console.log(data.receivedDate);
				if (_.isUndefined(_.find(locals.data.years, data.receivedDate))) {
					locals.data.years.push(data.receivedYear)
				}
			})
			locals.data.years = _.uniq(locals.data.years);
			locals.data.awards = results
			next(err)
		})
	})

	// Render the view
	view.render('award')
}
