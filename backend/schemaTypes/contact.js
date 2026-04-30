import { UsersIcon } from "@sanity/icons";
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
			name: 'clientLines',
			title: 'Clients',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'line',
					icon: UsersIcon,
					title: 'Line',
					fields: [
						{
							name: 'clients',
							title: 'Clients in this line',
							type: 'array',
							of: [{
								type: 'reference',
								to: [{ type: 'client' }]
							}],
							validation: Rule => Rule.required().min(8).max(14)
						}
					],
					preview: {
						select: {
							clients: 'clients'
						},
						prepare({ clients }) {
							return {
								title: clients && clients.length > 0 
									? `Line with ${clients.length} clients` 
									: 'Empty Line'
							}
						}
					}
				}
			]
		}
	],
};