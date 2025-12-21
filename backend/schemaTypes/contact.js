import { media } from "./fields/media";

export default {
	name: 'contact',
	type: 'document',
	fields: [
		{
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
			hidden: false,
		},
		{
			name: 'slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
			hidden: false,
		},
		{
			name: 'services',
			type: 'array', 
			of: [{
				type: 'reference',
				to: [{ type: 'category' }],
			}],
		},
		{
			name: 'clients',
			type: 'array', 
			of: [{
				type: 'reference',
				to: [{ type: 'client' }],
			}],
		},
	],
};