const keystone = require('keystone')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Set locals
	locals.filters = {
		item: req.params.item,
	}
	locals.data = {
		items: [],
	}

	locals.media = []
	locals.awards = []
	locals.section = 'item'


		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Media').model.find()
			q.exec(function (err, results) {
				locals.media = results
				next(err)
			})

		})

		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Award').model.find().lean()
			q.exec(function (err, results) {
				_.each(results, (result) => {
					let receivedDate = moment(result.receivedDate)
					result.year = receivedDate.format("YYYY")
					result.award = _.find(locals.media, {_id: result.award});
					console.log(result.links)
				})
				locals.awards = results
				next(err)
			})
		})

	// Load the current post
	view.on('init', function (next) {
		var q = keystone.list('Work').model.findOne({
			state: 'published',
			slug: locals.filters.item,
		}).populate('author workType media').lean()

		q.exec(function (err, result) {
			result.carousel = []
			result.awards = _.filter(locals.awards, {work: result._id})
			if (result.images) {
				_.each(result.images, (image, index) => {
					if (index === 0 && result.video) {
						image.showVideoControl = true
					}
					result.carousel.push(image)
				})
			}
			locals.data.item = result
			console.log(locals.data.item)
			next(err)
		})

	})

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('Work').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4')

		q.exec(function (err, results) {
			locals.data.items = results
			next(err)
		})

	})

	// Render the view
	view.render('item')
}
