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

	locals.media = []

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find()

		q.exec(function (err, results) {
			locals.media = results
			next(err)
		})

	})

	view.on('init', function (next) {

		keystone.list('WorkCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err)
			}
			locals.data.categories = results;
			next(err)
		})
	})

	// Load the awards
	view.on('init', function (next) {

		var q = keystone.list('Award').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		}).sort('-publishedDate')
			.populate('work workType award').lean()

		q.exec(function (err, results) {
			let yearsObject = {}
			_.each(results.results, (data) => {
				if(data.work) {
					data.workType = _.find(locals.data.categories, {_id: data.work.workType});
					// console.log("THE WORK TYPE", workType);
				}
				if (_.isUndefined(data.receivedDate)) {
					return
				}

				if (_.isUndefined(data.award)) {
					return
				}
				let receivedDate = moment(data.receivedDate);
				data.receivedDate = receivedDate.format("MMMM YYYY")
				data.receivedYear = receivedDate.format("YYYY")
				if (_.isUndefined(_.find(locals.data.years, data.receivedDate))) {
					locals.data.years.push(data.receivedYear)
				}
			})
			let groupedAwardsObject = _.groupBy(results.results, "receivedYear");
			let groupedAwards = []
			_.each(groupedAwardsObject, (value, key) => {
				groupedAwards.push({
					year: key,
					items : value
				})
			})
			locals.data.years = _.uniq(locals.data.years);
			locals.data.awards = _.sortBy(groupedAwards, "receivedDate").reverse();
			next(err)
		})
	})

	// Render the view
	view.render('award')
}
