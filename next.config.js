const withSvgr = require(`next-svgr`)
const withBundleAnalyzer = require(`@next/bundle-analyzer`)
const withPlugins = require(`next-compose-plugins`)
const rehypeShiki = require(`rehype-shiki`)
const checkEnv = require(`@47ng/check-env`).default
const withImages = require(`next-images`)
const withMDX = require(`@next/mdx`)({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: `./src/styles/material-theme-dark.json`,
          useBackground: false,
        },
      ],
    ],
  },
})

const searchUrlRoot = `/q`

checkEnv({
  required: [`NEXT_PUBLIC_DEPLOYMENT_URL`, `NEXT_PUBLIC_AUTH_DOMAIN`],
})

const appUrl = process.env.NEXT_PUBLIC_AUTH_DOMAIN

const IMAGE_HOST_DOMAINS = [
  `d2eip9sf3oo6c2.cloudfront.net`,
  `dcv19h61vib2d.cloudfront.net`,
  `image.simplecastcdn.com`,
  `res.cloudinary.com`,
  `app.egghead.io`,
  `gravatar.com`,
]

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return [
      ...teamRoutes,
      ...rssRoutes,
      ...contentCrudRoutes,
      ...apiRoutes,
      ...contentIndexRoutes,
      ...legacyRoutes,
      ...searchRoutes,
      ...instructorRoutes,
      ...learnRoutes,
    ]
  },
}

const learnRoutes = [
  {
    source: `/learn/data/egghead-content-modeling-with-santity-io`,
    destination: '/blog/content-modeling-and-data-design-with-sanity-io',
    permanent: true,
  },
  {
    source: `/learn/gardening/github-issues-powered-blog`,
    destination: '/blog/github-issues-powered-blog',
    permanent: true,
  },
  {
    source: `/learn/rails-graphql-typescript-react-apollo`,
    destination: '/blog/rails-graphql-typescript-react-apollo',
    permanent: true,
  },
  {
    source: `/learn/next/tailwindcss-dark-mode-nextjs-typography-prose`,
    destination: '/blog/tailwindcss-dark-mode-nextjs-typography-prose',
    permanent: true,
  },
  {
    source: `/learn/javascript/codemods-with-babel-plugins`,
    destination: '/blog/codemods-with-babel-plugins',
    permanent: true,
  },
  {
    source: `/learn/javascript/use-the-intersection-observer-api-for-analytics-events`,
    destination: '/blog/use-the-intersection-observer-api-for-analytics-events',
    permanent: true,
  },
  {
    source: `/learn/javascript/handling-copy-and-paste-in-cypress`,
    destination: '/blog/handling-copy-and-paste-in-cypress',
    permanent: true,
  },
  {
    source: `/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript`,
    destination: '/blog/object-pool-design-pattern',
    permanent: true,
  },
]

const instructorRoutes = [
  {
    source: `/instructors/:instructor`,
    destination: `${searchUrlRoot}/resources-by-:instructor`,
    permanent: true,
  },
  {
    source: `/instructors/:id/feed`,
    destination: `${appUrl}/instructors/:id/feed`,
    permanent: true,
  },
  {
    source: `/instructors/:instructor/:rest(.+)`,
    destination: `${appUrl}/instructors/:instructor/:rest`,
    permanent: true,
  },
  {source: `/instructors`, destination: searchUrlRoot, permanent: true},
]

const searchRoutes = [
  {source: `/search`, destination: searchUrlRoot, permanent: true},
  {
    source: `/s/:all*`,
    destination: `${appUrl}/s/:all*`,
    permanent: true,
  },
]

const legacyRoutes = [
  {
    source: `/update_billing.html`,
    destination: `${appUrl}/update_billing.html`,
    permanent: true,
  },
  {
    source: `/sitemap.xml.gz`,
    destination: `${appUrl}/sitemap.xml.gz`,
    permanent: true,
  },
  {
    source: `/oauth/:all*`,
    destination: `${appUrl}/oauth/:all*`,
    permanent: true,
  },
  {
    source: `/production/:all*`,
    destination: `${appUrl}/production/:all*`,
    permanent: true,
  },
  {
    source: `/enhanced_transcripts/:all*`,
    destination: `${appUrl}/enhanced_transcripts/:all*`,
    permanent: true,
  },
  {
    source: `/articles/:all*`,
    destination: `${appUrl}/articles/:all*`,
    permanent: true,
  },
  {
    source: `/transaction_receipt/:all*`,
    destination: `${appUrl}/transaction_receipt/:all*`,
    permanent: true,
  },
  {
    source: `/lesson_uploads/:all*`,
    destination: `${appUrl}/lesson_uploads/:all*`,
    permanent: true,
  },
  {
    source: `/watch/:all*`,
    destination: `${appUrl}/watch/:all*`,
    permanent: true,
  },
  {
    source: `/users/:all*`,
    destination: `${appUrl}/users/:all*`,
    permanent: true,
  },
  {
    source: `/koudoku/:all*`,
    destination: `${appUrl}/koudoku/:all*`,
    permanent: true,
  },
  {
    source: `/admin/:all*`,
    destination: `${appUrl}/admin/:all*`,
    permanent: true,
  },
  {
    source: `/gifts/:all*`,
    destination: `${appUrl}/gifts/:all*`,
    permanent: true,
  },
]

