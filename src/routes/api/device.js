import { initialiseDevice } from '../../wol/Device'

export async function post (req, res) {
  let device

  // Oh gosh did I actually do that
  while (req.app.find((device = initialiseDevice()).id));

  const keys = ['name', 'address', 'mac', 'port', 'count', 'interval']
  const errorKeys = []

  for (let key of keys) {
    try {
      device[key] = req.body[key]
    } catch {
      errorKeys.push(key)
    }
  }

  if (errorKeys.length) {
    return res.finish(
      'Invalid values were provided for ' +
        errorKeys.map(k => `\`${k}\``).join(', '),
      400
    )
  }

  req.app.add(device)

  return res.finish({ id: device.id })
}
