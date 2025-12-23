import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
	throw new Error('Did you forget to run sanity init --env?');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	useCdn: false, // `false` if you want to ensure fresh data
	apiVersion: '2025-12-04', // date of setup
});

const media = `
    type,
    customWidth,
    image {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    imageMobile {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    gifFrames[] {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    gifFramesMobile[] {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    gifInterval,
    video {
        asset-> { url }
    },
    videoMobile {
        asset-> { url }
    },
    videoCover {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    videoCoverMobile {
        asset->{
            _ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
        },
    },
    "info": asset->{
        title, description, altText, metadata {dimensions, lqip}
    }
`;

export async function getSEO() {
	return await client.fetch(
		`*[_type == "seo" && !(_id in path('drafts.**'))] {
			SEOTitle,
			SEODescription,
			SEOKeywords,
			SEOImage,
		}|order(year desc)`
	);
}
export async function getInfo() {
	return await client.fetch(
		`
		*[_type == "info" && !(_id in path('drafts.**'))][0] {
			...,
		}
		`
	);
}
export async function getPolicies() {
	return await client.fetch(
		`
		*[_type == "policy" && !(_id in path('drafts.**'))] {
			...,
		}
		`
	);
}
export async function getHomepage() {
	return await client.fetch(
		`*[_type == "homepage" && !(_id in path('drafts.**'))][0] {
			marquee,
			marqueeHref,
			marqueeExternal,
			images[] {
				cover {
					asset->{
						_ref, _id, _type, title, description, altText, metadata {dimensions, lqip}
					},
				},
				size,
				positionX,
				positionY,	
				project->{slug}
			}
		}`
	);
}
export async function getPortfolio() {
	return await client.fetch(
		`*[_type == "project" && status == "public" && !(_id in path('drafts.**'))] {
			title,
			subtitle,
			slug,
			date,
			client->{title},
			categories[]->{title, slug},
			cover {
				${media}
			},
		}|order(date desc)`
	);
}
export async function getPortfolioCategories() {
	return await client.fetch(
		`
		*[_type == "category" &&
			count(
				*[
					_type == "project" &&
					status == "public" &&
					references(^._id)
				]
			) > 0
		] | order(title asc) {
			title,
			slug
		}
		`
	);
}
export async function getProject(slug) {
	return await client.fetch(`
		*[_type == "project" && slug.current == $slug] {
			title,
			subtitle,
			date,
			wide {
				${media}
			},
			media[] {
				...,
				items[] {
					${media}
				}
			},
			categories->{
				title,
			},
			client->{
				title,
			},
			related[]->{
				title,
				slug,
				cover {
					${media}
				}
			}
		}`, { slug });
}
export async function getStudio() {
	return await client.fetch(
		`*[_type == "studio" && !(_id in path('drafts.**'))][0] {
			...,
			image {
				${media}
			},
			related[]->{
				title,
				slug,
				cover {
					${media}
				}
			}
		}`
	);
}
export async function getClients() {
	return await client.fetch(
		`*[_type == "client" && !(_id in path('drafts.**'))][0] {
			...,
		}`
	);
}
export async function getCategories() {
	return await client.fetch(
		`*[_type == "category" && !(_id in path('drafts.**'))][0] {
			title
		}`
	);
}
export async function getContact() {
	return await client.fetch(
		`*[_type == "contact" && !(_id in path('drafts.**'))][0] {
			...,
			services[]-> {
				title
			},
			clients[]-> {
				title
			}
		}`
	);
}










// export async function getProjects() {
// 	return await client.fetch(
// 		`
// 		*[_type == "homepage" && !(_id in path('drafts.**'))][0].projects[] {
// 			video {
// 				mp4 {
// 					asset-> {url}
// 				},
// 				cover {
// 					asset {
// 						_ref, _id, _type
// 					},
// 					"info": asset->{
// 						title, description, altText, metadata {dimensions, lqip}
// 					},
// 				},
// 			},
// 			desktop {
// 				asset {
// 					_ref, _id, _type
// 				},
// 				"info": asset->{
// 					title, description, altText, metadata {dimensions, lqip}
// 				},
// 			},
// 			mobile {
// 				asset {
// 					_ref, _id, _type
// 				},
// 				"info": asset->{
// 					title, description, altText, metadata {dimensions, lqip}
// 				},
// 			},
// 			reference->{
// 				_type,
// 				title,
// 				slug,
// 				description,
// 				media[] {
// 				mp4 {
// 					asset-> {url}
// 				},
// 				cover {
// 					type,
// 					image {
// 						asset {
// 							_ref, _id, _type
// 						},
// 						"info": asset->{
// 							title, description, altText, metadata {dimensions, lqip}
// 						},
// 					}
// 				},
// 			},
// 			},
// 		}
// 		`
// 	);
// }


export async function getWorks() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			...,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			tags[]->{title, slug, colour, orderRank}
		}
		`
	);
}
export async function getTags() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**'))]|order(orderRank) {
			tags[]->{title, slug, colour, orderRank}
		}
		`
	);
}
export async function getWork(slug) {
	return await client.fetch(
		`
		*[_type == "work" && slug.current == $slug] {
			slug,
			title,
			description,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			tags[]->{title},
			orderRank,
			"prev": *[_type == "work" && orderRank < ^.orderRank] | order(orderRank desc)[0] { title, slug, media[] {type} },
      "next": *[_type == "work" && orderRank > ^.orderRank] | order(orderRank asc)[0] { title, slug }
		}
		`, { slug });
}
export async function getWorkIndexes() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}
export async function getThings() {
	return await client.fetch(
		`
		*[_type == "thing" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			...,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			tags[]->{title}
		}
		`
	);
}
export async function getThing(slug) {
	return await client.fetch(
		`
		*[_type == "thing" && slug.current == $slug] {
			priceInfo,
			linkExternalUrl,
			externalUrl,
			showShipping,
			slug,
			title,
			description,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
				
			},
			tags[]->{title},
			moreInfo,
			orderRank,
			"prev": *[_type == "thing" && orderRank < ^.orderRank] | order(orderRank desc)[0] { title, slug, media[] {type} },
      		"next": *[_type == "thing" && orderRank > ^.orderRank] | order(orderRank asc)[0] { title, slug }
		}
		`, { slug });
}
export async function getThingIndexes() {
	return await client.fetch(
		`
		*[_type == "thing" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}