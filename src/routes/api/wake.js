export async function post (req, res, n) {
  const { id, wait } = req.body

  if (typeof id === 'undefined') {
    return res.finish('`id` not supplied!', 400)
  }

  let device = req.app.find(id)
  if (!device) {
    return res.finish(`Device with id \`${id}\` not found`, 404)
  }

  wait ? await device.wake() : device.wake()

  return res.finish('OK')
}
