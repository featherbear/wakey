import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

let last = null
export function push (json) {
  emitter.emit(
    'event',
    (last = ['event: status', `data: ${JSON.stringify(json)}`, '\n'].join('\n'))
  )
}

export async function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  })

  const writeEvt = data => res.write(data)
  last && writeEvt(last)

  emitter.on('event', writeEvt)
  req.on('close', () => emitter.removeListener('event', writeEvt))
}
