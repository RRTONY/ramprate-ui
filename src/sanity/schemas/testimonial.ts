import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'personName', title: 'Person Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({name: 'quote', title: 'Quote', type: 'text', validation: r => r.required()}),
    defineField({name: 'tag', title: 'Tag', type: 'string'}),
    defineField({name: 'tier', title: 'Tier', type: 'string'}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'companyLogo', title: 'Company Logo', type: 'image'}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'twitter', title: 'Twitter URL', type: 'url'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'personName', subtitle: 'company'}},
})
