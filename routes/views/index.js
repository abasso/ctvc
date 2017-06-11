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
		copy: {},
		showreel: ''
	}


	// Load the current category filter
	view.on('init', function (next) {

			keystone.list('WorkCategory').model.find({}).exec(function (err, result) {
				locals.data.categories = _.sortBy(result, 'order');
				next(err)
			});
	})

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find()

		q.exec(function (err, results) {
			locals.data.showreel = _.find(results, {key: 'showreel'}).videoUrl
			next(err)
		})

	})

	view.on('init', function (next) {
			var q = keystone.list('Carousel').model.find({}).populate('work page').lean()
			q.exec(function (err, results) {
				_.each(results, (result) => {
					if(result.work) {
						result.work.workType = _.find(locals.data.categories, {'_id': result.work.workType})
						// if(result.title) result.work.title = result.title
						// if(result.image) result.work.images[0] = result.image
					}
				})
				results = _.sortBy(results, 'sortOrder')
				console.log("CAROUSEL", results);
				locals.data.carousel = results
				next(err)
			})
	})

	view.on('init', function (next) {
			keystone.list('Page').model.find({}).exec(function (err, result) {
				locals.data.copy = _.find(result, {slug: 'homepage'})
				next(err)
			});
	})

	view.on('init', function (next) {
		var q = keystone.list('Work').model.find({}).populate('workType').lean()

		q.exec(function (err, results) {
			locals.data.work = _.take(results, 3);
			next(err)
		})
	})


	// Render the view
	view.render('index')
};
