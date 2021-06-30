import React, {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'

type AutoplayControlProps = {
  enabled: boolean
  onDark?: boolean
  player: any
  order?: number
}

const AutoplayControl: FunctionComponent<AutoplayControlProps> = ({
  enabled,
  onDark = false,
  player,
  order,
}) => {
  const {autoplay, setPlayerPrefs} = useEggheadPlayerPrefs()

  return (
    <div className="flex px-3">
      <button
        onClick={() => {
          if (enabled) {
            track(`clicked toggle autoplay`, {
              state: !autoplay ? 'off' : 'on',
            })
            setPlayerPrefs({autoplay: !autoplay})
            if (!autoplay) {
              if (player) {
                player.play()
              }
            } else {
              if (player) {
                player.pause()
              }
            }
          }
        }}
        type="button"
        name="autoplay"
        id="autoplay"
        aria-pressed="false"
        className="flex items-center group space-x-1"
      >
        <div
          className={`${
            enabled && autoplay
              ? 'bg-blue-600 group-hover:bg-blue-500'
              : `${
                  onDark
                    ? 'bg-gray-700 group-hover:bg-gray-600'
                    : 'bg-gray-200 group-hover:bg-gray-300'
                }`
          } relative inline-flex flex-shrink-0 h-4 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {enabled && (
            <span className="sr-only">
              {autoplay ? 'Turn autoplay off' : 'Turn autoplay on'}
            </span>
          )}

          <span
            aria-hidden="true"
            className={`${
              enabled && autoplay ? 'translate-x-4' : 'translate-x-0'
            } inline-block h-3 w-3 rounded-full ${
              onDark ? 'bg-gray-200' : 'bg-white'
            } shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </div>
      </button>
    </div>
  )
}

export default AutoplayControl
