// Jersey Customizer JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Configuration object to store all jersey customization settings
    const config = {
      jerseyType: "tshirt",
      currentView: "front",
      primaryColor: "#ff0000",
      secondaryColor: "#000000",
      pattern: "none",
      frontNumber: "",
      backName: "",
      backNumber: "",
      textColor: "#000000",
      logo: null,
      logoSize: 0.5,
      frontNumberPosition: { x: 0, y: 0 },
      backNamePosition: { x: 0, y: 0.2 },
      backNumberPosition: { x: 0, y: 0 },
      logoPosition: { x: 0, y: 0.2 },
    }
  
    // Three.js variables
    let scene, camera, renderer, controls
    let jersey, bodyMaterial, sleeveMaterial
    let frontNumberMesh, backNameMesh, backNumberMesh, logoMesh
    let gridHelper
  
    // DOM elements
    const canvasContainer = document.getElementById("canvas-container")
    const jerseyTypeSelect = document.getElementById("jersey-type")
    const frontViewBtn = document.getElementById("front-view")
    const backViewBtn = document.getElementById("back-view")
    const primaryColorInput = document.getElementById("primary-color")
    const secondaryColorInput = document.getElementById("secondary-color")
    const patternSelect = document.getElementById("pattern")
    const frontNumberInput = document.getElementById("front-number")
    const backNameInput = document.getElementById("back-name")
    const backNumberInput = document.getElementById("back-number")
    const textColorInput = document.getElementById("text-color")
    const logoUpload = document.getElementById("logo-upload")
    const logoSizeInput = document.getElementById("logo-size")
    const frontOptions = document.getElementById("front-options")
    const backOptions = document.getElementById("back-options")
    const logoOptions = document.getElementById("logo-options")
    const resetViewBtn = document.getElementById("reset-view")
    const clearAllBtn = document.getElementById("clear-all")
    const downloadDesignBtn = document.getElementById("download-design")
  
    // Position sliders
    const frontNumberXSlider = document.getElementById("front-number-x")
    const frontNumberYSlider = document.getElementById("front-number-y")
    const backNameXSlider = document.getElementById("back-name-x")
    const backNameYSlider = document.getElementById("back-name-y")
    const backNumberXSlider = document.getElementById("back-number-x")
    const backNumberYSlider = document.getElementById("back-number-y")
    const logoXSlider = document.getElementById("logo-x")
    const logoYSlider = document.getElementById("logo-y")
  
    // Initialize Three.js scene
    function initScene() {
      // Create scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a202c)
  
      // Create camera
      camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000)
      camera.position.z = 2
  
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      canvasContainer.appendChild(renderer.domElement)
  
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)
  
      // Add grid helper
      gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444)
      gridHelper.position.y = -1
      scene.add(gridHelper)
  
      // Add orbit controls with rotation limits
      controls = new THREE.OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 1
      controls.maxDistance = 5
      // Limit rotation to only 2 axes (X and Y)
      controls.minPolarAngle = 0
      controls.maxPolarAngle = Math.PI / 0
  
      // Load jersey model
      loadJerseyModel()
  
      // Handle window resize
      window.addEventListener("resize", onWindowResize)
  
      // Start animation loop
      animate()
    }
  
    // Load jersey model based on selected type
    function loadJerseyModel() {
      const loader = new THREE.GLTFLoader()
      const modelPath = "/static/jersey_customizer/models/t_shirt.gltf"
  
      // Remove existing jersey if any
      if (jersey) {
        scene.remove(jersey)
      }
  
      loader.load(modelPath, (gltf) => {
        jersey = gltf.scene
  
        // Position the jersey in the center of the viewport
        jersey.position.set(0, -1.4, 0.5)
  
        scene.add(jersey)
  
        // Apply initial primary color to all meshes
        jersey.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: config.primaryColor })
          }
        })
  
        // Create text and logo elements
        createTextElements()
  
        // Update jersey rotation based on current view
        updateJerseyRotation()
      })
    }
  
    // Create text and logo elements
    function createTextElements() {
      // Remove existing text elements
      if (frontNumberMesh) scene.remove(frontNumberMesh)
      if (backNameMesh) scene.remove(backNameMesh)
      if (backNumberMesh) scene.remove(backNumberMesh)
      if (logoMesh) scene.remove(logoMesh)
  
      // Create front number
      if (config.frontNumber) {
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = config.textColor
        ctx.font = "bold 150px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(config.frontNumber, 128, 128)
  
        const texture = new THREE.CanvasTexture(canvas)
        const geometry = new THREE.PlaneGeometry(0.3, 0.3)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        })
  
        frontNumberMesh = new THREE.Mesh(geometry, material)
        // Attach to jersey so it moves with it
        jersey.add(frontNumberMesh)
        // Position relative to jersey
        frontNumberMesh.position.set(config.frontNumberPosition.x, config.frontNumberPosition.y, 0.01)
        frontNumberMesh.rotation.y = Math.PI // Ensure it faces forward
      }
  
      // Create back name
      if (config.backName) {
        const canvas = document.createElement("canvas")
        canvas.width = 512
        canvas.height = 128
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = config.textColor
        ctx.font = "bold 80px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(config.backName.toUpperCase(), 256, 64)
  
        const texture = new THREE.CanvasTexture(canvas)
        const geometry = new THREE.PlaneGeometry(0.5, 0.125)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        })
  
        backNameMesh = new THREE.Mesh(geometry, material)
        // Attach to jersey so it moves with it
        jersey.add(backNameMesh)
        // Position relative to jersey
        backNameMesh.position.set(config.backNamePosition.x, config.backNamePosition.y, -0.01)
      }
  
      // Create back number
      if (config.backNumber) {
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = config.textColor
        ctx.font = "bold 150px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(config.backNumber, 128, 128)
  
        const texture = new THREE.CanvasTexture(canvas)
        const geometry = new THREE.PlaneGeometry(0.3, 0.3)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        })
  
        backNumberMesh = new THREE.Mesh(geometry, material)
        // Attach to jersey so it moves with it
        jersey.add(backNumberMesh)
        // Position relative to jersey
        backNumberMesh.position.set(config.backNumberPosition.x, config.backNumberPosition.y, -0.01)
      }
  
      // Create logo if available
      if (config.logo) {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.crossOrigin = "anonymous"
        textureLoader.load(config.logo, (texture) => {
          const aspectRatio = texture.image.width / texture.image.height
          const geometry = new THREE.PlaneGeometry(
            0.3 * config.logoSize * (aspectRatio > 1 ? aspectRatio : 1),
            0.3 * config.logoSize * (aspectRatio < 1 ? 1 / aspectRatio : 1),
          )
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          })
  
          logoMesh = new THREE.Mesh(geometry, material)
          // Attach to jersey so it moves with it
          jersey.add(logoMesh)
          // Position relative to jersey
          logoMesh.position.set(config.logoPosition.x, config.logoPosition.y, 0.01)
        })
      }
  
      // Update visibility based on current view
      updateElementsVisibility()
    }
  
    // Update jersey rotation based on current view
    function updateJerseyRotation() {
      if (!jersey) return
  
      const targetRotation = config.currentView === "front" ? 0 : Math.PI
      jersey.rotation.y = targetRotation
    }
  
    // Update elements visibility based on current view
    function updateElementsVisibility() {
      if (frontNumberMesh) {
        frontNumberMesh.visible = config.currentView === "front"
      }
  
      if (backNameMesh) {
        backNameMesh.visible = config.currentView === "back"
      }
  
      if (backNumberMesh) {
        backNumberMesh.visible = config.currentView === "back"
      }
  
      // Update UI panels
      if (config.currentView === "front") {
        frontOptions.style.display = "block"
        backOptions.style.display = "none"
        frontViewBtn.classList.add("bg-blue-600", "text-white")
        frontViewBtn.classList.remove("bg-gray-200", "text-gray-600")
        backViewBtn.classList.add("bg-gray-200", "text-gray-600")
        backViewBtn.classList.remove("bg-blue-600", "text-white")
      } else {
        frontOptions.style.display = "none"
        backOptions.style.display = "block"
        frontViewBtn.classList.add("bg-gray-200", "text-gray-600")
        frontViewBtn.classList.remove("bg-blue-600", "text-white")
        backViewBtn.classList.add("bg-blue-600", "text-white")
        backViewBtn.classList.remove("bg-gray-200", "text-gray-600")
      }
    }
  
    // Handle window resize
    function onWindowResize() {
      camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight)
    }
  
    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
  
    // Multi-view download function
    async function downloadMultiViewDesign() {
      // Store original camera position and rotation
      const originalPosition = camera.position.clone()
      const originalRotation = jersey ? jersey.rotation.clone() : new THREE.Euler()
      const originalControlsEnabled = controls.enabled
  
      // Disable controls during capture
      controls.enabled = false
  
      // Define the views to capture
      const views = [
        { name: "front", position: [0, 0, 2.5], rotation: 0 },
        { name: "angle", position: [1.5, 0, 2], rotation: -Math.PI / 2},
        { name: "back", position: [0, 0, 2.5], rotation: Math.PI },
      ]
  
      // Create a canvas for the final layout
      const finalCanvas = document.createElement("canvas")
      const ctx = finalCanvas.getContext("2d")
  
      // Set canvas size for 3 views side by side
      finalCanvas.width = 1920 // 640 * 3
      finalCanvas.height = 640
  
      // Capture each view
      for (let i = 0; i < views.length; i++) {
        const view = views[i]
  
        // Set jersey rotation based on view
        if (jersey) {
          jersey.rotation.y = view.rotation
        }
  
        // Position camera for this view
        camera.position.set(view.position[0], view.position[1], view.position[2])
  
        // Update visibility of elements based on view
        if (frontNumberMesh) frontNumberMesh.visible = view.name !== "back"
        if (backNameMesh) backNameMesh.visible = view.name === "back"
        if (backNumberMesh) backNumberMesh.visible = view.name === "back"
  
        // Render the scene
        renderer.render(scene, camera)
  
        // Get the image data
        const imageData = renderer.domElement.toDataURL("image/png")
  
        // Load the image
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = imageData
        })
  
        // Draw the image to the final canvas
        ctx.drawImage(img, i * 640, 0, 640, 640)
      }
  
      // Restore original camera position and controls
      camera.position.copy(originalPosition)
      if (jersey) jersey.rotation.copy(originalRotation)
      controls.enabled = originalControlsEnabled
  
      // Download the combined image
      const link = document.createElement("a")
      link.download = "jersey-design.png"
      link.href = finalCanvas.toDataURL("image/png")
      link.click()
    }
  
    // Event listeners for UI controls
    jerseyTypeSelect.addEventListener("change", function () {
      config.jerseyType = this.value
  
      // Update sleeve visibility based on jersey type
      if (jersey) {
        jersey.traverse((child) => {
          if (child.isMesh && (child.name === "Sleeves" || child.name.includes("Sleeve"))) {
            child.visible = config.jerseyType !== "sleeveless"
          }
        })
      }
    })
  
    frontViewBtn.addEventListener("click", () => {
      config.currentView = "front"
      updateJerseyRotation()
      updateElementsVisibility()
    })
  
    backViewBtn.addEventListener("click", () => {
      config.currentView = "back"
      updateJerseyRotation()
      updateElementsVisibility()
    })
  
    primaryColorInput.addEventListener("input", function () {
      config.primaryColor = this.value
      if (jersey) {
        jersey.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: config.primaryColor })
          }
        })
      }
    })
  
    secondaryColorInput.addEventListener("input", function () {
      config.secondaryColor = this.value
      if (jersey) {
        // For now, apply secondary to all as fallback; refine if sleeves identifiable
        jersey.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: config.secondaryColor })
          }
        })
      }
    })
  
    patternSelect.addEventListener("change", function () {
      config.pattern = this.value
      // Apply pattern to jersey (implementation depends on available patterns)
    })
  
    frontNumberInput.addEventListener("input", function () {
      config.frontNumber = this.value
      createTextElements()
    })
  
    backNameInput.addEventListener("input", function () {
      config.backName = this.value
      createTextElements()
    })
  
    backNumberInput.addEventListener("input", function () {
      config.backNumber = this.value
      createTextElements()
    })
  
    textColorInput.addEventListener("input", function () {
      config.textColor = this.value
      createTextElements() // Recreate text elements with new color
    })
  
    logoUpload.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader()
        reader.onload = (event) => {
          config.logo = event.target.result
          createTextElements()
          logoOptions.style.display = "block"
        }
        reader.readAsDataURL(e.target.files[0])
      }
    })
  
    logoSizeInput.addEventListener("input", function () {
      config.logoSize = Number.parseFloat(this.value)
      createTextElements() // Recreate logo with new size
    })
  
    // Position slider event listeners
    frontNumberXSlider.addEventListener("input", function () {
      config.frontNumberPosition.x = Number.parseFloat(this.value) - 0.5
      if (frontNumberMesh) {
        frontNumberMesh.position.x = config.frontNumberPosition.x
      }
    })
  
    frontNumberYSlider.addEventListener("input", function () {
      config.frontNumberPosition.y = Number.parseFloat(this.value) - 0.5
      if (frontNumberMesh) {
        frontNumberMesh.position.y = config.frontNumberPosition.y
      }
    })
  
    backNameXSlider.addEventListener("input", function () {
      config.backNamePosition.x = Number.parseFloat(this.value) - 0.5
      if (backNameMesh) {
        backNameMesh.position.x = config.backNamePosition.x
      }
    })
  
    backNameYSlider.addEventListener("input", function () {
      config.backNamePosition.y = Number.parseFloat(this.value) - 0.5
      if (backNameMesh) {
        backNameMesh.position.y = config.backNamePosition.y
      }
    })
  
    backNumberXSlider.addEventListener("input", function () {
      config.backNumberPosition.x = Number.parseFloat(this.value) - 0.5
      if (backNumberMesh) {
        backNumberMesh.position.x = config.backNumberPosition.x
      }
    })
  
    backNumberYSlider.addEventListener("input", function () {
      config.backNumberPosition.y = Number.parseFloat(this.value) - 0.5
      if (backNumberMesh) {
        backNumberMesh.position.y = config.backNumberPosition.y
      }
    })
  
    logoXSlider.addEventListener("input", function () {
      config.logoPosition.x = Number.parseFloat(this.value) - 0.5
      if (logoMesh) {
        logoMesh.position.x = config.logoPosition.x
      }
    })
  
    logoYSlider.addEventListener("input", function () {
      config.logoPosition.y = Number.parseFloat(this.value) - 0.5
      if (logoMesh) {
        logoMesh.position.y = config.logoPosition.y
      }
    })
  
    resetViewBtn.addEventListener("click", () => {
      camera.position.set(0, 0, 2)
      controls.reset()
    })
  
    clearAllBtn.addEventListener("click", () => {
      // Reset text inputs
      frontNumberInput.value = ""
      backNameInput.value = ""
      backNumberInput.value = ""
  
      // Reset config values
      config.frontNumber = ""
      config.backName = ""
      config.backNumber = ""
      config.logo = null
  
      // Reset positions
      config.frontNumberPosition = { x: 0, y: 0 }
      config.backNamePosition = { x: 0, y: 0.2 }
      config.backNumberPosition = { x: 0, y: 0 }
      config.logoPosition = { x: 0, y: 0.2 }
  
      // Reset sliders
      frontNumberXSlider.value = 0.5
      frontNumberYSlider.value = 0.5
      backNameXSlider.value = 0.5
      backNameYSlider.value = 0.7
      backNumberXSlider.value = 0.5
      backNumberYSlider.value = 0.5
      logoXSlider.value = 0.5
      logoYSlider.value = 0.7
  
      // Clear logo upload
      logoUpload.value = ""
      logoOptions.style.display = "none"
  
      // Update 3D elements
      createTextElements()
    })
  
    downloadDesignBtn.addEventListener("click", () => {
      downloadMultiViewDesign()
    })
  
    // Initialize the scene
    initScene()
  })
  
  