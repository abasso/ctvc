const keystone = require('keystone')
const _ = require('lodash')

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

	locals.section = 'item'


	// Load the current post
	view.on('init', function (next) {
		var q = keystone.list('Work').model.findOne({
			state: 'published',
			slug: locals.filters.item,
		}).populate('author categories logos').lean()

		q.exec(function (err, result) {
			result.carousel = []
			// Add the video into the carousel if there is one
			// if (result.video) {
			// 	result.video.resource_type = "video"
			// 	result.video.video = true
			// 	result.carousel.push(result.video)
			// }
			// Add the images to the carousel if there are more than one
			if (result.images) {
				_.each(result.images, (image, index) => {
					if(index === 0 && result.video) {
						image.showVideoControl = true
					}
					result.carousel.push(image)
				})
			}
			// _.each(result.carousel, (carouselItem) => {
			// 	console.log("---------------------")
			// 	console.log(carouselItem);
			// })
			locals.data.item = result
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
