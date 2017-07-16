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
		meta: {
			title: "| CTVC",
			description: "CTVC is an independent production company producing content that raises important ethical and moral issues, from the perspective of those of “all faiths and none”, for mainstream television and radio broadcasters.",
			image: "",
			url: "http://www.ctvc.co.uk"
		}
	}

	locals.media = []
	locals.awards = []
	locals.section = 'item'


		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Media').model.find()
			q.exec(function (err, results) {
				locals.media = results
				locals.data.partners = _.filter(results, {showInFooter: true});

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
				})
				locals.awards = results
				next(err)
			})
		})

	// Load the current item
	view.on('init', function (next) {
		var q = keystone.list('Work').model.findOne({
			state: 'published',
			slug: locals.filters.item,
		}).populate('author workType media broadcastDetails.logo inAssociationWith.logo').lean()

		q.exec(function (err, result) {
			locals.data.meta.title = result.title + ' ' + locals.data.meta.title
			locals.data.meta.description = result.content.brief
			locals.data.meta.image = result.thumbnail.url
			result.carousel = []
			result.awards = _.filter(locals.awards, {work: result._id})
			if(result.inAssociationWith.length === 1 && result.inAssociationWith[0].type === 'text' && result.inAssociationWith[0].text === '')  {
				delete result.inAssociationWith
			}
			if(result.producedBy.length === 1 && result.producedBy[0].type === 'text' && result.producedBy[0].text === '')  {
				delete result.producedBy
			}
			if (result.images) {
				_.each(result.images, (image, index) => {
					if (index === 0 && result.video) {
						image.showVideoControl = true
					}
					result.carousel.push(image)
				})
			}
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
