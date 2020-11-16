import { v4 as uuid } from 'uuid'
import wol from 'wakeonlan'
import defaults from './defaults'

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

  // https://github.com/Microsoft/TypeScript/issues/16858#issuecomment-384715673
  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj = Object.assign({}, this);
  
    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            jsonObj[key] = this[key];
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });
  
    return jsonObj;
  }
}

export function initialiseDevice () {
  let device = new WOLDevice(defaults)
  device.id = uuid()
  return device
}

export function loadDevice ({ id, name, address, mac, port, count, interval }) {
  let device = new WOLDevice({ name, address, mac, port, count, interval })
  device.id = id
  return device
}
