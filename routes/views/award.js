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
		years: [],
		meta: {
			title: "Awards | CTVC",
			description: "CTVC is an independent production company producing content that raises important ethical and moral issues, from the perspective of those of “all faiths and none”, for mainstream television and radio broadcasters.",
			image: "",
			url: "http://www.ctvc.co.uk"
		}

	}

	locals.media = []

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find()

		q.exec(function (err, results) {
			locals.media = results
			locals.data.partners = _.filter(results, {showInFooter: true})
			let showreel = _.find(results, {key: 'showreel'}).videoEmbed
			locals.data.showreel = showreel.split("\n").join("")

			next(err)
		})

	})

	view.on('init', function (next) {

		keystone.list('WorkCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err)
			}
			locals.data.categories = results
			next(err)
		})
	})

	// Load the awards
	view.on('init', function (next) {

		var q = keystone.list('Award').paginate({
			page: req.query.page || 1,
			perPage: 100,
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
					data.workType = _.find(locals.data.categories, {_id: data.work.workType})
				}
				if (_.isUndefined(data.receivedDate)) {
					return
				}

				if (_.isUndefined(data.award)) {
					return
				}
				let receivedDate = moment(data.receivedDate)
				data.receivedDate = receivedDate.format("MMMM YYYY")
				data.receivedYear = receivedDate.format("YYYY")
				data.receivedDateSort = receivedDate.format("X")
				if (_.isUndefined(_.find(locals.data.years, data.receivedDate))) {
					locals.data.years.push(data.receivedYear)
				}
			})
			let groupedAwardsObject = _.groupBy(results.results, "receivedYear")
			let groupedAwards = []
			_.each(groupedAwardsObject, (value, key) => {
				groupedAwards.push({
					year: key,
					items : _.sortBy(value, "receivedDateSort").reverse()
				})
			})

			locals.data.years = _.uniq(locals.data.years)
			locals.data.awards = _.sortBy(groupedAwards, "receivedDate").reverse()
			next(err)
		})
	})

	// Render the view
	view.render('award')
}
