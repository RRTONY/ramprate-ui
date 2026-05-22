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
  ],
  preview: {select: {title: 'companyName'}},
})
