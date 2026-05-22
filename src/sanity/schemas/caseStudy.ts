import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: r => r.required()}),
    defineField({name: 'result', title: 'Result', type: 'string'}),
    defineField({name: 'desc', title: 'Description', type: 'text'}),
    defineField({name: 'metrics', title: 'Metrics', type: 'array', of: [{type: 'object', fields: [
      {name: 'label', type: 'string', title: 'Label'},
      {name: 'value', type: 'string', title: 'Value'},
    ]}]}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'title', subtitle: 'result'}},
})
