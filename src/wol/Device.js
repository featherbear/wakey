import { v4 as uuid } from 'uuid'
import wol from 'wakeonlan'

class WOLDevice {
  #name
  #address
  #port
  #count
  #interval
  #mac

  constructor ({ name, address, port, count, interval, mac }) {
    this.name = name
    this.address = address
    this.port = port
    this.count = count
    this.interval = interval
    this.mac = mac
  }

  get name () {
    return this.#name
  }
  set name (val) {
    if (!val || typeof val !== 'string')
      throw new Error('Invalid value: ' + val)
    this.#name = val
  }

  get mac () {
    return this.#mac
  }
  set mac (val) {
    if (!val || typeof val !== 'string')
      throw new Error('Invalid value: ' + val)
    this.#mac = val
  }

  get address () {
    return this.#address
  }
  set address (val) {
    if (!val || typeof val !== 'string')
      throw new Error('Invalid value: ' + val)
    this.#address = val
  }

  get port () {
    return this.#port
  }
  set port (val) {
    if (!val || typeof val !== 'number' || val < 0 || val > 65535)
      throw new Error('Invalid value: ' + val)
    this.#port = val
  }

  get count () {
    return this.#count
  }
  set count (val) {
    if (!val || typeof val !== 'number')
      throw new Error('Invalid value: ' + val)
    this.#count = val
  }

  get interval () {
    return this.#interval
  }
  set interval (val) {
    if (!val || typeof val !== 'number')
      throw new Error('Invalid value: ' + val)
    this.#interval = val
  }

  async wake () {
    return wol(this.mac, {
      address: this.address,
      count: this.count,
      interval: this.interval,
      port: this.port
    })
  }
}

export function initialiseDevice () {
  let device = new WOLDevice({
    name: 'WOL Device',
    address: '255.255.255.255',
    port: 9,
    count: 3,
    interval: 100,
    mac: 'FF:FF:FF:FF:FF:FF'
  })
  device.id = uuid()
  return device
}

export function loadDevice ({ id, name, address, mac, port, count, interval }) {
  let device = new WOLDevice({ name, address, mac, port, count, interval })
  device.id = id
  return device
}
