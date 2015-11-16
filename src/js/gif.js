'use strict'

import Exploder from 'polyclick/x-gif/src/exploder.js'
import EventClass from 'event-class'
import THREE from 'three'
import _ from 'lodash'

export class Gif extends EventClass {
  constructor(path) {
    super()

    this.path = path

    this.preloaded = false

    this.xgifdata = null
    this.frameImages = null
    this.frameTextures = null

    this.init()
  }

  init() {
    // load & explode in individual frames
    this.loadAndExplodeGif(this.path)
      .then((xgifdata) => {
        this.xgifdata = xgifdata

        // create images from frame blobs
        this.createFrameImages(this.xgifdata.frames).then((images) => {
          this.frameImages = images
          this.preloaded = true

          this.frameTextures = this.createTextures(this.xgifdata.frames, this.frameImages)

          this.trigger('preloaded')
        })
      })
  }

  loadAndExplodeGif(path) {
    return new Promise((resolve) => {
      let exploder = new Exploder(path)
      exploder.load().then((xgifdata) => {
        resolve(xgifdata)
      })
    })
  }

  // create images from the blobs of each individual frame
  createFrameImages(frames) {
    let paths = _.pluck(frames, 'url')
    return new Promise((resolve) => {
      let preloaded = 0
      let images = _.map(paths, (path) => {
        let image = new Image()
        image.onload = function() {
          if (++preloaded === paths.length)
            resolve(images)
        }
        image.src = path
        return image
      })
    })
  }

  // create textures from each individual frame image
  // useRaw: use the original blob information from each frame without respecting the layering/merging/disposal gif rules
  createTextures(frames, images, useRaw = false) {
    if (useRaw) {
      return _.map(frames, (frame) => {
        let texture = THREE.ImageUtils.loadTexture(frame.url)
        texture.minFilter = THREE.NearestFilter
        return texture
      })
    } else {
      // create temporary canvas element for offscreen rendering
      let canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height

      // todo: enhance this to really respect the disposal rules of a frame
      // we currently just layer the next frame on top of the previous, always
      // which is, in most cases, the right solution
      let context = canvas.getContext('2d')
      let textures = _.map(images, (image) => {
        context.drawImage(image, 0, 0)
        let texture = THREE.ImageUtils.loadTexture(canvas.toDataURL())
        texture.minFilter = THREE.NearestFilter
        return texture
      })

      return textures
    }
  }

  get width() {
    if (!this.preloaded) throw new Error(`Gif not yet preloaded, can't get width`)
    return _.first(this.frameImages).width
  }

  get height() {
    if (!this.preloaded) throw new Error(`Gif not yet preloaded, can't get height`)
    return _.first(this.frameImages).height
  }

  get totalLengthInMs() {
    if (!this.preloaded) throw new Error(`Gif not yet preloaded, can't get totalLengthInMs`)
    return this.xgifdata.length * 10
  }

  get totalFrames() {
    if (!this.preloaded) throw new Error(`Gif not yet preloaded, can't get totalFrames`)
    return this.xgifdata.frames.length
  }
}
