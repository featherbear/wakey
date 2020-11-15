import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import { json } from 'body-parser'
import * as sapper from '@sapper/server'
import sendType from '@polka/send-type'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

import Data, { MiddlewareGenerator as WOLMiddleware } from './wol/Data'

polka()
  .use(
    WOLMiddleware('app'),
    // Polka's that minimal that we don't even have a nice response function
    (req, res, next) => {
      res.finish = (data, code = 200) => {
        sendType(res, code, code >= 400 ? { error: data } : data)
      }
      next()
    },
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    json(),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log('error', err)
  })
