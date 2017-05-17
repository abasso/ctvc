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
	carouselPosition: { type: Types.Select, numeric: true, options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }, { value: 3, label: 'Three' }, { value: 4, label: 'Four' } ], dependsOn: { carousel: true} },
	class: {type: String},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	broadcastDate: { type: Types.Date },
	thumbnail: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
		quote: {type: Types.Html, wysiwyg: true, height: 150},
		broadcastDetails: {type: Types.Html, wysiwyg: true, height: 150},
		producedBy: {type: Types.Html, wysiwyg: true, height: 150},
		inAssociationWith: {type: Types.Html, wysiwyg: true, height: 150},
		press: {type: Types.Html, wysiwyg: true, height: 150},
		credits: {type: Types.Html, wysiwyg: true, height: 150}
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
