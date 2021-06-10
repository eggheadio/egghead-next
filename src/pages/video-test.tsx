import * as React from 'react'
import {GetServerSideProps} from 'next'
import {isEmpty} from 'lodash'
import {
  Player,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ClosedCaptionButton,
  PlayToggle,
  ForwardControl,
  VolumeMenuButton,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  ProgressControl,
  RemainingTimeDisplay,
  PlaybackRateMenuButton,
  FullscreenToggle,
  PlayerProvider,
  CueBar,
  usePlayer,
} from 'cueplayer-react'
import {SyntheticEvent} from 'react'
import HLSSource from '../components/player/hls-source'
import classNames from 'classnames'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const videoResource = pickVideoResource(query.v)

  return {
    props: {
      videoResource,
    },
  }
}

function getNoteCues() {
  const {player} = usePlayer()
  const {activeMetadataTracks = []} = player
  const noteTracks = activeMetadataTracks.filter((track: TextTrack) => {
    return track.label === 'notes'
  })
  const noteCues: VTTCue[] = noteTracks.reduce(
    (acc: VTTCue[], track: TextTrack) => {
      return [...acc, ...Array.from(track.cues || [])]
    },
    [],
  )
  return noteCues
}

const Notes: React.FunctionComponent = () => {
  const {player} = usePlayer()
  const noteCues = getNoteCues()
  const disabled: boolean = isEmpty(noteCues)

  return disabled ? null : (
    <div>
      {noteCues.map((cue) => {
        const note = JSON.parse(cue.text)
        const active = cue === player.activeMetadataTrackCue
        return (
          <div
            key={note.title}
            className={classNames(
              'text-sm p-4 bg-white dark:bg-gray-900 rounded-md mb-3 shadow-sm border-2 border-transparent',
              {
                'border-indigo-500': active,
                '': !active,
              },
            )}
          >
            <h1 className="pb-2 text-base font-semibold text-black dark:text-white">
              {note.title}
            </h1>
            <div className="leading-normal prose-sm prose dark:prose-dark">
              {note.description}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const getSideBarTabs = () => {
  const noteCues = getNoteCues()
  return [
    {label: 'Notes', content: !isEmpty(noteCues) ? <Notes /> : null},
    {label: 'Lessons', content: <NextUpList />},
  ]
}

type SideBarProps = {
  tabs: {label: string; content: React.ReactElement | null}[]
}

const SideBar: React.FC<SideBarProps> = ({tabs}) => {
  const availableTabs = tabs.filter(({content}) => content)

  return (
    <div className="sidebar">
      {!isEmpty(tabs) && (
        <Tabs>
          <TabList>
            {availableTabs.map(({label}) => (
              <Tab key={label}>{label}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {availableTabs.map(({content, label}) => {
              return (
                <TabPanel
                  key={label}
                  className="p-4 overflow-y-auto bg-gray-100 dark:bg-gray-1000"
                >
                  {content}
                </TabPanel>
              )
            })}
          </TabPanels>
        </Tabs>
      )}
    </div>
  )
}

const NextUpList = () => {
  return (
    <ul className="p-4">
      <li>lessons</li>
    </ul>
  )
}

const VideoTest: React.FC<any> = ({videoResource}) => {
  const actualPlayerRef = React.useRef<any>()
  const playerContainer = React.useRef<any>()
  //autoplay
  const lastAutoPlayed = React.useRef()
  const [autoplay, setAutoplay] = React.useState(true)

  const send = (message: any) => {
    console.debug(message)
  }

  const onProgress = () => {}

  return (
    <div className="-mx-5 -mt-5">
      {videoResource.hls_url && (
        <div
          ref={playerContainer}
          className="relative grid grid-cols-1 lg:grid-cols-12 "
        >
          <div className="lg:col-span-9">
            <Player
              muted
              ref={(test: any) => {
                console.log(test?.manager)
              }}
              crossOrigin="anonymous"
              className="font-sans"
              poster={videoResource.poster}
              onCanPlay={(event: SyntheticEvent) => {
                console.debug(`player ready [autoplay:${autoplay}]`)
                const player: HTMLVideoElement = event.target as HTMLVideoElement
                actualPlayerRef.current = player
                const isDifferent =
                  lastAutoPlayed.current !== videoResource.hls_url
                if (autoplay && isDifferent && isFunction(player.play)) {
                  console.debug(`autoplaying`)
                  lastAutoPlayed.current = videoResource.hls_url
                  player.play()
                }
              }}
              onPause={() => {
                send('PAUSE')
              }}
              onPlay={() => send('PLAY')}
              onTimeUpdate={() => {
                onProgress()
              }}
              onEnded={() => {
                console.debug(`received ended event from player`)
                send('COMPLETE')
              }}
            >
              <BigPlayButton position="center" />
              <HLSSource isVideoChild src={videoResource.hls_url} />
              <track
                src={videoResource.subtitlesUrl}
                kind="subtitles"
                srcLang="en"
                label="English"
                default
              />
              <track
                id="notes"
                src="https://gist.githubusercontent.com/joelhooks/bd3c1d68cb5a67adfcd6c035200d1fde/raw/aa7060f584e04db26c5fa6b464bf2058ed6f6e93/notes.vtt"
                kind="metadata"
                label="notes"
              />
              <CueBar order={6.0} />
              <ControlBar disableDefaultControls>
                <PlayToggle key="play-toggle" order={1} />
                <ReplayControl key="replay-control" order={2} />
                <ForwardControl key="forward-control" order={3} />
                <VolumeMenuButton key="volume-menu-button" order={4} />
                <CurrentTimeDisplay key="current-time-display" order={5} />
                <TimeDivider key="time-divider" order={6} />
                <DurationDisplay key="duration-display" order={7} />
                <ProgressControl key="progress-control" order={8} />
                <RemainingTimeDisplay key="remaining-time-display" order={9} />
                <PlaybackRateMenuButton
                  rates={[1, 1.25, 1.5, 2]}
                  key="playback-rate"
                  order={10}
                />
                <ClosedCaptionButton order={11} />
                <FullscreenToggle
                  key="fullscreen-toggle"
                  fullscreenElement={playerContainer.current}
                  order={12}
                />
              </ControlBar>
            </Player>
          </div>
          <div className="lg:col-span-3">
            <SideBar tabs={getSideBarTabs()} />
          </div>
        </div>
      )}
    </div>
  )
}

const Page: React.FC<any> = ({videoResource}) => {
  return (
    <PlayerProvider>
      <VideoTest videoResource={videoResource} />
    </PlayerProvider>
  )
}

const videoResources = {
  testingjavascript: {
    subtitle:
      'https://app.egghead.io/api/v1/lessons/node-js-create-a-casify-function-to-generate-cases-for-jest-in-case/subtitles',
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/hls/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/dash/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.mpd',
  },
  configureAngularCLI: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-S1MetkKSG/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-S1MetkKSG.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344.mpd',

    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/angular-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter/subtitles',
  },
  rxJS: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-combination-operator-combinelatest/egghead-combination-operator-combinelatest.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/rxjs-combination-operator-combinelatest-6166b0d1b8/rxjs-combination-operator-combinelatest-6166b0d1b8.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/rxjs-combination-operator-combinelatest-6166b0d1b8/rxjs-combination-operator-combinelatest-6166b0d1b8.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/rxjs-join-values-from-multiple-observables-with-rxjs-combinelatest/subtitles',
  },
  styleReactComponents: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/hls/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/dash/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-style-react-components-with-classname-and-inline-styles/subtitles',
  },
  useJSX: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/hls/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/dash/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-use-jsx-effectively-with-react/subtitles',
  },
  redux: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-redux-simplifying-the-arrow-functions/egghead-redux-simplifying-the-arrow-functions.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/javascript-redux-simplifying-the-arrow-functions-4904bfd3df/javascript-redux-simplifying-the-arrow-functions-4904bfd3df.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/javascript-redux-simplifying-the-arrow-functions-4904bfd3df/javascript-redux-simplifying-the-arrow-functions-4904bfd3df.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/javascript-redux-simplifying-the-arrow-functions/subtitles',
  },
  defaultVideo: {
    id: 'video',
    name: 'get started with react',
    title: 'Create a User Interface with Vanilla JavaScript and DOM',
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI/hls/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI.m3u8',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-create-a-user-interface-with-vanilla-javascript-and-dom/subtitles',
  },
}

const pickVideoResource = (query: any) => {
  switch (query) {
    case 'testing':
      return videoResources.testingjavascript
    case 'angular':
      return videoResources.configureAngularCLI
    case 'rxjs':
      return videoResources.rxJS
    case 'stylereactcomponents':
      return videoResources.styleReactComponents
    case 'jsx':
      return videoResources.useJSX
    case 'redux':
      return videoResources.redux
    default:
      return videoResources.defaultVideo
  }
}

export default Page
