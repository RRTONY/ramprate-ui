import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: r => r.required()}),
    defineField({name: 'section', title: 'Section', type: 'string', options: {list: ['blog', 'thinking']}}),
    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime'}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text'}),
    defineField({name: 'mainImage', title: 'Main Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'teamMember'}]}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [{type: 'reference', to: [{type: 'category'}]}]}),
    defineField({name: 'body', title: 'Body', type: 'array', of: [{type: 'block'}, {type: 'image'}]}),
    defineField({name: 'seo', title: 'SEO', type: 'object', fields: [
      {name: 'title', type: 'string', title: 'SEO Title'},
      {name: 'description', type: 'text', title: 'SEO Description'},
    ]}),
  ],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'mainImage'}},
})
