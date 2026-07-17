import { HeartIcon } from "@sanity/icons";


export default {
	name: 'info',
	type: 'document',
	fieldsets: [
		{name: 'adress', title: 'Operative adress'},
		{name: 'legalAdress', title: 'Legal adress'},
	],
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
			rows: 3,
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
			name: 'legalAdressLabel',
			title: 'Label',
			type: 'text',
			rows: 3,
			fieldset: 'legalAdress',
		},
		{
			name: 'legalAdressCountry',
			title: 'Country',
			type: 'string',
			fieldset: 'legalAdress',
		},
		{
			name: 'legalAdressHref',
			title: 'Href',
			type: 'url',
			fieldset: 'legalAdress',
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
		{
			name: 'footerLoop',
			type: 'array',
			of: [{
				name: 'word',
				type: 'string',
			}]
		},
	],
};