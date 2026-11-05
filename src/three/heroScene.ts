import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export interface HeroSceneHandle {
  setPointer(x: number, y: number): void
  setScroll(progress: number): void
  setActive(active: boolean): void
  dispose(): void
}

function radialAlphaTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grd.addColorStop(0, '#ffffff')
  grd.addColorStop(0.3, '#b0b0b0')
  grd.addColorStop(0.7, '#202020')
  grd.addColorStop(1, '#000000')
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

/**
 * Abstract hero composition: chrome sphere, glass forms, brushed capsule and
 * orbital rings with two accent satellites. Slow rotation, pointer tilt,
 * scroll drift, soft shadows in a light pool that fades into the page.
 */
export function createHeroScene(canvas: HTMLCanvasElement, opts: { onReady?: () => void } = {}): HeroSceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  scene.environmentIntensity = 0.6

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  camera.position.set(0, 0.55, 9.2)
  camera.lookAt(0, -0.15, 0)

  // ── Lights ────────────────────────────────────────────
  const key = new THREE.SpotLight(0xfff0de, 260, 30, 0.42, 0.85, 2)
  key.position.set(-3.2, 6.5, 4.2)
  key.target.position.set(0, -1, 0)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.bias = -0.0004
  key.shadow.radius = 10
  key.shadow.blurSamples = 16
  key.shadow.camera.near = 2
  key.shadow.camera.far = 20
  scene.add(key, key.target)

  const rim = new THREE.PointLight(0xff5a36, 18, 12, 2)
  rim.position.set(3.2, 1.4, -2.4)
  scene.add(rim)

  const fill = new THREE.DirectionalLight(0xb9c6ff, 0.35)
  fill.position.set(4, 2, 5)
  scene.add(fill)

  // ── Materials ─────────────────────────────────────────
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe9e5dd, metalness: 1, roughness: 0.13 })
  const ringMat = new THREE.MeshPhysicalMaterial({ color: 0xd8d4cc, metalness: 1, roughness: 0.22 })
  // Glass is faked with layered transparent shells instead of transmission:
  // it reads consistently across GPUs (and software renderers) at a fraction of the cost.
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 0,
    roughness: 0.03,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 3.2,
    specularIntensity: 1,
    ior: 1.6,
    iridescence: 0.5,
    iridescenceIOR: 1.35,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const glassBack = new THREE.MeshPhysicalMaterial({
    color: 0x7d8799,
    metalness: 0,
    roughness: 0.18,
    transparent: true,
    opacity: 0.14,
    side: THREE.BackSide,
    envMapIntensity: 1.4,
    depthWrite: false,
  })
  const brushed = new THREE.MeshPhysicalMaterial({ color: 0x2a2f37, metalness: 0.92, roughness: 0.34, clearcoat: 0.4 })
  const orange = new THREE.MeshPhysicalMaterial({ color: 0xff5a36, roughness: 0.28, metalness: 0.05, clearcoat: 1, emissive: 0xff3c12, emissiveIntensity: 0.18 })
  const lime = new THREE.MeshPhysicalMaterial({ color: 0xd6ff52, roughness: 0.3, emissive: 0xb6e030, emissiveIntensity: 0.35 })

  // ── Composition ───────────────────────────────────────
  const root = new THREE.Group()
  const spin = new THREE.Group()
  root.add(spin)
  scene.add(root)

  const shadowed = (m: THREE.Mesh) => {
    m.castShadow = true
    m.receiveShadow = true
    return m
  }

  const sphere = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.95, 96, 64), chrome))
  sphere.position.set(0.3, 0.22, 0)
  spin.add(sphere)

  const cubeGeo = new RoundedBoxGeometry(1.05, 1.05, 1.05, 6, 0.2)
  const cube = new THREE.Mesh(cubeGeo, glass)
  cube.castShadow = true
  cube.add(new THREE.Mesh(cubeGeo, glassBack))
  cube.position.set(-1.05, -0.78, 0.85)
  cube.rotation.set(0.42, 0.72, 0.18)
  spin.add(cube)

  const bubbleGeo = new THREE.SphereGeometry(0.3, 64, 48)
  const bubble = new THREE.Mesh(bubbleGeo, glass)
  bubble.add(new THREE.Mesh(bubbleGeo, glassBack))
  bubble.position.set(-1.25, 1.15, -0.5)
  spin.add(bubble)

  const capsule = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.25, 12, 32), brushed))
  capsule.position.set(1.55, -0.9, 0.55)
  capsule.rotation.set(0.2, 0, 0.95)
  spin.add(capsule)

  const ring1Pivot = new THREE.Group()
  ring1Pivot.position.copy(sphere.position)
  ring1Pivot.rotation.set(1.22, 0.32, 0)
  spin.add(ring1Pivot)
  ring1Pivot.add(shadowed(new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.017, 16, 220), ringMat)))

  const ring2Pivot = new THREE.Group()
  ring2Pivot.position.copy(sphere.position)
  ring2Pivot.rotation.set(1.78, -0.1, 0.55)
  spin.add(ring2Pivot)
  ring2Pivot.add(shadowed(new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.007, 12, 260), ringMat)))

  const sat1 = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.12, 48, 32), orange))
  ring1Pivot.add(sat1)
  const sat2 = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.055, 32, 24), lime))
  ring2Pivot.add(sat2)

  // Light pool on the floor that fades into the page background
  const floorAlpha = radialAlphaTexture()
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0x1c2027, roughness: 0.95, metalness: 0, transparent: true, alphaMap: floorAlpha, depthWrite: false }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.78
  floor.receiveShadow = true
  scene.add(floor)

  // ── State ─────────────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let scroll = 0
  let scrollSmoothed = 0
  let active = true
  let raf = 0
  let last = performance.now()
  let time = 0
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Keep the composition framed on narrower canvases
    camera.position.z = w / h < 0.95 ? 9.2 / (w / h) * 0.95 : 9.6
    // On wide canvases nudge the composition away from the headline (left side)
    root.position.x = w / h > 0.85 ? 0.38 : 0
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const bob = (o: THREE.Object3D, base: THREE.Vector3, amp: number, speed: number, phase: number) => {
    o.position.y = base.y + Math.sin(time * speed + phase) * amp
  }
  const bases = new Map<THREE.Object3D, THREE.Vector3>([cube, bubble, capsule, sphere].map((o) => [o, o.position.clone()]))

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (!active) {
      last = now
      return
    }
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    time += reduce ? 0 : dt

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3)
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3)
    scrollSmoothed += (scroll - scrollSmoothed) * Math.min(1, dt * 5)

    spin.rotation.y = time * 0.11 + scrollSmoothed * 0.9
    root.rotation.y = pointer.x * 0.32
    root.rotation.x = pointer.y * 0.14 + scrollSmoothed * 0.18
    root.position.y = scrollSmoothed * 0.9

    bob(sphere, bases.get(sphere)!, 0.05, 0.8, 0)
    bob(cube, bases.get(cube)!, 0.09, 0.7, 1.4)
    bob(bubble, bases.get(bubble)!, 0.12, 0.9, 2.2)
    bob(capsule, bases.get(capsule)!, 0.07, 0.6, 3.1)
    cube.rotation.x = 0.42 + time * 0.12
    cube.rotation.y = 0.72 + time * 0.09
    capsule.rotation.y = time * 0.25

    const a1 = time * 0.55
    sat1.position.set(Math.cos(a1) * 1.62, Math.sin(a1) * 1.62, 0)
    const a2 = -time * 0.32 + 2
    sat2.position.set(Math.cos(a2) * 2.08, Math.sin(a2) * 2.08, 0)

    renderer.render(scene, camera)
  }

  // First frame synchronously-ish, then notify
  requestAnimationFrame((now) => {
    last = now
    renderer.render(scene, camera)
    opts.onReady?.()
    raf = requestAnimationFrame(frame)
  })

  return {
    setPointer(x, y) {
      pointer.tx = x
      pointer.ty = y
    },
    setScroll(p) {
      scroll = p
    },
    setActive(a) {
      active = a
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mat = m.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(mat) ? mat : [mat]).forEach((mm) => mm.dispose())
        }
      })
      floorAlpha.dispose()
      envRT.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
