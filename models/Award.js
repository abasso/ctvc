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
	title: { type: String},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	receivedDate: { type: Types.Date },
	award: { type: Types.Relationship, ref: 'Media', many: false, filter: { imageCategory: 'Award' }},
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	work: { type: Types.Relationship, ref: 'Work', many: false },
	workType: { type: Types.Relationship, ref: 'WorkCategory', note: 'If a piece of work is referenced this will be inferred from it.' },
	links: {
		type: Types.List, fields: {
		showLabel: { type: Types.Boolean, default: true },
		label: {type: String, dependsOn: { showLabel: true }},
		// html: {type: Types.Html, wysiwyg: true, height: 30, dependsOn: { type: 'html' }},
		link: {type: Types.Url},
		newWindow: {type: Boolean},
	}},
});

Award.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Award.defaultColumns = 'title, award, work, state|20%';
Award.register();
