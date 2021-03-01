import {find, get} from 'lodash'
import Card from 'components/pages/home/card'
import Image from 'next/image'
import {GetServerSideProps} from 'next'
import SearchInstructorEssential from '../instructor-essential'
import ExternalTrackedLink from 'components/external-tracked-link'
import Link from 'next/link'
import useSwr from 'swr'
import React from 'react'
import {loadStephanieData} from './stephanie-page-data'

const SearchStephanieEckles = (props: any) => {
  const {data} = useSwr(
    'accessible-cross-browser-css-form-styling-7297',
    loadStephanieData,
  )

  console.log('data: ', data)

  return <div>{data}</div>
}

export default SearchStephanieEckles

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  console.log('Hi')
  const resources = 'wtf'
  console.log({resources})

  return {
    props: {
      resources,
    },
  }
}
