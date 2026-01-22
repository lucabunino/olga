import { media } from "./fields/media";
import { RemoveIcon, InsertBelowIcon, TextIcon, AsteriskIcon } from '@sanity/icons';

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
			of: [
				{
					name: 'line',
					type: 'object',
					icon: RemoveIcon,
					fields: [
						{
							name: 'isBlank',
							type: 'boolean',
							initialValue: false,
						},
						{
							name: 'units',
							type: 'array',
							hidden: ({ parent }) => parent?.isBlank === true,
							of: [
								{ name: 'o', type: 'object', icon: AsteriskIcon, fields: [{ name: 'text', type: 'string', initialValue: 'o', readOnly: true }] },
								{ name: 'l', type: 'object', icon: AsteriskIcon, fields: [{ name: 'text', type: 'string', initialValue: 'l', readOnly: true }] },
								{ name: 'g', type: 'object', icon: AsteriskIcon, fields: [{ name: 'text', type: 'string', initialValue: 'g', readOnly: true }] },
								{ name: 'a', type: 'object', icon: AsteriskIcon, fields: [{ name: 'text', type: 'string', initialValue: 'a', readOnly: true }] },
								{ 
									name: 'custom', 
									type: 'object', 
									icon: TextIcon,
									fields: [{ name: 'text', type: 'string', validation: Rule => Rule.required() }],
									preview: { select: { title: 'text' } } 
								},
							]
						}
					],
					preview: {
						select: { 
							isBlank: 'isBlank',
							units: 'units' 
						},
						prepare({ isBlank, units }) {
							const title = isBlank 
								? '–––– blank ––––'
								: units?.map(u => u.text || '').join('');

							return {
								title: title,
								media: isBlank ? InsertBelowIcon : RemoveIcon 
							};
						}
					}
				}
			]
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