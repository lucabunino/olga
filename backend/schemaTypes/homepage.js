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