const keystone = require('keystone');
const async = require('async');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const request = require('request');

var download = function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		if (_.isUndefined(res)) return;
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'work';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		work: [],
		categories: [],
		years: [],
		meta: {
			title: 'Our Work | CTVC',
			description: 'CTVC is an independent production company producing content that raises important ethical and moral issues, from the perspective of those of “all faiths and none”, for mainstream television and radio broadcasters.',
			image: '',
			url: 'http://www.ctvc.co.uk',
		},

	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('WorkCategory').model.find().sort('name').exec(function (err, results) {
			// _.each(results, (result) => {
			// 	if(result.image) {
			// 		result.image.url = result.image.url.replace("keystone-demo", "dc8wwqxzk");
			// 		result.image.secure_url = result.image.secure_url.replace("keystone-demo", "dc8wwqxzk");
			// 		// download(result.image.url, __dirname + '/images/' + result.image.public_id + '.' + result.image.format, function(){
			// 		// 	console.log('done')
			// 		// })
			// 		result.save();
			// 	}
			// });
			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = _.sortBy(results, 'order');

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Work').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find();

		q.exec(function (err, results) {
			_.each(results, (result) => {
				// if(result.image) {
				// 	// download(result.image.url, __dirname + '/images/' + result.image.public_id + '.' + result.image.format, function(){
				// 	// 	console.log('done')
				// 	// })
				// 	if (_.isUndefined(result.image.url)) return;
				// 	result.image.secure_url = result.image.secure_url.replace("keystone-demo", "dc8wwqxzk");
				// 	result.image.url = result.image.url.replace("keystone-demo", "dc8wwqxzk");
				// }
				// result.save();
			});
			locals.data.partners = _.filter(results, { showInFooter: true });
			let showreel = _.find(results, { key: 'showreel' }).videoEmbed;
			locals.data.showreel = showreel.split('\n').join('');

			next(err);
		});

	});

	// Load the work
	view.on('init', function (next) {

		var q = keystone.list('Work').paginate({
			page: req.query.page || 1,
			perPage: 100,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-broadcastDate')
			.populate('author workType images thumb');

		if (locals.data.category) {
			q.where('workType').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			// _.each(results.results, (result) => {
			// 	_.each(results.results, (result) => {
			// 		_.each(result.images, (image) => {
			// 			// download(image.url, __dirname + '/images/' + image.public_id + '.' + image.format, function(){
			// 			// 	console.log('done')
			// 			// })
			// 			//image.url = image.url.replace("keystone-demo", "dc8wwqxzk");
			// 			//image.secure_url = image.secure_url.replace("keystone-demo", "dc8wwqxzk");
			// 			console.log(image.url);
			// 		})
			// 		// download(result.thumbnail.url, __dirname + '/images/' + result.thumbnail.public_id + '.' + result.thumbnail.format, function(){
			// 		// 	console.log('done')
			// 		// })
			// 		console.log(result.thumbnail.url);
			//
			// 		result.thumbnail.url = result.thumbnail.url.replace("keystone-demo", "dc8wwqxzk");
			// 		result.thumbnail.secure_url = result.thumbnail.secure_url.replace("keystone-demo", "dc8wwqxzk");
			// 		result.save();
			//
			// 	})
			// })

			let archiveThreshold = moment().subtract(1, 'years').year();
			let yearsObject = {};
			_.each(results.results, (data) => {
				if (_.isUndefined(data.broadcastDate)) {
					return;
				}
				let broadCastDate = moment(data.broadcastDate);
				data.shortBroadcastDate = broadCastDate.format('MMMM YYYY');
				data.broadCastYear = broadCastDate.format('YYYY');
				if (data.broadCastYear < archiveThreshold)
					{ data.broadCastYear = 'Older'; }
				if (_.isUndefined(_.find(locals.data.years, data.broadCastYear))) {
					locals.data.years.push(data.broadCastYear);
				}
			});
			locals.data.years = _.sortBy(_.uniq(locals.data.years));
			locals.data.years.splice(2, 1);
			// locals.data.years.splice(0, 0, "Older")
			locals.data.years = locals.data.years.reverse();
			locals.data.years.push(locals.data.years[0]);
			locals.data.years.splice(0, 1);
			locals.data.work = results;
			next(err);
		});
	});

	// Render the view
	view.render('work');
};
