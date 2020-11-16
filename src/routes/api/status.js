import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

export function push (json) {
  emitter.emit(
    'event',
    [
      `id: ${uuid()}`,
      'event: status',
      `data: ${JSON.stringify(json)}`,
      '\n'
    ].join('\n')
  )
}


export async function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })

  emitter.on('event', data => {
    res.write(data)
  })

  console.log(req.socket.once('end', ()=> {
    console.log('GONE');
  }));
}
