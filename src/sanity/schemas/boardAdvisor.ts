import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'boardAdvisor',
  title: 'Board Advisor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text'}),
    defineField({name: 'whyAdvise', title: 'Why Advise', type: 'text'}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'twitter', title: 'Twitter URL', type: 'url'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
