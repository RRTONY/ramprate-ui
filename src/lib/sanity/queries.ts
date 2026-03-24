import {groq} from 'next-sanity'

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    companyName,
    tagline,
    logo,
    bCorpBadge,
    navigation,
    footerText,
    address,
    phone,
    email,
    socialLinks,
    googleAnalyticsId,
    companyValues,
    timeline,
    corporateFacts
  }
`

// Pages
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    slug,
    pageBuilder[]{
      _type,
      _key,
      ...,
      _type == "logoBar" => {
        heading,
        logos[]->{name, logo, url}
      },
      _type == "teamGrid" => {
        heading,
        members[]->{name, slug, role, photo, linkedin}
      },
      _type == "testimonialGrid" => {
        heading,
        testimonials[]->{_id, quote, personName, role, company, companyLogo, photo}
      }
    },
    seo
  }
`

// Blog Posts (excludes thinking section)
export const postsQuery = groq`
  *[_type == "post" && section != "thinking"] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    categories[]->{title, slug}
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage{..., asset->},
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    author->{name, slug, role, photo},
    categories[]->{title, slug},
    seo
  }
`

export const postCountQuery = groq`count(*[_type == "post" && section != "thinking"])`

// Thinking Posts
export const thinkingPostsQuery = groq`
  *[_type == "post" && section == "thinking"] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    categories[]->{title, slug}
  }
`

export const thinkingPostCountQuery = groq`count(*[_type == "post" && section == "thinking"])`

// Categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    slug
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && section != "thinking" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    categories[]->{title, slug}
  }
`

export const postCountByCategoryQuery = groq`
  count(*[_type == "post" && section != "thinking" && $categorySlug in categories[]->slug.current])
`

// Team Members
export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc){
    _id,
    name,
    slug,
    role,
    "bio": pt::text(bio),
    photo,
    email,
    linkedin,
    twitter
  }
`

// Testimonials
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc){
    _id,
    personName,
    role,
    company,
    quote,
    tag,
    tier,
    linkedin,
    twitter,
    "companyLogoUrl": companyLogo.asset->url,
    "photoUrl": photo.asset->url
  }
`

// Board Advisors
export const boardAdvisorsQuery = groq`
  *[_type == "boardAdvisor"] | order(order asc){
    _id,
    name,
    role,
    bio,
    whyAdvise,
    linkedin,
    twitter,
    "photoUrl": photo.asset->url
  }
`

// Case Studies
export const caseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(order asc){
    _id,
    title,
    result,
    desc,
    metrics
  }
`

// Confidential Testimonials
export const confidentialTestimonialsQuery = groq`
  *[_type == "confidentialTestimonial"] | order(order asc){
    _id,
    quote,
    attribution,
    division
  }
`

// Client Logos
export const clientLogosQuery = groq`
  *[_type == "clientLogo"] | order(order asc){
    _id,
    name,
    url,
    "logoUrl": logo.asset->url
  }
`

// All thinking posts (no pagination — archive view)
export const allThinkingPostsQuery = groq`
  *[_type == "post" && section == "thinking"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  }
`

// All slugs (for static generation)
export const allPageSlugsQuery = groq`*[_type == "page" && defined(slug.current)]{slug}`
export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)]{slug}`
export const allCategorySlugsQuery = groq`*[_type == "category" && defined(slug.current)]{slug}`
