import { TextIcon, ImageIcon, InlineIcon,InlineElementIcon } from '@sanity/icons'
import { media } from "./fields/media";

const marginTopField = {
	name: 'marginTop',
	type: 'string',
	options: {
		list: [
			{ title: 'Zero', value: 'zero' },
			{ title: 'XSmall', value: 'xs' },
			{ title: 'Small', value: 's' },
			{ title: 'Medium', value: 'm' },
			{ title: 'Large', value: 'l' },
			{ title: 'XLarge', value: 'xl' },
			{ title: 'XXLarge', value: 'xxl' },
		],
	},
	initialValue: 'l'
}

const gutter = {
	name: 'gutter',
	type: 'string',
	options: {
		list: [
			{ title: 'Zero', value: 'zero' },
			{ title: 'XSmall', value: 'xs' },
			{ title: 'Small', value: 's' },
			{ title: 'Medium', value: 'm' },
			{ title: 'Large', value: 'l' },
			{ title: 'XLarge', value: 'xl' },
			{ title: 'XXLarge', value: 'xxl' },
		],
	},
	initialValue: 's',
	hidden: ({ parent }) =>
		!parent?.items || parent.items.length <= 1,
}

export const mediaText = {
	name: 'mediaText',
	title: 'Text',
	icon: TextIcon,
	type: 'object',
	fields: [
		{
			name: 'text',
			type: 'array', 
			of: [{
				type: 'block',
				styles: [
					{ title: 'Normal', value: 'normal' }
				],
				marks: {
					// decorators: [],
					annotations: [
						{
							name: 'link',
							type: 'object',
							fields: [
								{
									name: 'url',
									type: 'string', // Change to string to allow custom validation
									validation: Rule =>
										Rule.custom(href => {
											if (!href) return true; // Allow empty field
											return /^(https?:\/\/|mailto:|tel:)/.test(href)
												? true
												: 'Must be a valid URL, mailto:, or tel: link';
										}),
								},
								{
									title: 'Open in new tab',
									name: 'blank',
									type: 'boolean',
								},
							],
						},
					]
				},
				lists: [],
			}],
		},
		{
				name: 'alignment',
				type: 'string',
				options: {
					list: ['left', 'right'],
				},
				initialValue: 'right'
		},
		marginTopField,
	],
	preview: {
		select: {
			title: 'text'
		},
	}
}

export const mediaFull = {
	name: 'mediaFull',
	title: 'Full width',
	icon: ImageIcon,
	type: 'object',
	fields: [
		{
			name: 'items',
			type: 'array',
			of: [
				media('media')
			],
			validation: Rule => Rule.required(),
		},
		marginTopField
	],
	preview: {
		select: {
			items: 'items',
		},
		prepare({ items }) {
			const item = items[0]
			let media = null
			
			switch (item.type) {
				case 'image':
					media = item.image
					break
				case 'gif':
					media = item.gifFrames?.[0]
					break
				case 'video':
					media = item.videoCover
					break
			}

			return {
				title: `Full width (${items.length})`,
				media: media
			};
		}
		
	}
}

export const mediaGrid = {
	name: 'mediaGrid',
	title: 'Grid',
	icon: InlineIcon,
	type: 'object',
	fields: [
		{
			name: 'items',
			type: 'array',
			of: [
				media('media')
			]
		},
		gutter,
		{
				name: 'alignment',
				type: 'string',
				options: {
					list: ['left', 'center', 'right'],
				},
				initialValue: 'right',
				hidden: ({ parent }) =>
					!parent?.items || parent.items.length > 1,
		},
		marginTopField
	],
	preview: {
		select: {
			items: 'items',
		},
		prepare({ items }) {
			const item = items[0]
			let media = null
			
			switch (item.type) {
				case 'image':
					media = item.image
					break
				case 'gif':
					media = item.gifFrames?.[0]
					break
				case 'video':
					media = item.videoCover
					break
			}

			return {
				title: `Grid (${items.length})`,
				media: media
			};
		}
		
	}
}

export const mediaCentered = {
	name: 'mediaCentered',
	icon: InlineElementIcon,
	title: 'Centered',
	type: 'object',
	fields: [
		{
			name: 'items',
			type: 'array',
			of: [
				media('media', true)
			]
		},
		marginTopField
	],
	preview: {
		select: {
			items: 'items',
		},
		prepare({ items }) {
			const item = items[0]
			let media = null
			
			switch (item.type) {
				case 'image':
					media = item.image
					break
				case 'gif':
					media = item.gifFrames?.[0]
					break
				case 'video':
					media = item.videoCover
					break
			}

			return {
				title: `Centered (${items.length})`,
				media: media
			};
		}
		
	}
}