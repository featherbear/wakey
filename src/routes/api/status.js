import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

export function push (json) {
  emitter.emit(
    'event',
    ['event: status', `data: ${JSON.stringify(json)}`, '\n'].join('\n')
  )
}

export async function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  })

  const writeEvt = data => res.write(data)

  emitter.on('event', writeEvt)
  req.on('close', () => emitter.removeListener('event', writeEvt))
}
