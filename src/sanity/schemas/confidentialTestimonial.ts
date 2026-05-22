import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'confidentialTestimonial',
  title: 'Confidential Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', validation: r => r.required()}),
    defineField({name: 'attribution', title: 'Attribution', type: 'string'}),
    defineField({name: 'division', title: 'Division', type: 'string'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'attribution', subtitle: 'division'}},
})
