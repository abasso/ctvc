/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Work', key: 'work', href: '/work' },
		{ label: 'Awards', key: 'awards', href: '/awards' },
		{ label: 'About', key: 'about', href: '/about' },
		{ label: 'Show Reel', key: 'show-reel', href: '/show-reel' },
		{ label: 'People', key: 'people', href: '/people' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];
	res.locals.socialLinks = [
		{ label: '', key: 'facebook', href: '/contact', class: 'social facebook' },
		{ label: '', key: 'twitter', href: '/twitter', class: 'social twitter' },
	]
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
