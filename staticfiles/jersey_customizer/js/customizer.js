// Global variables
let scene, camera, renderer, jersey, controls;
let activeView = 'front';
let animationInProgress = false;

// Design state
const frontDesign = {
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    textColor: '#000000',
    number: '',
    pattern: 'none',
    logoUrl: '',
    logoSize: 0.5
};

const backDesign = {
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    textColor: '#000000',
    name: '',
    number: '',
    pattern: 'none',
    logoUrl: '',
    logoSize: 0.5
};

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Create camera
    const container = document.getElementById('canvas-container');
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create jersey model
    createJersey();
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Set up event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Create the jersey 3D model
function createJersey() {
    jersey = new THREE.Group();
    
    // Front side
    const frontGeometry = new THREE.BoxGeometry(2, 3, 0.2);
    const frontMaterial = new THREE.MeshStandardMaterial({ 
        color: frontDesign.primaryColor,
        side: THREE.DoubleSide
    });
    const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
    frontMesh.position.z = 0.1;
    frontMesh.userData.side = 'front';
    jersey.add(frontMesh);
    
    // Back side
    const backGeometry = new THREE.BoxGeometry(2, 3, 0.2);
    const backMaterial = new THREE.MeshStandardMaterial({ 
        color: backDesign.primaryColor,
        side: THREE.DoubleSide
    });
    const backMesh = new THREE.Mesh(backGeometry, backMaterial);
    backMesh.position.z = -0.1;
    backMesh.rotation.y = Math.PI;
    backMesh.userData.side = 'back';
    jersey.add(backMesh);
    
    // Add sleeves (for t-shirt style)
    addSleeves();
    
    scene.add(jersey);
    
    // Update the jersey with initial designs
    updateJerseyMaterials();
    updateJerseyText();
}

// Add sleeves to the jersey
function addSleeves() {
    const leftSleeveGeometry = new THREE.BoxGeometry(0.8, 1, 0.2);
    const leftSleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: frontDesign.secondaryColor,
        side: THREE.DoubleSide
    });
    const leftSleeve = new THREE.Mesh(leftSleeveGeometry, leftSleeveMaterial);
    leftSleeve.position.set(-1.1, 0.5, 0.1);
    leftSleeve.userData.side = 'front';
    leftSleeve.userData.part = 'sleeve';
    jersey.add(leftSleeve);
    
    const rightSleeveGeometry = new THREE.BoxGeometry(0.8, 1, 0.2);
    const rightSleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: frontDesign.secondaryColor,
        side: THREE.DoubleSide
    });
    const rightSleeve = new THREE.Mesh(rightSleeveGeometry, rightSleeveMaterial);
    rightSleeve.position.set(1.1, 0.5, 0.1);
    rightSleeve.userData.side = 'front';
    rightSleeve.userData.part = 'sleeve';
    jersey.add(rightSleeve);
    
    // Back sleeves
    const backLeftSleeveGeometry = new THREE.BoxGeometry(0.8, 1, 0.2);
    const backLeftSleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: backDesign.secondaryColor,
        side: THREE.DoubleSide
    });
    const backLeftSleeve = new THREE.Mesh(backLeftSleeveGeometry, backLeftSleeveMaterial);
    backLeftSleeve.position.set(-1.1, 0.5, -0.1);
    backLeftSleeve.rotation.y = Math.PI;
    backLeftSleeve.userData.side = 'back';
    backLeftSleeve.userData.part = 'sleeve';
    jersey.add(backLeftSleeve);
    
    const backRightSleeveGeometry = new THREE.BoxGeometry(0.8, 1, 0.2);
    const backRightSleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: backDesign.secondaryColor,
        side: THREE.DoubleSide
    });
    const backRightSleeve = new THREE.Mesh(backRightSleeveGeometry, backRightSleeveMaterial);
    backRightSleeve.position.set(1.1, 0.5, -0.1);
    backRightSleeve.rotation.y = Math.PI;
    backRightSleeve.userData.side = 'back';
    backRightSleeve.userData.part = 'sleeve';
    jersey.add(backRightSleeve);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Set up event listeners for UI controls
