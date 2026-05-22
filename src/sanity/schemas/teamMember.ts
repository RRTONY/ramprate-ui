import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'twitter', title: 'Twitter URL', type: 'url'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
