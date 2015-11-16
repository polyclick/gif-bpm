'use strict'

import _ from 'lodash'
import THREE from 'three'
import TweenMax from 'gsap'

import {Gif} from './gif.js'

class App {
  constructor() {
    this.camera = null
    this.scene = null
    this.renderer = null
    this.mesh = null
    this.gif = null
    this.textureMap = null
    this.currentFrame = 0
    this.bpm = 123

    this.init()

    // consts
    this.RANDOM_GIF_URLS = [
      'https://38.media.tumblr.com/9d535e50984adbd57e8f5012d292ae06/tumblr_nipm21HSkS1suqp7no1_400.gif',
      'https://33.media.tumblr.com/bc4c9f736521fbe5247a4282e9846cf3/tumblr_n4mrgu1H601qkwe6ao1_500.gif',
      'https://38.media.tumblr.com/7fe9098cae355cef72e99f1484ee8d4c/tumblr_mkji5pPYqk1r4mh0bo1_r1_500.gif',
      'https://33.media.tumblr.com/724a51968d0332bcaac2cc53b1a11516/tumblr_nue47xerj71uo7ripo1_400.gif',
      'https://33.media.tumblr.com/ec5f37d1d333ac629896ff8417f548b8/tumblr_nu8c99mSMA1tiyj7vo1_500.gif',
      'https://38.media.tumblr.com/be84f9fc951a8a34e3cc07f21e7a4eda/tumblr_noegs0dIEA1rpco88o1_500.gif',
      'https://31.media.tumblr.com/59fe1da2859d8ee5347579c3b8c2151c/tumblr_nvfvrfytk41rpco88o1_500.gif',
      'https://38.media.tumblr.com/7bd7f1ab3fc44e14381cab74bac237ba/tumblr_nqxxbvk4s51qhrm3lo1_500.gif',
      'https://33.media.tumblr.com/d89e848a728850865ec77632613963fe/tumblr_nly3doXzZm1qd479ro1_1280.gif',
      'https://33.media.tumblr.com/120c787f6c25ee86adae797c3e1a2927/tumblr_nun7csXHeL1uc71mpo1_400.gif',
      'https://31.media.tumblr.com/d01f243e79b6c32dc9f21ec84a4c77b0/tumblr_nuo6um1BFo1qc66bjo1_500.gif',
      'https://31.media.tumblr.com/e0a10f408390284aad21ae869aa618de/tumblr_nt96z1oOiG1u1ad2qo1_500.gif',
      'https://31.media.tumblr.com/cfdb0165cac36114bd577872923708ee/tumblr_nscrn8Jk0J1td30guo1_500.gif',
      'https://33.media.tumblr.com/0345649dcff04994417f2abf8a31e0aa/tumblr_nrwqdffZGS1tsgoaxo1_500.gif',
      'https://38.media.tumblr.com/a3d931cdee7581c58bda55c68b648497/tumblr_ntcgafGV291tdxtc7o1_500.gif',
      'https://33.media.tumblr.com/a4f0a9113dc2ea170a5f64c884bd8ba0/tumblr_ntyqgeDOzy1uzv9o2o1_500.gif',
      'https://31.media.tumblr.com/b2c17041965076dc9812e51851f4d763/tumblr_nb70ow6wyX1s4fz4bo1_r2_500.gif',
      'https://31.media.tumblr.com/f1000901153a268ab1bf96ab91199778/tumblr_nuw0x9ExtA1ss6ifoo1_1280.gif',
      'https://38.media.tumblr.com/3fddc37e89a7816b9d0c87579d846927/tumblr_nvzlc6lJ1e1tsgoaxo1_400.gif',
      'https://31.media.tumblr.com/857cda58220e4e0385b50cd1eeb7e1a1/tumblr_nupppkndhc1trjy1to1_500.gif',
      'https://33.media.tumblr.com/306774e46648d466b3db79d32e71384a/tumblr_noejw1lFh61u17yx1o1_500.gif',
      'https://38.media.tumblr.com/6e2ad70241d16e492b171847c933e440/tumblr_n6nrq8wWeH1s46p8ao1_500.gif',
      'https://38.media.tumblr.com/dd27ce8f921787d863730c8a5dcfdf41/tumblr_mzz7quHGyw1spkkjwo1_500.gif',
      'https://38.media.tumblr.com/bd9b81926775c487f8f16f2b13200559/tumblr_mpolc5xTQm1rh8smko1_400.gif',
      'https://38.media.tumblr.com/a5d975ac3759f6ea6bf670c5e62529b3/tumblr_n51zp2MStM1ty5635o1_400.gif',
      'https://38.media.tumblr.com/8b91e88597acc56fd5978096b7aaf113/tumblr_n3olztMOda1rat0tqo1_400.gif',
      'https://33.media.tumblr.com/c7712f2a83a4c41f5126e0491e9f4d1c/tumblr_n6lqdnJYuG1s4fz4bo1_500.gif',
      'https://33.media.tumblr.com/b33caa83a49ba968e18e6d54b77ddf8d/tumblr_nw2m9fKsBH1qeqrhuo1_500.gif',
      'https://38.media.tumblr.com/2ef79b5b382765b175aa426b471eb640/tumblr_nvi4mwlKQz1tf7qzao1_540.gif',
      'https://38.media.tumblr.com/f7ef7e6fc713234987434ebed2c74716/tumblr_nwhbml1F4V1qfmbfwo1_1280.gif',
      'https://33.media.tumblr.com/195cdc5b21d3a8ba903980e3d989e5dd/tumblr_nvxgj1HwlU1txe8seo1_500.gif',
      'https://38.media.tumblr.com/709a75d0ab8d6aa3e341772c08646c31/tumblr_ng6qiglwnX1tchrkco1_500.gif',
      'https://38.media.tumblr.com/286a40e684ea64db3e579a6522086668/tumblr_nvs3z9Hozq1s2hovgo1_400.gif',
      'https://38.media.tumblr.com/c2b7ac932e79487efce827463079f737/tumblr_nvrxp5Yyof1uzkt7qo1_500.gif',
      'https://38.media.tumblr.com/bc2b9e4bdd95cad26820c9d3f126209e/tumblr_nwdmatDscP1sl2jlho1_500.gif',
      'https://38.media.tumblr.com/fed1e3eed7991d6878f3424ba93e6157/tumblr_nonkg2oNBC1rgiw7to1_500.gif',
      'https://38.media.tumblr.com/d6335fc614b22f2d9c99c5aba79eec96/tumblr_npndraryC11sb5osho1_540.gif',
      'https://38.media.tumblr.com/01b000f0cf0c4a0cd74f4912860fe331/tumblr_nk0js6ZlOv1r6zgh0o1_500.gif'
    ]

    //////// pipe gif base64 of image blob via service naar webapp (zonder saven dus)
    //////// enable/disable disposal method
    //////// gif syncen met beat, 1/2 bar, bar, 2 bar

    var randomGifUrl = _.sample(this.RANDOM_GIF_URLS)

    this.gif = new Gif(randomGifUrl)
    this.gif.once('preloaded', () => {

      let msPerBeat = 1000 * 60 / this.bpm

      let beatsPerLoop = this.gif.totalLengthInMs / msPerBeat
      let clampToBeats = Math.pow(2, Math.floor(Math.log(beatsPerLoop) / Math.log(2)))
      let correctedLength = clampToBeats * msPerBeat

      this.msRatio = this.gif.totalLengthInMs / correctedLength

      var str = 'BPM: <strong>' + this.bpm + '</strong>' +
        '<br>ms per beat: <strong>' + msPerBeat + '</strong>' +
        '<br>total gif ms: <strong> ' + this.gif.totalLengthInMs + '</strong>' +
        '<br>total beats in gif: <strong>' + beatsPerLoop + '</strong>' +
        '<br>floored & clamped to power of 2: <strong>' + clampToBeats + '</strong>' +
        '<br>gif corrected length (ms): <strong>' + correctedLength + '</strong>' +
        '<br>speed gif up/down with: <strong> ' + this.msRatio + ' times</strong>'
      document.getElementsByClassName('debug')[0].innerHTML = str

      // skin mesh
      if (this.mesh) {

        // set first frame
        var material = new THREE.MeshBasicMaterial({map: _.first(this.gif.frameTextures)})
        this.mesh.material = material

        // start gif loop
        this.updateGifTexture()
      }
    })
  }

  updateGifTexture() {
    var frame = this.gif.xgifdata.frames[this.currentFrame % this.gif.xgifdata.frames.length]
    var texture = this.gif.frameTextures[this.currentFrame % this.gif.frameTextures.length]
    this.mesh.material.map = texture
    setTimeout(() => {
      this.currentFrame++
      this.updateGifTexture()
    }, (frame.delay * 10) / this.msRatio)
  }

  init() {

    // renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    // camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    this.camera.position.z = 400

    // scene
    this.scene = new THREE.Scene()

    // geomertry, material & mesh
    let geometry = new THREE.BoxGeometry(300, 300, 300)
    let material = new THREE.MeshBasicMaterial({ color: '#ff0000', wireframe: true })
    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)

    // render & animation ticker
    TweenMax.ticker.fps(60)
    TweenMax.ticker.addEventListener('tick', this.tick.bind(this))

    // resize
    window.addEventListener('resize', this.resize.bind(this), false)
  }

  tick() {
    this.animate()
    this.render()
  }

  animate() {
    //this.mesh.rotation.x += 0.0025
    //this.mesh.rotation.y += 0.005
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    // update camera
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    // update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// export already created instance
export let app = new App()
