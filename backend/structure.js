import { EarthGlobeIcon, InfoOutlineIcon, ProjectsIcon, HomeIcon, SparklesIcon, EnvelopeIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'


export const myStructure = (S, context) => {
  const entities = [
    S.divider(),
    S.listItem()
      .title('Homepage')
      .icon(HomeIcon)
      .child(S.document().schemaType('homepage').documentId('homepage')),
    orderableDocumentListDeskItem({type: 'project', title: 'Projects', icon: ProjectsIcon, S, context}),
    S.divider(),
	S.documentTypeListItem('client').title('Clients'),
    S.documentTypeListItem('category').title('Categories'),
    // S.documentTypeListItem('area').title('Area (temp)'),
    S.divider(),
    S.listItem()
      .title('Studio')
      .icon(SparklesIcon)
      .child(S.document().schemaType('studio').documentId('studio')),
    S.listItem()
      .title('Contacts')
      .icon(EnvelopeIcon)
      .child(S.document().schemaType('contact').documentId('contact')),
  ];
  const siteSettings = [
    S.divider(),
	S.listItem()
      .title('Info')
      .icon(InfoOutlineIcon)
      .child(S.document().schemaType('info').documentId('info')),
    S.listItem()
      .title('SEO')
      .icon(EarthGlobeIcon)
      .child(S.document().schemaType('seo').documentId('seo')),
    S.documentTypeListItem('policy')
      .title('Policies'),
  ];

  return S.list()
    .title('Content')
    .items([
      ...entities,
      ...siteSettings,
    ]);
};