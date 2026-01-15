import { getSeo, getInfo, getPolicies } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url, setHeaders }) {
//   setHeaders({
//     'cache-control': 'public, s-maxage=60, stale-while-revalidate=3600'
//   });

  let seo, info, policies;

  try {
    [seo, info, policies] = await Promise.all([
      getSeo(),
      getInfo(),
	  getPolicies()
    ]);
  } catch (err) {
    throw error(500, 'Failed to load page data');
  }

  if (!seo) {
    throw error(404, 'Missing SEO data');
  }

  if (!info) {
    throw error(404, 'Missing site info');
  }

  return {
    seo,
    info,
	policies,
    pathname: url.pathname
  };
}