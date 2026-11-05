import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  VSMShadowMap,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShadowMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { FontLoader, type FontData } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { landing, nameAppearance as art, defaultMotion, type MotionStyle } from '../data/landing'

type ResolvedTheme = 'light' | 'dark'
export type NameScene = {
  reveal: () => void
  setPreferences: (theme: ResolvedTheme, motion: boolean) => void
  setMotionStyle: (style: MotionStyle, idle: boolean) => void
  dispose: () => void
}
type Options = {
  theme: ResolvedTheme
  motionEnabled: boolean
  signal: AbortSignal
  fontData: FontData
  motionStyle?: MotionStyle
  idle?: boolean
}
type Letter = {
  mesh: Mesh<TextGeometry, MeshStandardMaterial[]>
  baseX: number
  baseY: number
  x: number
  y: number
  vpx: number
  vpy: number
  z: number
  rx: number
  ry: number
  vz: number
  vx: number
  vy: number
}

export async function createNameScene(host: HTMLDivElement, options: Options): Promise<NameScene> {
  options.signal.throwIfAborted()
  const font = new FontLoader().parse(options.fontData)

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, art.maxPixelRatio))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = VSMShadowMap
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  renderer.domElement.className = 'name-canvas'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.dataset.interaction = 'rest'
  renderer.domElement.dataset.presses = '0'

  const scene = new Scene()
  const camera = new OrthographicCamera(-4, 4, 2, -2, 0.1, 40)
  camera.position.set(0, 0, 12)
  const root = new Group()
  scene.add(root)
  const face = new MeshStandardMaterial({ roughness: 0.34, metalness: 0.04, transparent: true })
  const side = new MeshStandardMaterial({ roughness: 0.42, metalness: 0.02, transparent: true })
  const geometryCache = new Map<string, { geometry: TextGeometry; center: Vector3 }>()
  const letters: Letter[] = []
  const rows: { group: Group; height: number; centerY: number }[] = []

  for (const [rowIndex, text] of landing.lines.entries()) {
    const row = new Group()
    const fontSize = rowIndex === 0 && landing.lines.length > 1 ? art.firstRowScale : 1
    let cursor = 0
    for (const char of text) {
      const glyph = font.data.glyphs[char]
      const advance = ((glyph?.ha ?? 350) / font.data.resolution) * fontSize
      if (char !== ' ') {
        const key = `${char}-${fontSize}`
        let cached = geometryCache.get(key)
        if (!cached) {
          const geometry = new TextGeometry(char, {
            font,
            size: fontSize,
            depth: art.depth,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: art.bevelThickness,
            bevelSize: art.bevelSize,
            bevelSegments: 4,
          })
          geometry.computeBoundingBox()
          const center = geometry.boundingBox!.getCenter(new Vector3())
          geometry.translate(-center.x, -center.y, -center.z)
          cached = { geometry, center }
          geometryCache.set(key, cached)
        }
        const mesh = new Mesh(cached.geometry, [face.clone(), side.clone()])
        mesh.position.set(cursor + cached.center.x, cached.center.y, 0)
        mesh.castShadow = true
        mesh.userData.letter = char
        row.add(mesh)
        letters.push({
          mesh,
          baseX: mesh.position.x,
          baseY: mesh.position.y,
          x: 0,
          y: 0,
          vpx: 0,
          vpy: 0,
          z: 0,
          rx: 0,
          ry: 0,
          vz: 0,
          vx: 0,
          vy: 0,
        })
      }
      cursor += advance + art.tracking
    }
    const bounds = new Box3().setFromObject(row)
    const center = bounds.getCenter(new Vector3())
    row.position.x = -center.x
    rows.push({ group: row, height: bounds.max.y - bounds.min.y, centerY: center.y })
    root.add(row)
  }
  let rowTop = (rows.reduce((sum, row) => sum + row.height, 0) + art.rowGap * (rows.length - 1)) / 2
  for (const row of rows) {
    row.group.position.y = rowTop - row.height / 2 - row.centerY
    rowTop -= row.height + art.rowGap
  }
  root.rotation.set(art.restTilt.x, art.restTilt.y, 0)
  const bounds = new Box3().setFromObject(root)
  const center = bounds.getCenter(new Vector3())
  root.position.sub(center)
  const size = bounds.getSize(new Vector3())

  scene.add(new AmbientLight(0xffffff, art.lighting.ambient))
  scene.add(new HemisphereLight(0xf0f3ff, 0x6875ad, art.lighting.hemisphere))
  const key = new DirectionalLight(0xffffff, art.lighting.key)
  key.position.set(...art.lighting.keyPosition)
  key.castShadow = true
  key.shadow.mapSize.set(art.shadow.resolution, art.shadow.resolution)
  key.shadow.radius = art.shadow.radius
  key.shadow.blurSamples = art.shadow.blurSamples
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 4, bottom: -4, near: 0.1, far: 25 })
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  scene.add(key)
  const fill = new DirectionalLight(0x98b4ff, art.lighting.fill)
  fill.position.set(...art.lighting.fillPosition)
  scene.add(fill)
  const shadowMaterial = new ShadowMaterial({ opacity: 0.15 })
  const shadowGeometry = new PlaneGeometry(40, 30)
  const shadow = new Mesh(shadowGeometry, shadowMaterial)
  shadow.position.z = art.shadow.planeDepth
  shadow.receiveShadow = true
  scene.add(shadow)
  const raycaster = new Raycaster()
  const pointer = new Vector2(10, 10)
  const projected = new Vector3()
  let inside = false
  let pressed: Letter | null = null
  let motion = options.motionEnabled
  let motionStyle = options.motionStyle ?? defaultMotion
  let idleMotion = options.idle ?? landing.idleMotion
  let currentTheme = options.theme
  let disposed = false
  let visible = true
  let frame: number | null = null
  let lastTime = 0
  let entranceStart: number | null = null
  let revealed = false
  let painted = false

  function applyTheme(theme: ResolvedTheme) {
    currentTheme = theme
    face.color.set(art[theme].face)
    side.color.set(art[theme].side)
    for (const letter of letters) {
      letter.mesh.material[0].color.copy(face.color)
      letter.mesh.material[1].color.copy(side.color)
    }
    scene.background = new Color(art[theme].background)
    shadowMaterial.opacity = art[theme].shadowOpacity
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height || disposed) return
    renderer.setSize(width, height, false)
    const aspect = width / height
    const viewHeight = Math.max(size.y * art.viewPaddingY, (size.x / aspect) * art.viewPaddingX)
    camera.left = (-viewHeight * aspect) / 2
    camera.right = (viewHeight * aspect) / 2
    // Centre the combined letter-and-shadow silhouette, leaving room below the g.
    const opticalOffset = size.y * art.opticalOffset
    camera.top = viewHeight / 2 - opticalOffset
    camera.bottom = -viewHeight / 2 - opticalOffset
    camera.updateProjectionMatrix()
    requestRender()
  }

  function requestRender() {
    if (disposed || !revealed || frame !== null || !visible || document.hidden) return
    renderer.domElement.dataset.renderState = motion ? 'active' : 'paused'
    frame = requestAnimationFrame(render)
  }

  function resetLetters() {
    inside = false
    pressed = null
    pointer.set(10, 10)
    for (const letter of letters) {
      letter.z = letter.rx = letter.ry = letter.vz = letter.vx = letter.vy = 0
      letter.x = letter.y = letter.vpx = letter.vpy = 0
      letter.mesh.position.set(letter.baseX, letter.baseY, 0)
      letter.mesh.rotation.set(0, 0, 0)
      letter.mesh.material.forEach((material) => {
        material.opacity = 1
      })
      letter.mesh.castShadow = true
    }
    renderer.domElement.dataset.interaction = 'rest'
  }

  function render(time: number) {
    frame = null
    if (disposed) return
    const dt = Math.min(lastTime ? (time - lastTime) / 1000 : 1 / 60, 1 / 30)
    lastTime = time
    const elapsed = entranceStart === null ? art.entranceMs : time - entranceStart
    const entering = motion && elapsed < art.entranceMs
    renderer.domElement.dataset.entrance = entering ? 'entering' : 'settled'
    let moving = false
    root.updateMatrixWorld(true)
    for (const [index, letter] of letters.entries()) {
      let influence = 0
      let dx = 0
      let dy = 0
      if (motion && inside) {
        letter.mesh.getWorldPosition(projected).project(camera)
        dx = pointer.x - projected.x
        dy = pointer.y - projected.y
        const distance = Math.hypot(
          (dx * (camera.right - camera.left)) / (camera.top - camera.bottom),
          dy,
        )
        influence = Math.max(0, 1 - distance / motionStyle.influenceRadius) ** 2
      }
      const wave = motion && idleMotion ? Math.sin(time * 0.0009 + index * 0.65) : 0
      const targetZ =
        pressed === letter
          ? -motionStyle.pressDepth
          : influence * motionStyle.hoverDepth + wave * 0.018
      const targetX = motion ? -Math.tanh(dx * 8) * influence * motionStyle.travelX : 0
      const targetY = motion
        ? -Math.tanh(dy * 8) * influence * motionStyle.travelY + wave * 0.025
        : 0
      const targetRX = motion
        ? -Math.max(-1, Math.min(1, dy * 4)) * influence * motionStyle.maxTilt + wave * 0.012
        : 0
      const targetRY = motion
        ? Math.max(-1, Math.min(1, dx * 4)) * influence * motionStyle.maxTilt
        : 0
      if (motion) {
        letter.vz +=
          ((targetZ - letter.z) * motionStyle.spring - letter.vz * motionStyle.damping) * dt
        letter.vx +=
          ((targetRX - letter.rx) * motionStyle.spring - letter.vx * motionStyle.damping) * dt
        letter.vy +=
          ((targetRY - letter.ry) * motionStyle.spring - letter.vy * motionStyle.damping) * dt
        letter.vpx +=
          ((targetX - letter.x) * motionStyle.spring - letter.vpx * motionStyle.damping) * dt
        letter.vpy +=
          ((targetY - letter.y) * motionStyle.spring - letter.vpy * motionStyle.damping) * dt
        letter.x += letter.vpx * dt
        letter.y += letter.vpy * dt
        letter.z += letter.vz * dt
        letter.rx += letter.vx * dt
        letter.ry += letter.vy * dt
      }
      const active =
        Math.abs(targetZ - letter.z) +
          Math.abs(targetRX - letter.rx) +
          Math.abs(targetRY - letter.ry) +
          Math.abs(targetX - letter.x) +
          Math.abs(targetY - letter.y) +
          Math.abs(letter.vz) +
          Math.abs(letter.vx) +
          Math.abs(letter.vy) +
          Math.abs(letter.vpx) +
          Math.abs(letter.vpy) >
        0.0005
      moving ||= active
      const stagger = Math.min(art.entranceStaggerMs, art.entranceMs / (letters.length * 2))
      const progress = Math.max(
        0,
        Math.min(1, (elapsed - index * stagger) / (art.entranceMs - index * stagger)),
      )
      const arrive = entering ? (1 - progress) ** 3 : 0
      const fade = entering ? Math.min(1, progress / 0.6) : 1
      const opacity = fade * fade * (3 - 2 * fade)
      letter.mesh.material.forEach((material) => {
        material.opacity = opacity
      })
      letter.mesh.castShadow = opacity > 0.45
      letter.mesh.position.set(
        letter.baseX + letter.x,
        letter.baseY + letter.y - arrive * art.entranceRise,
        letter.z + arrive * 0.55,
      )
      letter.mesh.rotation.set(
        letter.rx - arrive * 0.075,
        letter.ry + arrive * 0.12 * (index % 2 ? -1 : 1),
        0,
      )
    }
    const shadowProgress = entering ? Math.min(1, elapsed / (art.entranceMs * 0.85)) : 1
    shadowMaterial.opacity = art[currentTheme].shadowOpacity * shadowProgress
    try {
      renderer.render(scene, camera)
    } catch (error) {
      if (!painted) throw error
      host.dispatchEvent(new Event('name-renderer-lost'))
      return
    }
    painted = true
    if (entering || moving || (motion && idleMotion)) requestRender()
    else {
      entranceStart = null
      renderer.domElement.dataset.renderState = motion ? 'idle' : 'paused'
    }
  }

  function point(event: PointerEvent) {
    const rect = host.getBoundingClientRect()
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    camera.updateMatrixWorld()
    root.updateMatrixWorld(true)
  }
  function onMove(event: PointerEvent) {
    if (!motion) return
    point(event)
    inside = true
    renderer.domElement.dataset.interaction = pressed ? 'pressed' : 'hover'
    requestRender()
  }
  function onDown(event: PointerEvent) {
    if (!motion || !event.isPrimary) return
    point(event)
    inside = true
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(
      letters.map((letter) => letter.mesh),
      false,
    )[0]
    pressed = hit ? (letters.find((letter) => letter.mesh === hit.object) ?? null) : null
    if (pressed) {
      host.setPointerCapture(event.pointerId)
      renderer.domElement.dataset.presses = String(Number(renderer.domElement.dataset.presses) + 1)
    }
    renderer.domElement.dataset.interaction = pressed ? 'pressed' : 'hover'
    requestRender()
  }
  function onUp(event: PointerEvent) {
    if (pressed && motion && event.type !== 'pointercancel')
      pressed.vz += motionStyle.releaseImpulse
    pressed = null
    const rect = host.getBoundingClientRect()
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    if (event.pointerType !== 'mouse' || event.type === 'pointercancel' || outside) {
      inside = false
      pointer.set(10, 10)
    }
    renderer.domElement.dataset.interaction = inside ? 'hover' : 'rest'
    requestRender()
  }
  function onLeave() {
    if (pressed) return
    inside = false
    pointer.set(10, 10)
    renderer.domElement.dataset.interaction = 'rest'
    requestRender()
  }
  function visibilityChanged() {
    if (document.hidden || !visible) {
      inside = false
      pressed = null
      pointer.set(10, 10)
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      lastTime = 0
      renderer.domElement.dataset.renderState = 'hidden'
    } else {
      lastTime = 0
      requestRender()
    }
  }
  function contextLost(event: Event) {
    event.preventDefault()
    host.dispatchEvent(new Event('name-renderer-lost'))
  }

  host.appendChild(renderer.domElement)
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerdown', onDown)
  host.addEventListener('pointerup', onUp)
  host.addEventListener('pointercancel', onUp)
  host.addEventListener('pointerleave', onLeave)
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', visibilityChanged)
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    visibilityChanged()
  })
  intersection.observe(host)
  applyTheme(options.theme)
  resize()
  const controller: NameScene = {
    reveal() {
      if (disposed || revealed) return
      revealed = true
      entranceStart = motion ? performance.now() : null
      lastTime = 0
      render(performance.now())
    },
    setMotionStyle(style, idle) {
      if (disposed) return
      motionStyle = style
      idleMotion = idle
      renderer.domElement.dataset.motionStyle = style.id
      requestRender()
    },
    setPreferences(theme, enabled) {
      if (disposed) return
      if (currentTheme !== theme) applyTheme(theme)
      if (motion !== enabled) {
        motion = enabled
        entranceStart = null
        lastTime = 0
        resetLetters()
      }
      requestRender()
    },
    dispose() {
      if (disposed) return
      disposed = true
      options.signal.removeEventListener('abort', controller.dispose)
      if (frame !== null) cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', visibilityChanged)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointerup', onUp)
      host.removeEventListener('pointercancel', onUp)
      host.removeEventListener('pointerleave', onLeave)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      geometryCache.forEach(({ geometry }) => geometry.dispose())
      letters.forEach(({ mesh }) => mesh.material.forEach((material) => material.dispose()))
      face.dispose()
      side.dispose()
      shadowGeometry.dispose()
      shadowMaterial.dispose()
      key.shadow.map?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      scene.clear()
    },
  }
  // Warm up the GPU before revealing the canvas. The entrance clock starts
  // after React exposes it, so shader compilation cannot skip the animation.
  options.signal.addEventListener('abort', controller.dispose, { once: true })
  try {
    await renderer.compileAsync(scene, camera)
    options.signal.throwIfAborted()
    render(performance.now())
  } catch (error) {
    controller.dispose()
    throw error
  }
  return controller
}
