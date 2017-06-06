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
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	broadcastDate: { type: Types.Date },
	thumbnail: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
	video: { type: Types.Url},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
		quote: {type: Types.Html, wysiwyg: true, height: 150},
	},
	categories: { type: Types.Relationship, ref: 'WorkCategory', many: true },
	logos: { type: Types.Relationship, ref: 'Logo', many: true },
	press: {
		type: Types.List, fields: {
		label: {type: String},
		showLabel: { type: Types.Boolean, default: true },
		type: {type: Types.Select, options: 'text, link' },
		text: {type: String},
		// html: {type: Types.Html, wysiwyg: true, height: 30, dependsOn: { type: 'html' }},
		link: {type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
	}},
	credits: {
		type: Types.List, fields: {
		label: {type: String},
		showLabel: { type: Types.Boolean, default: true },
		type: {type: Types.Select, options: 'text, link' },
		text: {type: String},
		// html: {type: Types.Html, wysiwyg: true, height: 30, dependsOn: { type: 'html' }},
		link: {type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
	}},
	broadcastDetails: {
		type: Types.List, fields: {
		label: {type: String},
		showLabel: { type: Types.Boolean, default: true },
		type: {type: Types.Select, options: 'text, link' },
		text: {type: String},
		link: {type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
	}},
	producedBy: {
		type: Types.List, fields: {
		label: {type: String},
		showLabel: { type: Types.Boolean, default: true },
		type: {type: Types.Select, options: 'text, link' },
		text: {type: String},
		link: {type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
	}},
	inAssociationWith: {
		type: Types.List, fields: {
		label: {type: String},
		showLabel: { type: Types.Boolean, default: true },
		type: {type: Types.Select, options: 'text, link' },
		text: {type: String},
		link: {type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
	}},
});

Work.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Work.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Work.register();
