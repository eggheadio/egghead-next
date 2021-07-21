import useSwr from 'swr'
import {loadLesson} from '../../lib/lessons'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'

const ArticleTalkCard: React.FC<{talk: any}> = ({talk}) => {
  const {data} = useSwr(talk, loadLesson)

  return data ? (
    <div className="my-32">
      <HorizontalResourceCard
        resource={{
          name: 'check out this talk',
          byline: `${data.instructor.full_name}`,
          slug: data.slug,
          title: data.title,
          path: data.path,
          image: data.thumb_url,
        }}
      />
    </div>
  ) : null
}

export default ArticleTalkCard
