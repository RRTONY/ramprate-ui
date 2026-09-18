import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'reportRun',
  title: 'Traffic Report Run',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {list: ['daily', 'weekly', 'alert']},
      validation: r => r.required(),
    }),
    defineField({name: 'periodLabel', title: 'Period Label', type: 'string'}),
    defineField({name: 'generatedAt', title: 'Generated At', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'summary', title: 'Summary (email body sent)', type: 'text'}),
    defineField({
      name: 'alertsTriggered',
      title: 'Alerts Triggered',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'emailedTo', title: 'Emailed To', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'emailIds', title: 'Resend Email IDs', type: 'array', of: [{type: 'string'}]}),
    defineField({
      name: 'registeredPaths',
      title: 'Registered Paths (weekly snapshot, for new-URL diffing)',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {select: {title: 'type', subtitle: 'periodLabel'}},
})
