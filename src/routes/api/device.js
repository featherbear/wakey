import { initialiseDevice, loadDevice } from '../../wol/Device'

/**
 * Function is not tranaction-safe. Make a copy of device
 */
const applyValues = function (device, apply) {
  const keys = ['name', 'address', 'mac', 'port', 'count', 'interval']
  const errorKeys = []

  for (let key of keys) {
    try {
      device[key] = apply[key]
    } catch {
      errorKeys.push(key)
    }
  }

  if (errorKeys.length) {
    throw new Error(
      'Invalid values were provided for ' +
        errorKeys.map(k => `\`${k}\``).join(', ')
    )
  }
}

export async function post (req, res) {
  let device

  // Oh gosh did I actually do that
  while (req.app.find((device = initialiseDevice()).id));
  try {
    applyValues(device, req.body)
  } catch (e) {
    return res.finish(e.message, 400)
  }

  req.app.add(device)

  return res.finish({ id: device.id })
}

export async function put (req, res) {
  const { id } = req.body

  if (typeof id === 'undefined') {
    return res.finish('`id` not supplied!', 400)
  }

  let device = req.app.find(id)
  if (!device) {
    return res.finish(`Device with id \`${id}\` not found`, 404)
  }

  const copy = loadDevice(device)
  try {
    applyValues(copy, req.body)
  } catch (e) {
    return res.finish(e.message, 400)
  }

  // Now apply transaction
  applyValues(device, copy)
  req.app.save()

  return res.finish('OK')
}

export async function del (req, res) {
  const { id } = req.body

  if (typeof id === 'undefined') {
    return res.finish('`id` not supplied!', 400)
  }

  let device = req.app.find(id)
  if (!device) {
    return res.finish(`Device with id \`${id}\` not found`, 404)
  }

  req.app.remove(device)

  return res.finish('OK')
}
