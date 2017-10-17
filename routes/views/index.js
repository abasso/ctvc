const keystone = require('keystone');
const _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'homepage';

	locals.data = {
		partners: [],
		work: [],
		categories: [],
		carousel: [],
		copy: {},
		showreel: '',
		meta: {
			title: 'Using media to educate, challenge and inspire since 1978 | CTVC',
			description: 'CTVC is an independent production company producing content that raises important ethical and moral issues, from the perspective of those of “all faiths and none”, for mainstream television and radio broadcasters.',
			image: '',
			url: 'http://www.ctvc.co.uk',
		},
	};


	// Load the current category filter
	view.on('init', function (next) {

		keystone.list('WorkCategory').model.find({}).exec(function (err, result) {
			console.log(result);
			_.each(result, workCategory => {
				if (workCategory.key !== 'hillside') {
					workCategory.slug = '/work/' + workCategory.key;
				} else {
					workCategory.slug = workCategory.key;
				}
			});
			locals.data.categories = _.sortBy(result, 'order');
			next(err);
		});
	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find();

		q.exec(function (err, results) {
			let showreel = _.find(results, { key: 'showreel' }).videoEmbed;
			locals.data.showreel = showreel.split('\n').join('');

			locals.data.partners = _.filter(results, { showInFooter: true });
			next(err);
		});

	});

	view.on('init', function (next) {
		var q = keystone.list('Carousel').model.find({}).populate('work page').lean();
		q.exec(function (err, results) {
			_.each(results, (result) => {
				if (result.work) {
					result.work.workType = _.find(locals.data.categories, { _id: result.work.workType });
						// if(result.title) result.work.title = result.title
						// if(result.image) result.work.images[0] = result.image
				}
			});
			results = _.sortBy(results, 'sortOrder');
			locals.data.carousel = results;
			next(err);
		});
	});

	view.on('init', function (next) {
		keystone.list('Page').model.find({}).exec(function (err, result) {
			locals.data.copy = _.find(result, { slug: 'homepage' });
			next(err);
		});
	});
	view.on('init', function (next) {
		var q = keystone.list('Work').model.find({}).sort('-publishedDate').populate('workType').lean();

		q.exec(function (err, results) {
			locals.data.work = _.take(results, 3);
			next(err);
		});
	});


	// Render the view
	view.render('index');
};
