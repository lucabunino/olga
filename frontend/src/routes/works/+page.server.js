import { getPortfolio, getPortfolioCategories } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const portfolio = await getPortfolio();
	const categories = await getPortfolioCategories();
	if (categories && portfolio) {
		return {
			categories,
			portfolio
		};
	}
  throw error(404, 'Not found');
}