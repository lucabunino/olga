import { HeartIcon } from "@sanity/icons";


export default {
	name: 'info',
	type: 'document',
	fieldsets: [{ name: 'adress'}],
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
			name: 'adressLabel',
			title: 'Label',
			type: 'text',
			rows: 2,
			fieldset: 'adress',
		},
		{
			name: 'adressCountry',
			title: 'Country',
			type: 'string',
			fieldset: 'adress',
		},
		{
			name: 'adressHref',
			title: 'Href',
			type: 'url',
			fieldset: 'adress',
		},
		{
			name: 'email',
			type: 'email',
		},
		{
			name: 'vat',
			type: 'string',
		},
		{
			name: 'socials',
			type: 'array',
			of: [{
				title: 'social',
				type: 'object',
				icon: HeartIcon,
				fields: [
					{
						name: 'socialLabel',
						type: 'string',
					},
					{
						name: 'socialHref',
						type: 'string',
					},
				]
			}]
		},
	],
};