import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

import { DURATION, moods, type Mood, type NoireHandle } from './config'

export { DURATION, moods, type Mood, type NoireHandle }

interface Options {
  onFrame?: (t: number) => void
  /** horizontal framing for a given time: -1 (bottle left) … 1 (bottle right) */
  framingAt?: (t: number) => number
  onReady?: () => void
  reducedMotion?: boolean
  maxDpr?: number
}

async function labelTexture(renderer: THREE.WebGLRenderer) {
  try {
    await Promise.all([document.fonts.load('500 120px "Bodoni Moda Variable"'), document.fonts.load('400 40px "IBM Plex Mono"')])
  } catch {
    /* fall back to serif */
  }
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 640
  const g = c.getContext('2d')!
  g.clearRect(0, 0, c.width, c.height)
  g.fillStyle = '#ffffff'
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  g.font = '500 178px "Bodoni Moda Variable", "Bodoni 72", Didot, serif'
  ;(g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '18px'
  g.fillText('NOIRÉ', 512, 330)
  g.fillRect(392, 392, 240, 3)
  g.font = '400 40px "IBM Plex Mono", monospace'
  ;(g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '14px'
  g.fillText('EAU DE PARFUM', 512, 470)
  g.font = '400 30px "IBM Plex Mono", monospace'
  g.fillText('50 ML · 1.7 FL. OZ.', 512, 530)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

function floorAlpha() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grd.addColorStop(0, '#fff')
  grd.addColorStop(0.35, '#888')
  grd.addColorStop(1, '#000')
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

const smooth = (x: number) => x * x * (3 - 2 * x)

/**
 * Real-time perfume film: procedural bottle, physical glass and liquid,
 * a directed 24-second camera path, three lighting moods and drag-to-rotate.
 */
export function createNoireScene(canvas: HTMLCanvasElement, opts: Options = {}): NoireHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  const maxDpr = opts.maxDpr ?? 1.5
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  renderer.setPixelRatio(dpr)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  const bg = new THREE.Color(moods.amber.bg)
  scene.background = bg
  scene.fog = new THREE.Fog(bg, 9, 22)

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60)

  // ── Lights ──────────────────────────────────────────────
  const key = new THREE.SpotLight(moods.amber.key, moods.amber.keyI, 20, 0.5, 0.85, 2)
  key.position.set(-3.2, 5.2, 3.6)
  key.target.position.set(0, 0.8, 0)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.bias = -0.0005
  key.shadow.radius = 6
  key.shadow.camera.near = 2
  key.shadow.camera.far = 14
  scene.add(key, key.target)

  const rimA = new THREE.SpotLight(moods.amber.rimA, 90, 14, 0.55, 0.9, 2)
  rimA.position.set(-3, 2.4, -3.2)
  rimA.target.position.set(0, 1, 0)
  const rimB = new THREE.SpotLight(moods.amber.rimB, 70, 14, 0.55, 0.9, 2)
  rimB.position.set(3.4, 2, -2.6)
  rimB.target.position.set(0, 1, 0)
  scene.add(rimA, rimA.target, rimB, rimB.target)

  const glowLight = new THREE.PointLight(moods.amber.glow, 3, 4, 2)
  glowLight.position.set(0, 0.6, 0)
  scene.add(glowLight)

  // ── Materials ───────────────────────────────────────────
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.035,
    transmission: 1,
    thickness: 0.55,
    ior: 1.5,
    attenuationColor: new THREE.Color('#fff4e6'),
    attenuationDistance: 4,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    specularIntensity: 1,
    envMapIntensity: 1.6,
  })
  const liquid = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(moods.amber.liquid),
    roughness: 0.08,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    emissive: new THREE.Color(moods.amber.liquid),
    emissiveIntensity: 0.32,
    sheen: 0.4,
    sheenColor: new THREE.Color(moods.amber.glow),
  })
  const gold = new THREE.MeshPhysicalMaterial({ color: '#d8b06a', metalness: 1, roughness: 0.22, clearcoat: 0.3 })
  const lacquer = new THREE.MeshPhysicalMaterial({ color: '#0a0909', metalness: 0.2, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05 })
  const stone = new THREE.MeshStandardMaterial({ color: '#141114', roughness: 0.55, metalness: 0.1 })

  // ── Bottle ──────────────────────────────────────────────
  const bottle = new THREE.Group()
  scene.add(bottle)
  const W = 1.25
  const H = 1.55
  const D = 0.62

  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 8, 0.14), glass)
  body.position.y = H / 2
  body.castShadow = true
  bottle.add(body)

  const fill = 0.74
  const innerH = H - 0.32
  const liquidMesh = new THREE.Mesh(new RoundedBoxGeometry(W - 0.2, innerH * fill, D - 0.18, 6, 0.09), liquid)
  liquidMesh.position.y = 0.18 + (innerH * fill) / 2
  bottle.add(liquidMesh)

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.14, 48), glass)
  neck.position.y = H + 0.06
  bottle.add(neck)

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.11, 64), gold)
  collar.position.y = H + 0.17
  collar.castShadow = true
  bottle.add(collar)

  const capGroup = new THREE.Group()
  capGroup.position.y = H + 0.22
  bottle.add(capGroup)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.64, 8, 1), lacquer)
  cap.position.y = 0.32
  cap.rotation.y = Math.PI / 8
  cap.castShadow = true
  capGroup.add(cap)
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.36, 0.035, 8, 1), gold)
  capTop.position.y = 0.66
  capTop.rotation.y = Math.PI / 8
  capGroup.add(capTop)
  const capRing = new THREE.Mesh(new THREE.CylinderGeometry(0.365, 0.365, 0.03, 8, 1), gold)
  capRing.position.y = 0.04
  capRing.rotation.y = Math.PI / 8
  capGroup.add(capRing)

  const labelMat = new THREE.MeshPhysicalMaterial({ color: '#e7c48a', metalness: 1, roughness: 0.3, transparent: true, alphaTest: 0.02, depthWrite: false })
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.49), labelMat)
  label.position.set(0, H * 0.56, D / 2 + 0.002)
  label.visible = false
  bottle.add(label)
  labelTexture(renderer).then((tex) => {
    labelMat.alphaMap = tex
    labelMat.needsUpdate = true
    label.visible = true
  })

  // ── Set ─────────────────────────────────────────────────
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.52, 0.42, 96), stone)
  plinth.position.y = -0.21
  plinth.receiveShadow = true
  scene.add(plinth)
  const alpha = floorAlpha()
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshStandardMaterial({ color: '#0f0d0e', roughness: 0.9, transparent: true, alphaMap: alpha, depthWrite: false }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.42
  floor.receiveShadow = true
  scene.add(floor)

  // ── Camera path (closed loop = seamless replay) ─────────
  const camPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 1.0, 8.2),
      new THREE.Vector3(3.6, 1.7, 6.0),
      new THREE.Vector3(1.2, 1.15, 3.4),
      new THREE.Vector3(-1.4, 3.0, 3.6),
      new THREE.Vector3(-3.9, 0.55, 5.4),
      new THREE.Vector3(-1.8, 0.8, 7.6),
    ],
    true,
    'centripetal',
  )
  const lookPath = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(0, 1.05, 0), new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(0, 1.75, 0), new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(0, 1.05, 0)],
    true,
    'centripetal',
  )
  const camPos = new THREE.Vector3()
  const camLook = new THREE.Vector3()

  // ── State ───────────────────────────────────────────────
  let t = 0
  let playing = !opts.reducedMotion
  let active = true
  let raf = 0
  let last = performance.now()
  let disposed = false
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  const drag = { on: false, x: 0, y: 0, yaw: 0, pitch: 0, vel: 0, vpitch: 0, idle: 0 }
  const mood = { from: moods.amber, to: moods.amber, k: 1 }
  const cur = {
    bg: new THREE.Color(moods.amber.bg),
    key: new THREE.Color(),
    rimA: new THREE.Color(),
    rimB: new THREE.Color(),
    liquid: new THREE.Color(),
    glow: new THREE.Color(),
  }
  const tmpA = new THREE.Color()
  const tmpB = new THREE.Color()
  const mix = (out: THREE.Color, a: string, b: string, k: number) => out.copy(tmpA.set(a)).lerp(tmpB.set(b), k)

  const applyMood = (dt: number) => {
    if (mood.k < 1) mood.k = Math.min(1, mood.k + dt / 1.1)
    const k = smooth(mood.k)
    const f = mood.from
    const to = mood.to
    mix(cur.bg, f.bg, to.bg, k)
    bg.copy(cur.bg)
    ;(scene.fog as THREE.Fog).color.copy(cur.bg)
    key.color.copy(mix(cur.key, f.key, to.key, k))
    key.intensity = THREE.MathUtils.lerp(f.keyI, to.keyI, k)
    rimA.color.copy(mix(cur.rimA, f.rimA, to.rimA, k))
    rimB.color.copy(mix(cur.rimB, f.rimB, to.rimB, k))
    mix(cur.liquid, f.liquid, to.liquid, k)
    liquid.color.copy(cur.liquid)
    liquid.emissive.copy(cur.liquid)
    liquid.sheenColor.copy(mix(cur.glow, f.glow, to.glow, k))
    glowLight.color.copy(cur.glow)
    scene.environmentIntensity = THREE.MathUtils.lerp(f.env, to.env, k)
  }
  applyMood(0)

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // keep the bottle comfortably framed on portrait screens
    camera.fov = w / h < 1 ? 28 / Math.max(0.62, w / h) : 28
    applyFraming()
  }
  let shift = 0
  const applyFraming = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    const portrait = w / h < 1.1
    // screen-space offset keeps the bottle clear of the chapter text whatever the camera angle
    camera.setViewOffset(w, h, portrait ? 0 : -shift * w * 0.2, portrait ? -h * 0.1 : 0, w, h)
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // ── Interaction ─────────────────────────────────────────
  const onDown = (e: PointerEvent) => {
    drag.on = true
    drag.x = e.clientX
    drag.y = e.clientY
    drag.vel = 0
    drag.vpitch = 0
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'grabbing'
  }
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
    if (!drag.on) return
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    drag.x = e.clientX
    drag.y = e.clientY
    drag.vel = dx * 0.009
    drag.vpitch = dy * 0.004
    drag.yaw += drag.vel
    drag.pitch = THREE.MathUtils.clamp(drag.pitch + drag.vpitch, -0.35, 0.35)
    drag.idle = 0
  }
  const onUp = (e: PointerEvent) => {
    drag.on = false
    drag.idle = 0
    canvas.style.cursor = 'grab'
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
  }
  const onLeave = () => {
    pointer.x = 0
    pointer.y = 0
  }
  canvas.style.cursor = 'grab'
  canvas.style.touchAction = 'pan-y'
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointerleave', onLeave)

  // ── Loop ────────────────────────────────────────────────
  let slowFrames = 0
  let sampled = 0
  const frame = (now: number) => {
    if (disposed) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!active) return

    // adaptive resolution: step down if we keep missing ~40fps
    sampled++
    if (dt > 1 / 38) slowFrames++
    if (sampled >= 90) {
      if (slowFrames > 45 && dpr > 0.75) {
        dpr = Math.max(0.75, dpr - 0.25)
        resize()
      }
      sampled = 0
      slowFrames = 0
    }

    if (playing && !drag.on) t = (t + dt) % DURATION
    applyMood(dt)

    // inertia + gentle return to the film's framing
    if (!drag.on) {
      drag.yaw += drag.vel
      drag.vel *= Math.pow(0.04, dt)
      drag.idle += dt
      if (drag.idle > 2.2) {
        const home = Math.round(drag.yaw / (Math.PI * 2)) * Math.PI * 2
        drag.yaw += (home - drag.yaw) * Math.min(1, dt * 1.2)
        drag.pitch += (0 - drag.pitch) * Math.min(1, dt * 1.5)
      }
    }

    const targetShift = opts.framingAt?.(t) ?? 0
    shift += (targetShift - shift) * Math.min(1, dt * 1.6)
    applyFraming()

    const u = t / DURATION
    camPath.getPointAt(u, camPos)
    lookPath.getPointAt(u, camLook)
    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 2.5)
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 2.5)
    camPos.x += pointer.sx * 0.25
    camPos.y -= pointer.sy * 0.15
    camera.position.copy(camPos)
    camera.lookAt(camLook)

    bottle.rotation.y = Math.sin(u * Math.PI * 2) * 0.35 + drag.yaw
    bottle.rotation.x = drag.pitch * 0.6

    // light sweep across the glass
    const sweep = Math.sin(u * Math.PI * 4)
    key.position.x = -3.2 + sweep * 1.6
    rimA.intensity = 80 + Math.sin(u * Math.PI * 6) * 25
    glowLight.intensity = 2.4 + Math.sin(now / 900) * 0.6

    renderer.render(scene, camera)
    opts.onFrame?.(t)
  }

  requestAnimationFrame((now) => {
    last = now
    resize()
    renderer.render(scene, camera)
    opts.onReady?.()
    raf = requestAnimationFrame(frame)
  })

  return {
    setMood(m) {
      mood.from = { ...mood.to }
      // start the blend from the colours currently on screen
      mood.from.bg = `#${cur.bg.getHexString()}`
      mood.from.key = `#${cur.key.getHexString()}`
      mood.from.rimA = `#${cur.rimA.getHexString()}`
      mood.from.rimB = `#${cur.rimB.getHexString()}`
      mood.from.liquid = `#${cur.liquid.getHexString()}`
      mood.from.glow = `#${cur.glow.getHexString()}`
      mood.to = moods[m]
      mood.k = 0
    },
    setPlaying(p) {
      playing = p
    },
    replay() {
      t = 0
      drag.yaw = 0
      drag.vel = 0
      playing = true
    },
    seek(v) {
      t = ((v % DURATION) + DURATION) % DURATION
    },
    setActive(a) {
      active = a
      if (a) last = performance.now()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mat = m.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(mat) ? mat : [mat]).forEach((mm) => mm.dispose())
        }
      })
      labelMat.alphaMap?.dispose()
      alpha.dispose()
      envRT.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
