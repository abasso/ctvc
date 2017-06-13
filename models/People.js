var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var People = new keystone.List('People', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	sortable:true
});

People.add({
	name: { type: String, required: true },
  position: { type: String },
  email: { type: String },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  image: { type: Types.Relationship, ref: 'Media', many: false, filter: { imageCategory: 'People' }},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
});

People.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

People.defaultColumns = 'name, position, state|20%';
People.register();
