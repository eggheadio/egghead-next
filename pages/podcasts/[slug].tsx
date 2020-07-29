import React from 'react'
import {loadPodcast} from '../../lib/podcasts'

export default function Podcast({podcast}) {
  console.log({podcast})
  return (
    <div>
      {podcast.title} <img className="max-w-xs" src={podcast.image_url} />
      <iframe
        height="52px"
        width="100%"
        frameBorder="no"
        scrolling="no"
        seamless
        src={`https://player.simplecast.com/${podcast.simplecast_uid}?dark=false`}
      ></iframe>
    </div>
  )
}

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const podcast = await loadPodcast(params.slug)
  return {
    props: {
      podcast,
    },
  }
}
