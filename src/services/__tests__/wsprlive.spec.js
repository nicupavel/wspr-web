import { describe, it, expect } from 'vitest'
import useWSPRLiveService from '@/services/wsprlive'

const wsprService = useWSPRLiveService()

describe('wspr.live', () => {
  let kvNoLoc, kvLoc

  it('parses properly', () => {
    kvNoLoc = wsprService.parse(wsprliveTestDataNoExtraLoc)
    expect(kvNoLoc).toBeTruthy()

    kvLoc = wsprService.parse(wsprliveTestDataExtraLoc)
    expect(kvLoc).toStrictEqual({
      P4NIC: {
        '2024-06-19 17:58:00': { tx_loc: 'KN37se', tx_loc_extra: 13 },
        '2024-06-19 17:56:00': { tx_loc: 'KN37se', tx_loc_extra: 23 },
        '2024-06-19 17:54:00': { tx_loc: 'KN37se', tx_loc_extra: 13 }
      }
    })
  })

  it('aggregates properly', () => {
    let aggregateData = wsprService.aggregate(kvNoLoc, wsprliveTestCallsign)
    expect(aggregateData).toEqual({})
    aggregateData = wsprService.aggregate(kvLoc, wsprliveTestCallsign)
    expect(aggregateData).toStrictEqual({ '2024-06-19 17:56:00': { tx_loc: 'KN37se74' } })
  })
})

const wsprliveTestCallsign = 'P4NIC'
const wsprliveTestDataExtraLoc = {
  meta: [
    {
      name: 'id',
      type: 'UInt64'
    },
    {
      name: 'time',
      type: 'DateTime'
    },
    {
      name: 'band',
      type: 'Int16'
    },
    {
      name: 'rx_sign',
      type: 'LowCardinality(String)'
    },
    {
      name: 'rx_lat',
      type: 'Float32'
    },
    {
      name: 'rx_lon',
      type: 'Float32'
    },
    {
      name: 'rx_loc',
      type: 'LowCardinality(String)'
    },
    {
      name: 'tx_sign',
      type: 'LowCardinality(String)'
    },
    {
      name: 'tx_lat',
      type: 'Float32'
    },
    {
      name: 'tx_lon',
      type: 'Float32'
    },
    {
      name: 'tx_loc',
      type: 'LowCardinality(String)'
    },
    {
      name: 'distance',
      type: 'UInt16'
    },
    {
      name: 'azimuth',
      type: 'UInt16'
    },
    {
      name: 'rx_azimuth',
      type: 'UInt16'
    },
    {
      name: 'frequency',
      type: 'UInt32'
    },
    {
      name: 'power',
      type: 'Int8'
    },
    {
      name: 'snr',
      type: 'Int8'
    },
    {
      name: 'drift',
      type: 'Int8'
    },
    {
      name: 'version',
      type: 'LowCardinality(String)'
    },
    {
      name: 'code',
      type: 'Int8'
    }
  ],

  data: [
    [
      '7877165877',
      '2024-06-19 17:58:00',
      18,
      'G8SEZ',
      52.104,
      -0.375,
      'IO92tc',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      2069,
      296,
      94,
      18106083,
      13,
      -20,
      0,
      '2.7.1-rc2',
      1
    ],
    [
      '7880786162',
      '2024-06-19 17:58:00',
      18,
      'ON5KQ',
      50.771,
      3.208,
      'JO10os',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1811,
      292,
      93,
      18106073,
      13,
      -17,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7877169289',
      '2024-06-19 17:58:00',
      18,
      'G4MSA',
      50.854,
      -1.958,
      'IO90au',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      2174,
      292,
      89,
      18106071,
      13,
      -24,
      0,
      '1.4A Kiwi',
      1
    ],
    [
      '7880787339',
      '2024-06-19 17:56:00',
      18,
      'ON5KQ',
      50.771,
      3.208,
      'JO10os',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1811,
      292,
      93,
      18106072,
      23,
      -10,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7877164371',
      '2024-06-19 17:56:00',
      18,
      'PA1JMS',
      51.979,
      4.208,
      'JO21cx',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1756,
      296,
      98,
      18106071,
      23,
      -27,
      0,
      '',
      1
    ],
    [
      '7877163694',
      '2024-06-19 17:56:00',
      18,
      'G8SEZ',
      52.104,
      -0.375,
      'IO92tc',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      2069,
      296,
      94,
      18106083,
      23,
      -25,
      0,
      '2.7.1-rc2',
      1
    ],
    [
      '7902204014',
      '2024-06-19 17:54:00',
      14,
      'OE9GHV',
      47.438,
      9.875,
      'JN47wk',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1329,
      278,
      84,
      14097058,
      13,
      -15,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7881861521',
      '2024-06-19 17:54:00',
      14,
      'PD0OHW',
      53.104,
      6.958,
      'JO33lc',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1600,
      302,
      105,
      14097058,
      13,
      -20,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7877168112',
      '2024-06-19 17:54:00',
      14,
      'IW3HBX',
      45.563,
      12.042,
      'JN65an',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1201,
      267,
      75,
      14097057,
      13,
      -18,
      0,
      'DS_0.35.1',
      1
    ],
    [
      '7877164525',
      '2024-06-19 17:54:00',
      14,
      'DC1RDB',
      48.771,
      11.542,
      'JN58ss',
      'P4NIC',
      47.188,
      27.542,
      'KN37se',
      1202,
      284,
      92,
      14097057,
      13,
      -9,
      0,
      'RP122-16',
      1
    ]
  ],

  rows: 10,

  rows_before_limit_at_least: 2636,

  statistics: {
    elapsed: 4.060129088,
    rows_read: 7749592977,
    bytes_read: 15510086771
  }
}

