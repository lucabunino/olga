import { HomeIcon } from '@sanity/icons';

export default {
	name: 'homepage',
	type: 'document',
	icon: HomeIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'marquee',
			type: 'array',
			description: 'Items scroll in order, separated by a dash',
			of: [
				{
					type: 'object',
					name: 'marqueeItem',
					fields: [
						{
							name: 'text',
							type: 'string',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'href',
							title: 'Href (optional)',
							type: 'string',
						},
						{
							name: 'external',
							title: 'Open in new tab',
							type: 'boolean',
							initialValue: true,
							hidden: ({ parent }) => !parent?.href,
						},
					],
					preview: {
						select: { title: 'text', subtitle: 'href' },
					},
				},
			],
		},
		{
			name: 'showLogo',
			title: 'Show Adi Design Index logo',
			type: 'boolean',
			initialValue: false,
		},
		{
			name: 'images',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'cover',
							type: 'image',
						},
						{
							name: 'size',
							type: 'number',
							description: 'Relative size to the square (0 = smallest, 1 = full square)',
							validation: (Rule) => Rule.min(0).max(1)
						},
						{
							name: 'positionX',
							type: 'number',
							description: 'Relative size to the square (0 = left, 1 = right)',
							validation: (Rule) => Rule.min(0).max(1)
						},
						{
							name: 'positionY',
							type: 'number',
							description: 'Relative size to the square (0 = bottom, 1 = top)',
							validation: (Rule) => Rule.min(0).max(1)
						},
						{
							name: 'project',
							type: 'reference',
							to: [{ type: 'project' }],
						},
					],
					preview: {
						select: {
							title: 'project.title',
							media: 'cover',
						},
						prepare({ title, media }) {
							return {
								title: title || 'No project selected',
								media,
							};
						},
					},
				}
			],
		}
	],
};