function setupEventListeners() {
    // View controls
    document.getElementById('front-view').addEventListener('click', () => setActiveView('front'));
    document.getElementById('back-view').addEventListener('click', () => setActiveView('back'));
    
    // Jersey type
    document.getElementById('jersey-type').addEventListener('change', updateJerseyType);
    
    // Colors
    document.getElementById('primary-color').addEventListener('input', (e) => {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.primaryColor = e.target.value;
        updateJerseyMaterials();
    });
    
    document.getElementById('secondary-color').addEventListener('input', (e) => {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.secondaryColor = e.target.value;
        updateJerseyMaterials();
    });
    
    document.getElementById('text-color').addEventListener('input', (e) => {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.textColor = e.target.value;
        updateJerseyText();
    });
    
    // Pattern
    document.getElementById('pattern').addEventListener('change', (e) => {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.pattern = e.target.value;
        updateJerseyMaterials();
    });
    
    // Text inputs
    document.getElementById('front-number').addEventListener('input', (e) => {
        frontDesign.number = e.target.value;
        updateJerseyText();
    });
    
    document.getElementById('back-name').addEventListener('input', (e) => {
        backDesign.name = e.target.value;
        updateJerseyText();
    });
    
    document.getElementById('back-number').addEventListener('input', (e) => {
        backDesign.number = e.target.value;
        updateJerseyText();
    });
    
    // Logo
    document.getElementById('logo-upload').addEventListener('change', handleLogoUpload);
    document.getElementById('logo-size').addEventListener('input', (e) => {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.logoSize = parseFloat(e.target.value);
        updateJerseyLogo();
    });
    
    // Save design
    document.getElementById('save-design').addEventListener('click', saveDesign);
}

// Set active view (front or back)
function setActiveView(view) {
    if (activeView === view || animationInProgress) return;
    
    activeView = view;
    
    // Update UI
    document.getElementById('front-view').classList.toggle('bg-blue-500', view === 'front');
    document.getElementById('front-view').classList.toggle('text-white', view === 'front');
    document.getElementById('front-view').classList.toggle('bg-gray-200', view === 'back');
    
    document.getElementById('back-view').classList.toggle('bg-blue-500', view === 'back');
    document.getElementById('back-view').classList.toggle('text-white', view === 'back');
    document.getElementById('back-view').classList.toggle('bg-gray-200', view === 'front');
    
    document.getElementById('front-options').style.display = view === 'front' ? 'block' : 'none';
    document.getElementById('back-options').style.display = view === 'back' ? 'block' : 'none';
    
    // Update form values to match the active view
    updateFormValues();
    
    // Rotate jersey
    rotateJersey();
}

// Update form values based on active view
function updateFormValues() {
    const design = activeView === 'front' ? frontDesign : backDesign;
    
    document.getElementById('primary-color').value = design.primaryColor;
    document.getElementById('secondary-color').value = design.secondaryColor;
    document.getElementById('text-color').value = design.textColor;
    document.getElementById('pattern').value = design.pattern;
    
    // Show/hide logo size slider
    const logoSizeContainer = document.getElementById('logo-size-container');
    if (design.logoUrl) {
        logoSizeContainer.style.display = 'block';
        document.getElementById('logo-size').value = design.logoSize;
    } else {
        logoSizeContainer.style.display = 'none';
    }
}

// Rotate jersey to show front or back
function rotateJersey() {
    animationInProgress = true;
    
    const targetRotation = activeView === 'front' ? 0 : Math.PI;
    const startRotation = jersey.rotation.y;
    const duration = 500; // milliseconds
    const startTime = Date.now();
    
    function animateRotation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smoother animation
        const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
        
        jersey.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
        
        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        } else {
            jersey.rotation.y = targetRotation;
            animationInProgress = false;
        }
    }
    
    animateRotation();
}

// Update jersey type (t-shirt or sleeveless)
function updateJerseyType() {
    const jerseyType = document.getElementById('jersey-type').value;
    
    // Remove existing sleeves
    jersey.children.forEach(child => {
        if (child.userData.part === 'sleeve') {
            child.visible = jerseyType === 'tshirt';
        }
    });
}

// Update jersey materials (colors and patterns)
function updateJerseyMaterials() {
    jersey.children.forEach(child => {
        if (!child.userData.side) return;
        
        const design = child.userData.side === 'front' ? frontDesign : backDesign;
        
        if (child.userData.part === 'sleeve') {
            child.material.color.set(design.secondaryColor);
        } else {
            child.material.color.set(design.primaryColor);
            
            // Apply pattern if selected
            if (design.pattern !== 'none') {
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(`/static/patterns/${design.pattern}.png`, texture => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(4, 4);
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                });
            } else {
                child.material.map = null;
                child.material.needsUpdate = true;
            }
        }
    });
}

