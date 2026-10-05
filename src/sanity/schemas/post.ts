import {defineArrayMember, defineField, defineType} from 'sanity'

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
    defineField({name: 'authors', title: 'Authors', type: 'array', of: [{type: 'reference', to: [{type: 'teamMember'}]}]}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [{type: 'reference', to: [{type: 'category'}]}]}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image'},
        defineArrayMember({
          name: 'table',
          title: 'Table',
          type: 'object',
          fields: [
            defineField({name: 'caption', title: 'Caption', type: 'string', description: 'Optional. Describes the table for screen readers and shows above it.'}),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              description: 'The first row is the header row.',
              of: [
                defineArrayMember({
                  name: 'tableRow',
                  title: 'Row',
                  type: 'object',
                  fields: [defineField({name: 'cells', title: 'Cells', type: 'array', of: [{type: 'string'}]})],
                  preview: {select: {cells: 'cells'}, prepare: ({cells}) => ({title: (cells ?? []).join(' | ')})},
                }),
              ],
              validation: r => r.min(2),
            }),
          ],
          preview: {select: {caption: 'caption', rows: 'rows'}, prepare: ({caption, rows}) => ({title: caption || 'Table', subtitle: `${rows?.length ?? 0} rows`})},
        }),
        defineArrayMember({
          name: 'faq',
          title: 'FAQ accordion',
          type: 'object',
          fields: [
            defineField({
              name: 'items',
              title: 'Questions',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'faqItem',
                  title: 'Question',
                  type: 'object',
                  fields: [
                    defineField({name: 'question', title: 'Question', type: 'string', validation: r => r.required()}),
                    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: r => r.required()}),
                  ],
                  preview: {select: {title: 'question', subtitle: 'answer'}},
                }),
              ],
              validation: r => r.min(1),
            }),
          ],
          preview: {select: {items: 'items'}, prepare: ({items}) => ({title: 'FAQ accordion', subtitle: `${items?.length ?? 0} questions`})},
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'mainImage'}},
})
