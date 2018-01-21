const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');
const _ = require('lodash');
const moment = require('moment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.data = {
		meta: {
			title: 'Contact Us | CTVC',
			description: 'CTVC is an independent production company producing content that raises important ethical and moral issues, from the perspective of those of “all faiths and none”, for mainstream television and radio broadcasters.',
			image: '',
			url: 'http://www.ctvc.co.uk',
		},
	};

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Media').model.find();

		q.exec(function (err, results) {
			locals.data.partners = _.filter(results, { showInFooter: true });
			locals.data.showreel = _.find(results, { key: 'showreel' }).videoEmbed;

			next(err);
		});
	});

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	if (req.params.enquiry === 'facilities') {
		_.each(locals.enquiryTypes, enquiryType => {
			if (enquiryType.value === 'facilities') {
				enquiryType.selected = 'selected';
			}
		});
	} else {
		_.each(locals.enquiryTypes, enquiryType => {
			enquiryType.selected = null;
		});
	}

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact');
};