// Update jersey text (numbers and name)
function updateJerseyText() {
    // Remove existing text meshes
    jersey.children.forEach(child => {
        if (child.userData.type === 'text') {
            jersey.remove(child);
        }
    });
    
    // Add front number (upper right)
    if (frontDesign.number) {
        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker_bold.typeface.json', font => {
            const textGeometry = new THREE.TextGeometry(frontDesign.number, {
                font: font,
                size: 0.2,
                height: 0.05
            });
            
            const textMaterial = new THREE.MeshStandardMaterial({ color: frontDesign.textColor });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            
            // Center the text
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            
            textMesh.position.set(0.8 - textWidth / 2, 1.2, 0.21);
            textMesh.userData.type = 'text';
            textMesh.userData.side = 'front';
            
            jersey.add(textMesh);
        });
    }
    
    // Add back name (upper middle)
    if (backDesign.name) {
        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker_bold.typeface.json', font => {
            const textGeometry = new THREE.TextGeometry(backDesign.name.toUpperCase(), {
                font: font,
                size: 0.2,
                height: 0.05
            });
            
            const textMaterial = new THREE.MeshStandardMaterial({ color: backDesign.textColor });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            
            // Center the text
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            
            textMesh.position.set(-textWidth / 2, 1.2, -0.21);
            textMesh.rotation.y = Math.PI;
            textMesh.userData.type = 'text';
            textMesh.userData.side = 'back';
            
            jersey.add(textMesh);
        });
    }
    
    // Add back number (center, large)
    if (backDesign.number) {
        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker_bold.typeface.json', font => {
            const textGeometry = new THREE.TextGeometry(backDesign.number, {
                font: font,
                size: 0.8,
                height: 0.1
            });
            
            const textMaterial = new THREE.MeshStandardMaterial({ color: backDesign.textColor });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            
            // Center the text
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            
            textMesh.position.set(-textWidth / 2, 0, -0.21);
            textMesh.rotation.y = Math.PI;
            textMesh.userData.type = 'text';
            textMesh.userData.side = 'back';
            
            jersey.add(textMesh);
        });
    }
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const design = activeView === 'front' ? frontDesign : backDesign;
        design.logoUrl = e.target.result;
        
        // Show logo size slider
        document.getElementById('logo-size-container').style.display = 'block';
        
        updateJerseyLogo();
    };
    reader.readAsDataURL(file);
}

// Update jersey logo
function updateJerseyLogo() {
    // Remove existing logos
    jersey.children.forEach(child => {
        if (child.userData.type === 'logo') {
            jersey.remove(child);
        }
    });
    
    // Add front logo if exists
    if (frontDesign.logoUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(frontDesign.logoUrl, texture => {
            const aspect = texture.image.width / texture.image.height;
            const logoGeometry = new THREE.PlaneGeometry(frontDesign.logoSize * aspect, frontDesign.logoSize);
            const logoMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
            logoMesh.position.set(0, 1.1, 0.21);
            logoMesh.userData.type = 'logo';
            logoMesh.userData.side = 'front';
            
            jersey.add(logoMesh);
        });
    }
    
    // Add back logo if exists
    if (backDesign.logoUrl) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(backDesign.logoUrl, texture => {
            const aspect = texture.image.width / texture.image.height;
            const logoGeometry = new THREE.PlaneGeometry(backDesign.logoSize * aspect, backDesign.logoSize);
            const logoMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
            logoMesh.position.set(0, 0.8, -0.21);
            logoMesh.rotation.y = Math.PI;
            logoMesh.userData.type = 'logo';
            logoMesh.userData.side = 'back';
            
            jersey.add(logoMesh);
        });
    }
}

// Save design to server
function saveDesign() {
    const designData = {
        jerseyType: document.getElementById('jersey-type').value,
        frontDesign: { ...frontDesign },
        backDesign: { ...backDesign }
    };
    
    // Convert data URLs to file names for server storage
    // In a real app, you'd upload the images to the server
    if (frontDesign.logoUrl && frontDesign.logoUrl.startsWith('data:')) {
        designData.frontDesign.logoUrl = 'front_logo.png';
    }
    
    if (backDesign.logoUrl && backDesign.logoUrl.startsWith('data:')) {
        designData.backDesign.logoUrl = 'back_logo.png';
    }
    
    fetch('/save-design/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Design saved:', data);
        alert('Design saved successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error saving design');
    });
}

// Initialize when the page loads
window.addEventListener('load', init);