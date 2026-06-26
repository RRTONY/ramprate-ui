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
    _updatedAt,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage{..., asset->},
    body,
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

// Categories — ordered by number of posts desc so populated categories appear first
export const categoriesQuery = groq`
  *[_type == "category"]{
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && section != "thinking" && ^._id in categories[]._ref])
  } | order(postCount desc, title asc)
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
    photo
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

// SPY Index page SEO
export const spyIndexPageQuery = groq`
  *[_type == "page" && slug.current == "spy-index"][0]{
    title,
    seo
  }
`
export const allPostSlugsQuery = groq`*[_type == "post" && defined(slug.current)]{slug, section}`
export const allCategorySlugsQuery = groq`*[_type == "category" && defined(slug.current)]{slug}`

// Full-text search across all posts (blog + thinking)
export const searchPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && (
    title match $q ||
    excerpt match $q
  )] | order(publishedAt desc)[0...30]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    section,
    categories[]->{title, slug}
  }
`

