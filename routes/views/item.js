var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'work';
	locals.filters = {
		item: req.params.item,
	};
	locals.data = {
		items: [],
	};

	// Load the current post
	view.on('init', function (next) {
		console.log(locals.filters.item);

		var q = keystone.list('Work').model.findOne({
			state: 'published',
			slug: locals.filters.item,
		}).populate('author categories');

		q.exec(function (err, result) {
			console.log(err)
			console.log(result)
			locals.data.item = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Work').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			console.log(results);
			locals.data.items = results;
			next(err);
		});

	});

	// Render the view
	view.render('item');
};
