const keystone = require('keystone')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// Init locals
	locals.section = 'people'


  locals.filters = {
		type: req.path.split("/")[1],
    page: req.params.page,
	}

	locals.data = {
    people: [],
		meta: {
			title: "People | CTVC",
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
			locals.data.partners = _.filter(results, {showInFooter: true});
			next(err)
		})

	})

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('People').model.find({
      state: 'published',
    }).populate('image').lean()

		q.exec(function (err, results) {
      console.log(err);
      locals.data.people = results
			next(err)
		})
  });

	// Render the view
	view.render('people')
}
