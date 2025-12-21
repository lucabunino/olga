import { media } from "./fields/media";

export default {
	name: 'studio',
	type: 'document',
	fields: [
		{
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
			hidden: true,
		},
		{
			name: 'slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
			hidden: true,
		},
		{
			name: 'poem',
			type: 'array', 
			of: [{
				type: 'block',
				styles: [
					{ title: 'Normal', value: 'normal' }
				],
				marks: {
					decorators: [],
					annotations: []
				},
				lists: [],
			}],
		},
		{
			name: 'location',
			type: 'text',
			rows: 3,
		},
		{
			name: 'bio',
			type: 'array', 
			of: [{type: 'block'}],
		},
		media("image"),
		{
			name: 'related',
			type: 'array', 
			of: [{
				type: 'reference',
				to: [{ type: 'project' }],
			}],
		},
	],
};