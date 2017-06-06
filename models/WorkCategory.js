var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkCategory Model
 * ==================
 */

var WorkCategory = new keystone.List('WorkCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

WorkCategory.add({
	colour: { type: Types.Color },
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	image: { type: Types.CloudinaryImage },
	name: { type: String, required: true },
	order: { type: Types.Select, numeric: true, options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }, { value: 3, label: 'Three' }, { value: 4, label: 'Four' } ] }
});

WorkCategory.relationship({ ref: 'Work', path: 'works', refPath: 'categories' });
WorkCategory.relationship({ ref: 'Award', path: 'awards', refPath: 'categories' });

WorkCategory.register();
