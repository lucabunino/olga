// export function media(name, customWidth = false) {
// 	let fields = [
// 		{
// 			name: 'type',
// 			type: 'string',
// 			options: {
// 				list: [
// 				{ title: 'Image', value: 'image' },
// 				{ title: 'GIF (multiple images)', value: 'gif' },
// 				{ title: 'Video (mp4 + cover)', value: 'video' },
// 				],
// 			},
// 			initialValue: 'image',
// 			validation: Rule => Rule.required(),
// 		},
// 		{
// 			name: 'customWidth',
// 			title: "Custom width (% of container's width)",
// 			type: 'number',
// 			hidden: () => !customWidth,
// 			validation: Rule => Rule.min(1).max(100).error('Width must be between 1 and 100'),
// 		},
// 		{
// 			name: 'image',
// 			title: 'Image',
// 			type: 'image',
// 			hidden: ({ parent }) => parent?.type !== 'image',
// 			validation: Rule =>
// 				Rule.custom((value, context) =>
// 				context.parent.type === 'image' && !value
// 					? 'Image is required'
// 					: true
// 				)
// 		},
// 		{
// 			name: 'gifFrames',
// 			title: 'GIF Frames',
// 			type: 'array',
// 			of: [{ type: 'image' }],
// 			hidden: ({ parent }) => parent?.type !== 'gif',
// 			validation: Rule =>
// 			Rule.custom((value, context) =>
// 			context.parent.type === 'gif' && (!value || value.length < 2)
// 				? 'At least 2 images are required for a GIF'
// 				: true
// 			)
// 		},
// 		{
// 			name: 'gifInterval',
// 			title: 'GIF Interval (ms)',
// 			description: 'Sets the interval between each image. If not set, default is 500ms',
// 			type: 'number',
// 			hidden: ({ parent }) => parent?.type !== 'gif',
// 		},
// 		{
// 			name: 'video',
// 			title: 'Video File (.mp4)',
// 			type: 'file',
// 			options: {
// 				accept: 'video/mp4',
// 				storeOriginalFilename: true,
// 			},
// 			hidden: ({ parent }) => parent?.type !== 'video',
// 			validation: Rule =>
// 				Rule.custom((value, context) =>
// 				context.parent.type === 'video' && !value
// 					? 'MP4 file is required'
// 					: true
// 				)
// 		},
// 		{
// 			name: 'videoCover',
// 			title: 'Video Cover Image',
// 			type: 'image',
// 			hidden: ({ parent }) => parent?.type !== 'video',
// 			validation: Rule =>
// 				Rule.custom((value, context) =>
// 				context.parent.type === 'video' && !value
// 					? 'Cover image is required'
// 					: true
// 				)
// 		},
// 	]

// 	return {
// 		name: name,
// 		type: 'object',
// 		fields,
// 	}
// }

export function media(name, customWidth = false) {
    let fields = [
        {
            name: 'type',
            type: 'string',
            options: {
                list: [
                    { title: 'Image', value: 'image' },
                    { title: 'GIF (multiple images)', value: 'gif' },
                    { title: 'Video (mp4 + cover)', value: 'video' },
                ],
            },
            initialValue: 'image',
            validation: Rule => Rule.required(),
        },
        {
            name: 'customWidth',
            title: "Custom width (% of container's width)",
            type: 'number',
            hidden: () => !customWidth,
            validation: Rule => Rule.min(1).max(100).error('Width must be between 1 and 100'),
        },
        // --- IMAGE GROUP ---
        {
            name: 'image',
            title: 'Desktop Image',
            type: 'image',
            hidden: ({ parent }) => parent?.type !== 'image',
            validation: Rule => Rule.custom((v, c) => c.parent.type === 'image' && !v ? 'Required' : true)
        },
        {
            name: 'imageMobile',
            title: 'Mobile Image (optional)',
            type: 'image',
            hidden: ({ parent }) => parent?.type !== 'image',
        },
        // --- GIF GROUP ---
		{
			name: 'gifInterval',
			title: 'GIF Interval in ms (optional)',
			description: 'Sets the interval between each image. If not set, default is 500ms',
			type: 'number',
			hidden: ({ parent }) => parent?.type !== 'gif',
		},
        {
            name: 'gifFrames',
            title: 'Desktop GIF Frames',
            type: 'array',
            of: [{ type: 'image' }],
            hidden: ({ parent }) => parent?.type !== 'gif',
            validation: Rule => Rule.custom((v, c) => c.parent.type === 'gif' && (!v || v.length < 2) ? 'At least 2 images required' : true)
        },
        {
            name: 'gifFramesMobile',
            title: 'Mobile GIF Frames (optional)',
            description: 'Vertical frames for mobile',
            type: 'array',
            of: [{ type: 'image' }],
            hidden: ({ parent }) => parent?.type !== 'gif',
        },
        // --- VIDEO GROUP ---
        {
            name: 'video',
            title: 'Desktop Video (.mp4)',
            type: 'file',
            options: { accept: 'video/mp4' },
            hidden: ({ parent }) => parent?.type !== 'video',
            validation: Rule => Rule.custom((v, c) => c.parent.type === 'video' && !v ? 'Required' : true)
        },
		{
			name: 'videoCover',
			title: 'Desktop Video Cover',
			type: 'image',
			hidden: ({ parent }) => parent?.type !== 'video',
			validation: Rule => Rule.custom((v, c) => c.parent.type === 'video' && !v ? 'Required' : true)
		},
        {
            name: 'videoMobile',
            title: 'Mobile Video (.mp4) (optional)',
            type: 'file',
            options: { accept: 'video/mp4' },
            hidden: ({ parent }) => parent?.type !== 'video',
        },
        {
            name: 'videoCoverMobile',
            title: 'Mobile Video Cover (optional)',
            type: 'image',
            hidden: ({ parent }) => parent?.type !== 'video',
        },
    ]

    return { name, type: 'object', fields }
}