const contentIndexRoutes = [
  {
    source: `/podcasts`,
    destination: `${searchUrlRoot}?type=podcast`,
    permanent: true,
  },
  {
    source: `/talks`,
    destination: `${searchUrlRoot}?type=talk`,
    permanent: true,
  },
  {
    source: `/lessons`,
    destination: `${searchUrlRoot}?type=lesson`,
    permanent: true,
  },
  {
    source: `/browse/:context/:tag`,
    destination: `${searchUrlRoot}/:tag`,
    permanent: true,
  },
  {source: `/browse/:all*`, destination: searchUrlRoot, permanent: true},
  {source: `/browse/:context`, destination: searchUrlRoot, permanent: true},
]

const apiRoutes = [
  {
    source: `/api/v1/:all*`,
    destination: `${appUrl}/api/v1/:all*`,
    permanent: true,
  },
  {
    source: `/graphql`,
    destination: `${appUrl}/graphql`,
    permanent: true,
  },
]

const contentCrudRoutes = [
  {
    source: `/downloads/:title/:rest(.+)`,
    destination: `${appUrl}/downloads/:title/:rest`,
    permanent: true,
  },
  {
    source: `/courses/:title/:rest(.+)`,
    destination: `${appUrl}/courses/:title/:rest`,
    permanent: true,
  },
  {
    source: `/playlists/new`,
    destination: `${appUrl}/playlists/new`,
    permanent: true,
  },
  {
    source: `/playlists/:title/:rest(.+)`,
    destination: `${appUrl}/playlists/:title/:rest`,
    permanent: true,
  },
  {
    source: `/lessons/:title/:rest(.+)`,
    destination: `${appUrl}/lessons/:title/:rest`,
    permanent: true,
  },
  {
    source: `/podcasts/:title/:rest(.+)`,
    destination: `${appUrl}/podcasts/:title/:rest`,
    permanent: true,
  },
]

const teamRoutes = [
  {
    source: `/team/:rest(.+)`,
    destination: `${appUrl}/team/:rest(.+)`,
    permanent: true,
  },
  {
    source: `/invite/:all*`,
    destination: `${appUrl}/invite/:all*`,
    permanent: true,
  },
  {
    source: `/managed_subscriptions/:all*`,
    destination: `${appUrl}/managed_subscriptions/:all*`,
    permanent: true,
  },
  {
    source: `/saml-consume/:all*`,
    destination: `${appUrl}/saml-consume/:all*`,
    permanent: true,
  },
  {
    source: `/saml-login/:all*`,
    destination: `${appUrl}/saml-login/:all*`,
    permanent: true,
  },
  {
    source: `/saml-metadata/:all*`,
    destination: `${appUrl}/saml-metadata/:all*`,
    permanent: true,
  },
  {
    source: `/saml_certificates/:all*`,
    destination: `${appUrl}/saml_certificates/:all*`,
    permanent: true,
  },
]

const rssRoutes = [
  {
    source: `/feed`,
    destination: `${appUrl}/feed`,
    permanent: true,
  },
  {
    source: `/lessons/pro_feed`,
    destination: `${appUrl}/lessons/pro_feed`,
    permanent: true,
  },
  {
    source: `/lessons/feed`,
    destination: `${appUrl}/lessons/feed`,
    permanent: true,
  },
  {
    source: `/courses/:id/course_feed`,
    destination: `${appUrl}/courses/:id/course_feed`,
    permanent: true,
  },

  {
    source: `/playlists/:id/playlist_feed`,
    destination: `${appUrl}/playlists/:id/playlist_feed`,
    permanent: true,
  },
]

module.exports = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === `true`,
    }),
    withSvgr,
    withImages(),
    withMDX({
      pageExtensions: [`ts`, `tsx`, `mdx`],
      remarkPlugins: [
        require(`remark-slug`),
        require(`remark-footnotes`),
        require(`remark-code-titles`),
      ],
      rehypePlugins: [],
    }),
  ],
  nextConfig,
)
