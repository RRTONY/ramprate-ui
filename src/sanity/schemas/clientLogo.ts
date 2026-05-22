import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'clientLogo',
  title: 'Client Logo',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'url', title: 'Website URL', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
