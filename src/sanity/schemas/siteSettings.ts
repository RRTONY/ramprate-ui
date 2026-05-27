import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'companyName', title: 'Company Name', type: 'string'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'bCorpBadge', title: 'B Corp Badge', type: 'image'}),
    defineField({name: 'footerText', title: 'Footer Text', type: 'text'}),
    defineField({name: 'address', title: 'Address', type: 'text'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'googleAnalyticsId', title: 'Google Analytics ID', type: 'string'}),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'URL / Path', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        },
      ],
    }),
    defineField({
      name: 'companyValues',
      title: 'Company Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Company Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'year', title: 'Year', type: 'string'}),
            defineField({name: 'event', title: 'Event', type: 'text'}),
          ],
          preview: {select: {title: 'year', subtitle: 'event'}},
        },
      ],
    }),
    defineField({
      name: 'corporateFacts',
      title: 'Corporate Facts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        },
      ],
    }),
  ],
  preview: {select: {title: 'companyName'}},
})
