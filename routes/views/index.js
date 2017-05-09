const keystone = require('keystone')
const _ = require('lodash')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.data = {
		work: [],
		categories: [],
		carousel: []
	}

	// Load the current category filter
	view.on('init', function (next) {

			keystone.list('WorkCategory').model.find({}).exec(function (err, result) {
				locals.data.categories = result
				next(err)
			});
	})

	view.on('init', function (next) {
		var q = keystone.list('Work').model.find({})

		q.exec(function (err, results) {
			let yearsObject = {}
			_.each(results, (data) => {
					if (data.carousel === true) {
						data.class = _.find(locals.data.categories, {_id: data.categories[0]}).key
						locals.data.carousel.push(data)
					}
			})
			console.log(locals.data.carousel);
			locals.data.work = results
			next(err)
		})
	})


	// Render the view
	view.render('index')
};