const wsprliveTestDataNoExtraLoc = {
  meta: [
    {
      name: 'id',
      type: 'UInt64'
    },
    {
      name: 'time',
      type: 'DateTime'
    },
    {
      name: 'band',
      type: 'Int16'
    },
    {
      name: 'rx_sign',
      type: 'LowCardinality(String)'
    },
    {
      name: 'rx_lat',
      type: 'Float32'
    },
    {
      name: 'rx_lon',
      type: 'Float32'
    },
    {
      name: 'rx_loc',
      type: 'LowCardinality(String)'
    },
    {
      name: 'tx_sign',
      type: 'LowCardinality(String)'
    },
    {
      name: 'tx_lat',
      type: 'Float32'
    },
    {
      name: 'tx_lon',
      type: 'Float32'
    },
    {
      name: 'tx_loc',
      type: 'LowCardinality(String)'
    },
    {
      name: 'distance',
      type: 'UInt16'
    },
    {
      name: 'azimuth',
      type: 'UInt16'
    },
    {
      name: 'rx_azimuth',
      type: 'UInt16'
    },
    {
      name: 'frequency',
      type: 'UInt32'
    },
    {
      name: 'power',
      type: 'Int8'
    },
    {
      name: 'snr',
      type: 'Int8'
    },
    {
      name: 'drift',
      type: 'Int8'
    },
    {
      name: 'version',
      type: 'LowCardinality(String)'
    },
    {
      name: 'code',
      type: 'Int8'
    }
  ],

  data: [
    [
      '7918628530',
      '2024-06-25 17:22:00',
      18,
      'N4RVE',
      48.563,
      -123.125,
      'CN88kn',
      'P4NIC',
      37.688,
      -121.875,
      'CM97bq',
      1213,
      356,
      174,
      18106175,
      23,
      -7,
      0,
      'WD_3.1.7',
      1
    ],
    [
      '7908540170',
      '2024-06-25 17:22:00',
      18,
      'KA7OEI-1',
      41.604,
      -112.292,
      'DN31uo',
      'P4NIC',
      37.688,
      -121.875,
      'CM97bq',
      928,
      59,
      245,
      18106176,
      23,
      6,
      -1,
      'WD_3.1.6',
      1
    ],
    [
      '7908538778',
      '2024-06-25 17:22:00',
      18,
      'N2HQI',
      43.021,
      -76.458,
      'FN13sa',
      'P4NIC',
      37.688,
      -121.875,
      'CM97bq',
      3846,
      67,
      276,
      18106175,
      23,
      -19,
      -2,
      '',
      1
    ],
    [
      '7908537106',
      '2024-06-25 17:22:00',
      18,
      'WA5DJJ',
      32.313,
      -106.708,
      'DM62ph',
      'P4NIC',
      37.688,
      -121.875,
      'CM97bq',
      1503,
      109,
      297,
      18106176,
      23,
      -26,
      -1,
      '2.6.1',
      1
    ],
    [
      '7918629201',
      '2024-06-25 17:20:00',
      18,
      'N4RVE',
      48.563,
      -123.125,
      'CN88kn',
      'P4NIC',
      37.688,
      -121.875,
      'CM97bq',
      1213,
      356,
      174,
      18106176,
      23,
      -3,
      0,
      'WD_3.1.7',
      1
    ],
    [
      '7908535190',
      '2024-06-25 17:20:00',
      18,
      'VE6JY',
      53.729,
      -112.792,
      'DO33or',
      'P4NIC',
      37.646,
      -121.875,
      'CM97bp',
      1919,
      18,
      204,
      18106195,
      23,
      -21,
      0,
      '1.4A Kiwi',
      1
    ],
    [
      '7908534903',
      '2024-06-25 17:20:00',
      18,
      'KA7OEI-1',
      41.604,
      -112.292,
      'DN31uo',
      'P4NIC',
      37.646,
      -121.875,
      'CM97bp',
      931,
      59,
      244,
      18106175,
      23,
      1,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7908534261',
      '2024-06-25 17:20:00',
      18,
      'VE3EID',
      45.438,
      -79.458,
      'FN05gk',
      'P4NIC',
      37.646,
      -121.875,
      'CM97bp',
      3591,
      62,
      271,
      18106184,
      23,
      -25,
      0,
      'CWSL_DIGI',
      1
    ],
    [
      '7908533794',
      '2024-06-25 17:20:00',
      18,
      'N6GN/K',
      40.604,
      -105.208,
      'DN70jo',
      'P4NIC',
      37.646,
      -121.875,
      'CM97bp',
      1472,
      72,
      262,
      18106175,
      23,
      -24,
      0,
      'WD_3.1.6',
      1
    ],
    [
      '7908532143',
      '2024-06-25 17:20:00',
      18,
      'N2HQI',
      43.021,
      -76.458,
      'FN13sa',
      'P4NIC',
      37.646,
      -121.875,
      'CM97bp',
      3848,
      66,
      276,
      18106175,
      23,
      -25,
      0,
      '',
      1
    ]
  ],

  rows: 10,

  rows_before_limit_at_least: 113016,

  statistics: {
    elapsed: 4.482537854,
    rows_read: 7747970956,
    bytes_read: 16658165323
  }
}
