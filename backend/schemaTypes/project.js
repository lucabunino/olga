import { orderRankField } from '@sanity/orderable-document-list'
import { SquareIcon } from "@sanity/icons";
import { mediaText, mediaFull, mediaGrid, mediaCentered } from "./blocks";
import { media } from "./fields/media";
import { status } from './fields/status';
import seoFields from './fields/seo';

export default {
	name: 'project',
	type: 'document',
	icon: SquareIcon,
	groups: [
		{name: 'Basics'},
		{name: 'SEO'},
	],
	fields: [
		orderRankField({ type: "project" }),
		{
			name: 'title',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'subtitle',
			type: 'string',
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
		status,
		{
			name: 'date',
			type: 'date',
			validation: Rule => Rule.required(),
		},
		{
			name: 'client',
			type: 'reference',
			to: [{ type: 'client' }],
		},
		{
			name: 'category',
			type: 'reference',
			to: [{ type: 'category' }],
		},
		{
			name: 'categories',
			type: 'array', 
			of: [{
				type: 'reference',
				to: [{ type: 'category' }],
			}],
			validation: Rule => Rule.required(),
		},
		media("cover"),
		media("opening"),
		media("wide"),
		{
			name: 'media',
			type: 'array',
			of: [
				mediaText,
				mediaFull,
				mediaGrid,
				mediaCentered,
			],
			options: {
				layout: 'list',
			},
		},
		{
			name: 'related',
			type: 'array', 
			of: [{
				type: 'reference',
				to: [{ type: 'project' }],
			}],
		},
		...seoFields(),
	],

	preview: {
		select: {
			title: 'title',
			date: 'date',
			client: 'client.title',
			category: 'category.title',

			coverType: 'cover.type',
			image: 'cover.image',
			gif: 'cover.gifFrames[0]',
			videoCover: 'cover.videoCover',
		},

		prepare({ title, date, client, category, coverType, image, gif, videoCover }) {
			const year = date ? String(date).slice(0, 4) : null;
			const subtitleParts = [ year, client, category, ].filter(Boolean);

			let media = null;
			if (coverType === 'image') media = image;
			if (coverType === 'gif') media = gif;
			if (coverType === 'video') media = videoCover;

			return {
			title,
			subtitle: subtitleParts.join(', ') || 'No details',
			media,
			};
		}
	},
};