import React, {FunctionComponent} from 'react'
import {connectHits} from 'react-instantsearch-dom'
import HitComponent from './components/hit'

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => (
  <div>
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </div>
)

const Hits = connectHits(CustomHits)

export default Hits
