import { UserIcon } from "@sanity/icons";

export default {
	name: 'client',
	type: 'document',
	icon: UserIcon,
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