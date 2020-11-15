import fs from 'fs'
import { loadDevice } from './Device'
const filename = 'data.json'

const DataObj = new (class {
  #data

  constructor () {
    this.#data = {}
    if (!fs.existsSync(filename)) {
      console.log(`Creating data storage in ${filename}`)
      this.save()
      return
    }

    let fileData
    try {
      fileData = JSON.parse(fs.readFileSync(filename, { flag: 'r+' }))

      for (let [id, data] of Object.entries(fileData)) {
        try {
          this.#data[id] = loadDevice(data)
        } catch (e) {
          console.log(`Could not load device with ID: ${id}.\nError: ${e}`);
        }
       }
    } catch (e) {
      console.warn(
        `Unable to open ${filename} - perhaps it is missing or inaccessible.\nError ${e}`
      )
    }
  }

  async save () {
    return fs.writeFileSync(filename, JSON.stringify(this.#data, null, 2))
  }

  list () {
    return this.#data
  }

  find (id) {
    return this.#data[id] || null
  }
})()

export default DataObj
export const MiddlewareGenerator = decorator => (req, res, next) => {
  req[decorator] = DataObj
  next()
}
