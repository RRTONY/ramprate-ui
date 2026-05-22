import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'pageBuilder', title: 'Page Builder', type: 'array', of: [
      {type: 'object', name: 'logoBar', title: 'Logo Bar', fields: [
        {name: 'heading', type: 'string', title: 'Heading'},
        {name: 'logos', type: 'array', title: 'Logos', of: [{type: 'reference', to: [{type: 'clientLogo'}]}]},
      ]},
      {type: 'object', name: 'teamGrid', title: 'Team Grid', fields: [
        {name: 'heading', type: 'string', title: 'Heading'},
        {name: 'members', type: 'array', title: 'Members', of: [{type: 'reference', to: [{type: 'teamMember'}]}]},
      ]},
      {type: 'object', name: 'testimonialGrid', title: 'Testimonial Grid', fields: [
        {name: 'heading', type: 'string', title: 'Heading'},
        {name: 'testimonials', type: 'array', title: 'Testimonials', of: [{type: 'reference', to: [{type: 'testimonial'}]}]},
      ]},
    ]}),
    defineField({name: 'seo', title: 'SEO', type: 'object', fields: [
      {name: 'title', type: 'string', title: 'SEO Title'},
      {name: 'description', type: 'text', title: 'SEO Description'},
    ]}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
