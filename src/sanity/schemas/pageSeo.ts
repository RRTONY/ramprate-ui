import {defineField, defineType} from 'sanity'

const ROUTES = [
  {title: 'Home (/)', value: '/'},
  {title: 'About (/about)', value: '/about'},
  {title: 'Sourcing (/sourcing)', value: '/sourcing'},
  {title: 'Syzygy Growth (/growth)', value: '/growth'},
  {title: 'Stratum Web3 (/web3)', value: '/web3'},
  {title: 'ImpactSoul (/impactsoul)', value: '/impactsoul'},
  {title: 'Private Advisory (/private-advisory)', value: '/private-advisory'},
  {title: 'Process (/process)', value: '/process'},
  {title: 'Proof (/proof)', value: '/proof'},
  {title: 'Blog Index (/blog)', value: '/blog'},
  {title: 'Thinking Index (/thinking)', value: '/thinking'},
  {title: 'Contact (/contact)', value: '/contact'},
  {title: 'Careers (/careers)', value: '/careers'},
  {title: 'Expertise (/expertise)', value: '/expertise'},
]

export default defineType({
  name: 'pageSeo',
  title: 'Page SEO',
  type: 'document',
  fields: [
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
      options: {list: ROUTES},
      validation: (r) => r.required(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'route', subtitle: 'seo.metaTitle'},
  },
})
