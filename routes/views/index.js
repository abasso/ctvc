const keystone = require('keystone')
const _ = require('lodash')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'homepage';

	locals.data = {
		work: [],
		categories: [],
		carousel: [],
		copy: {}
	}

	// Load the current category filter
	view.on('init', function (next) {

			keystone.list('WorkCategory').model.find({}).exec(function (err, result) {
				locals.data.categories = _.sortBy(result, 'order');
				next(err)
			});
	})

	view.on('init', function (next) {
			keystone.list('Page').model.find({}).exec(function (err, result) {
				locals.data.copy = _.find(result, {slug: 'homepage'})
				next(err)
			});
	})

	view.on('init', function (next) {
		var q = keystone.list('Work').model.find({}).lean()

		q.exec(function (err, results) {
			let yearsObject = {}
			_.each(results, (data) => {
					if (data.carousel === true) {
						data.class = _.find(locals.data.categories, {_id: data.categories[0]}).key
						locals.data.carousel.push(data)
					}
					data.category = _.filter(locals.data.categories, {_id: data.categories[0]})
			})
			locals.data.carousel = _.sortBy(locals.data.carousel, 'carouselPosition')
			locals.data.work = _.take(results, 3);
			console.log(locals.data.work)
			next(err)
		})
	})


	// Render the view
	view.render('index')
};
