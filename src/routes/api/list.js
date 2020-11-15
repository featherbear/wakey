export async function get (req, res) {
  return res.finish(req.app.list())
}
