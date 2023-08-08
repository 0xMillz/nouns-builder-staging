import axios from 'axios'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import useSWR from 'swr'

import { AuctionHistory } from 'src/data/subgraph/requests/auctionHistory'
import { useDaoStore } from 'src/modules/dao'
import { useChainStore } from 'src/stores/useChainStore'

import { AuctionGraph } from './AuctionGraph'
import { AuctionGraphLayout, DisplayPanel, SkeletonPanel } from './Layouts'

export enum StartTimes {
  '30d' = '30',
  '60d' = '60',
  '90d' = '90',
  'All' = '0',
}

const startTimeFromNow = (startTime: StartTimes) => {
  if (startTime === '0') return 0

  const nowInSeconds = Math.floor(Date.now() / 1000)

  return nowInSeconds - parseInt(startTime) * 24 * 60 * 60
}

export const AuctionChart = ({ viewSwitcher }: { viewSwitcher: ReactNode }) => {
  const { isReady } = useRouter()
  const chain = useChainStore((x) => x.chain)
  const {
    addresses: { token },
  } = useDaoStore()

  const [startTime, setStartTime] = useState(StartTimes['All'])

  const startSeconds = startTimeFromNow(startTime)

  const { data, error, isValidating } = useSWR(
    isReady ? [token, chain.id, startSeconds] : undefined,
    () =>
      axios
        .get<{ auctionHistory: AuctionHistory[] }>(
          `/api/auctionHistory/${token}?chainId=${chain.id}&startTime=${startSeconds}`
        )
        .then((x) => x.data.auctionHistory)
  )

  if (isValidating) {
    return (
      <AuctionGraphLayout
        viewSwitcher={viewSwitcher}
        startTime={startTime}
        setStartTime={setStartTime}
        chart={<SkeletonPanel />}
      />
    )
  }

  if (error) {
    return (
      <AuctionGraphLayout
        viewSwitcher={viewSwitcher}
        startTime={startTime}
        setStartTime={setStartTime}
        chart={
          <DisplayPanel
            title="Error"
            description={error?.message || 'Error fetching graph data from subgraph'}
          />
        }
      />
    )
  }

  if (!data || !data.length || data.length < 2) {
    return (
      <AuctionGraphLayout
        viewSwitcher={viewSwitcher}
        startTime={startTime}
        setStartTime={setStartTime}
        chart={
          <DisplayPanel
            title="Insufficient Data"
            description="Not enough data within the given time-frame to populate a graph"
          />
        }
      />
    )
  }

  return (
    <AuctionGraphLayout
      viewSwitcher={viewSwitcher}
      startTime={startTime}
      setStartTime={setStartTime}
      chartData={data}
      chart={
        <AuctionGraph
          chartData={data}
          startTime={startTime}
          setStartTime={setStartTime}
        />
      }
    />
  )
}
