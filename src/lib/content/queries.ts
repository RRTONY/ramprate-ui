export type ContentQueryName =
  | "siteSettings"
  | "pageSeo"
  | "pageBySlug"
  | "posts"
  | "postBySlug"
  | "postCount"
  | "relatedPosts"
  | "recentPosts"
  | "relatedThinkingPosts"
  | "recentThinkingPosts"
  | "thinkingPosts"
  | "thinkingPostCount"
  | "categories"
  | "categoryBySlug"
  | "postsByCategory"
  | "postCountByCategory"
  | "teamMembers"
  | "testimonials"
  | "boardAdvisors"
  | "caseStudies"
  | "confidentialTestimonials"
  | "clientLogos"
  | "allThinkingPosts"
  | "spyIndexPage"
  | "allPostSlugs"
  | "allCategorySlugs"
  | "searchPosts";

export type ContentQuery = { name: ContentQueryName };

function defineContentQuery(name: ContentQueryName): ContentQuery {
  return { name };
}

export const siteSettingsQuery = defineContentQuery("siteSettings");
export const pageSeoQuery = defineContentQuery("pageSeo");
export const pageBySlugQuery = defineContentQuery("pageBySlug");
export const postsQuery = defineContentQuery("posts");
export const postBySlugQuery = defineContentQuery("postBySlug");
export const postCountQuery = defineContentQuery("postCount");
export const relatedPostsQuery = defineContentQuery("relatedPosts");
export const recentPostsQuery = defineContentQuery("recentPosts");
export const relatedThinkingPostsQuery = defineContentQuery(
  "relatedThinkingPosts",
);
export const recentThinkingPostsQuery = defineContentQuery(
  "recentThinkingPosts",
);
export const thinkingPostsQuery = defineContentQuery("thinkingPosts");
export const thinkingPostCountQuery = defineContentQuery("thinkingPostCount");
export const categoriesQuery = defineContentQuery("categories");
export const categoryBySlugQuery = defineContentQuery("categoryBySlug");
export const postsByCategoryQuery = defineContentQuery("postsByCategory");
export const postCountByCategoryQuery = defineContentQuery(
  "postCountByCategory",
);
export const teamMembersQuery = defineContentQuery("teamMembers");
export const testimonialsQuery = defineContentQuery("testimonials");
export const boardAdvisorsQuery = defineContentQuery("boardAdvisors");
export const caseStudiesQuery = defineContentQuery("caseStudies");
export const confidentialTestimonialsQuery = defineContentQuery(
  "confidentialTestimonials",
);
export const clientLogosQuery = defineContentQuery("clientLogos");
export const allThinkingPostsQuery = defineContentQuery("allThinkingPosts");
export const spyIndexPageQuery = defineContentQuery("spyIndexPage");
export const allPostSlugsQuery = defineContentQuery("allPostSlugs");
export const allCategorySlugsQuery = defineContentQuery("allCategorySlugs");
export const searchPostsQuery = defineContentQuery("searchPosts");
