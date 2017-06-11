var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Award Model
 * ==========
 */

var Carousel = new keystone.List('Carousel', {
	map: { name: 'title' },
	plural: "Carousel Items",
	singular: "Carousel Item",
	autokey: { path: 'slug', from: 'title', unique: true },
	sortable: true
});

Carousel.add({
	title: { type: String, note: 'Used to override title from content', initial:false },
	image: { type: Types.CloudinaryImage, note: 'Used to override title from content' },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
 	work: { type: Types.Relationship, ref: 'Work', many: false, initial:true },
	page: { type: Types.Relationship, ref: 'Page', many: false, initial:true },
	link: {type: Types.Url},
	newWindow: {type: Boolean},
});

Carousel.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Carousel.defaultColumns = 'work state|20%,  publishedDate|20%';
Carousel.register();
