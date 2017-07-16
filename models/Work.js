var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Work = new keystone.List('Work', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	sortable: true
});

Work.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	broadcastDate: { type: Types.Date },
	thumbnail: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
	useCompactLayout: {type: Boolean, default: false},
	video: { type: Types.Url},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
		quote: {type: Types.Html, wysiwyg: true, height: 150},
		quoteCredit: { type: String },
	},
	workType: { type: Types.Relationship, ref: 'WorkCategory', many: false },
	press: {
		type: Types.List, fields: {
		label: { type: String },
		showLabel: { type: Boolean, default: true },
		type: { type: Types.Select, options: 'text, link', default: 'text', },
		text: { type: String },
		// html: {type: Types.Html, wysiwyg: true, height: 30, dependsOn: { type: 'html' }},
		link: { type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: { type: Boolean, dependsOn: { type: ['link'] }},
	}},
	credits: {
		type: Types.List, fields: {
		label: { type: String},
		showLabel: { type: Boolean, default: true },
		type: { type: Types.Select, options: 'text, link', default: 'text', },
		text: { type: String },
		// html: {type: Types.Html, wysiwyg: true, height: 30, dependsOn: { type: 'html' }},
		link: { type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: { type: Boolean, dependsOn: { type: ['link'] }},
	}},
	broadcastDetails: {
		type: Types.List, fields: {
		blockType: { type: Types.Select, options: 'header, item' },
		logo: { type: Types.Relationship, ref: 'Media', many: false, dependsOn: { blockType: ['header']}},
		label: { type: String },
		showLabel: { type: Boolean, default: true, dependsOn: { blockType: ['item']}},
		type: { type: Types.Select, options: 'text, link', default: 'text', dependsOn: { blockType: ['item'] }},
		text: { type: String, dependsOn: { blockType: ['item']}},
		link: { type: Types.Url, dependsOn: { type: ['link'], blockType: ['item']  }},
		newWindow: { type: Boolean, dependsOn: { type: ['link'], blockType: ['item'] }},
	}},
	producedBy: {
		type: Types.List, fields: {
		logo: { type: Types.Relationship, ref: 'Media', many: false, dependsOn: { blockType: ['header']}},
		label: { type: String },
		showLabel: { type: Boolean, default: true },
		type: { type: Types.Select, options: 'text, link', default: 'text', },
		text: { type: String },
		link: { type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: { type: Boolean, dependsOn: { type: ['link'] }},
	}},
	inAssociationWith: {
		type: Types.List, fields: {
		logo: { type: Types.Relationship, ref: 'Media', many: false},
		label: { type: String },
		showLabel: { type: Boolean, default: true },
		type: { type: Types.Select, options: 'text, link', default: 'text', },
		text: { type: String },
		link: { type: Types.Url, dependsOn: { type: ['link'] }},
		newWindow: {type: Boolean, dependsOn: { type: ['link'] }},
		media: { type: Types.Relationship, ref: 'Media', many: true },
	}},
	awards: {
		type: Types.List, fields: {
		name: { type: String },
		description: { type: String },
		useImage: { type: Boolean, default: false },
		media: { type: Types.Relationship, ref: 'Media', many: false, dependsOn: { useImage: true }},
		link: { type: Types.Url, dependsOn: { useImage: false }},
	}},
});

Work.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Work.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%, broadcastDate|20%';
Work.register();
