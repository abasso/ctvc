var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Work = new keystone.List('Work', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Work.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	carousel: { type: Types.Boolean },
	class: {type: String},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	broadcastDate: { type: Types.Date },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'WorkCategory', many: true },
});

Work.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});
//
// Work.schema.pre('save', function(next) {
// 		console.log('pre save', this);
//     next();
// });

Work.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Work.register();
