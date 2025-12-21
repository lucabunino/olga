export default {
  name: 'seo',
  title: 'SEO',
  type: 'document',
  fieldsets: [

  ],
  fields: [
    {
      name: 'SEOTitle',
      type: 'string',
    },
    {
      name: 'SEODescription',
      type: 'text',
      rows: 5,
    },
    {
      name: 'SEOImage',
      type: 'image',
	  description: 'Reccomended size: 1200×630'
    },
  ],
}