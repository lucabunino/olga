import { getStudio } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const studio = await getStudio();
	if (studio) {
		return {
			studio
		};
	}
  throw error(404, 'Not found');
}