var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Award Model
 * ==========
 */

var Award = new keystone.List('Award', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Award.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	receivedDate: { type: Types.Date },
	thumbnail: { type: Types.CloudinaryImage },
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	categories: { type: Types.Relationship, ref: 'WorkCategory', many: true },
});

Award.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Award.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Award.register();
