export async function GET() {
	const pages = [
		{ path: '', priority: 1.0 },
		{ path: 'festival', priority: 0.8 },
		{ path: 'festival/regolamento', priority: 0.6 },
		{ path: 'about', priority: 0.8 },
		{ path: 'partner', priority: 0.8 },
		{ path: 'partner/sponsor', priority: 0.6 },
		{ path: 'sostienici', priority: 0.8 },
		{ path: 'contatti', priority: 0.8 },
		{ path: 'privacy', priority: 0.5 },
		{ path: 'cookies', priority: 0.5 }
	];

	const base = 'https://modenafilmfestival.it';
	const body = `
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${pages.map(
		({ path, priority }) => `
			<url>
				<loc>${base}/${path}</loc>
				<priority>${priority}</priority>
			</url>
		`)
		.join('')}
		</urlset>`.trim();

	return new Response(body, {
		headers: {
		'Content-Type': 'application/xml'
		}
	});
}