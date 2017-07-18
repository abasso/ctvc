var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkCategory Model
 * ==================
 */

var Media = new keystone.List('Media', {
	autokey: { from: 'name', path: 'key', unique: true },
	singular: 'media item'
});

Media.add({
  name: { type: String, required: true },
	type: { type: Types.Select, options: 'image, video', default: 'image', index: true},
	imageCategory: { type: Types.Select, options: 'Logo, Award, People', default: 'Logo', dependsOn: {type: 'image'}},
	videoCategory: { type: Types.Select, options: 'Content, Showreel', default: 'Content', dependsOn: {type: 'video'}},
	videoType: { type: Types.Select, options: 'Local, Embed', dependsOn: {type: 'video'}},

	videoUrl: { type: String, dependsOn: {videoType: 'Local'}},
	videoEmbed: { type: Types.Html, dependsOn: {videoType: 'Embed'}},
	image: { type: Types.CloudinaryImage, dependsOn: {type: 'image'}},
  alt: { type: String, dependsOn: {type: 'image'}},
  link: { type: Types.Url, dependsOn: {type: 'image'}},
	newWindow: {type: Boolean, dependsOn: {type: 'image'}},
	showInFooter: {type: Boolean, dependsOn: {imageCategory: 'Logo'}},
});

Media.register();
