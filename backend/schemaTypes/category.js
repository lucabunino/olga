import { icons, TagIcon } from "@sanity/icons";

export default {
	name: 'category',
	type: 'document',
	icon: TagIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
		},
	],
};