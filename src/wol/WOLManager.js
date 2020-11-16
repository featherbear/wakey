import fs from 'fs'
import { loadDevice } from './Device'
import doScan from 'local-devices'

const filename = 'data.json'

const WOLManager = new (class {
  #data
  #status

  #scanCallback
  setCallback (fn) {
    this.#scanCallback = fn
  }

  constructor () {
    this.#data = []
    this.#status = {}
    this.#scanCallback = null

    //#region File storage
    if (!fs.existsSync(filename)) {
      console.log(`Creating data storage in ${filename}`)
      this.save()
    } else {
      let fileData
      try {
        fileData = JSON.parse(fs.readFileSync(filename, { flag: 'r+' }))

        for (let [id, data] of Object.entries(fileData)) {
          try {
            this.#data.push(loadDevice(data))
          } catch (e) {
            console.log(`Could not load device with ID: ${id}.\nError: ${e}`)
          }
        }
      } catch (e) {
        console.warn(
          `Unable to open ${filename} - perhaps it is missing or inaccessible.\nError ${e}`
        )
      }
    }

    //#endregion

    //#region Scanner
    setInterval(this.scan.bind(this), 4 * 1000 /* 10 seconds */)
    this.scan()
    //#endregion
  }

  async scan () {
    let devices = await doScan()

    // A MAC address can have multiple IPs resolved to it
    // Group IPs by MAC address
    let addresses = devices.reduce((obj, { ip, mac }) => {
      mac = mac.toUpperCase()
      return {
        ...obj,
        [mac]: [...(obj[mac] || []), ip]
      }
    }, {})

    let data = Object.entries(addresses).reduce(
      (obj, [mac, ips]) => ({
        ...obj,
        [mac]: { seen: new Date().getTime(), ips }
      }),
      {}
    )

    // Apply new data over old data
    let newStatus = {
      ...this.#status,
      ...data
    }

    this.#scanCallback && this.#scanCallback(data)
    this.#status = newStatus
  }

  async save () {
    return fs.writeFileSync(filename, JSON.stringify(this.#data, null, 2))
  }

  list () {
    return this.#data
  }

  status () {
    return Object.fromEntries(
      this.#data
        .filter(device => typeof device.mac !== 'undefined')
        .map(device => [device.mac, this.#status[device.mac] || []])
    )
  }

  find (id) {
    return this.#data.find(device => device.id === id)
  }

  add (device) {
    if (this.find(device.id)) {
      return new Error(`Duplicate ID added \`${device.id}\``)
    }

    this.#data.push(device)
    this.save()
  }

  remove (device) {
    this.#data = this.#data.filter(d => d !== device)
    this.save()
  }
})()

export default WOLManager
export const MiddlewareGenerator = decorator => (req, res, next) => {
  req[decorator] = WOLManager
  next()
}
