var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkCategory Model
 * ==================
 */

var Logo = new keystone.List('Logo', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Logo.add({
  name: { type: String, required: true },  
  image: { type: Types.CloudinaryImage },
  alt: { type: String },
  link: { type: Types.Url },
});

Logo.relationship({ ref: 'Work', path: 'works', refPath: 'logos' });

Logo.register();
