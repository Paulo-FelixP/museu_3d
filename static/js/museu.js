const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)

// =================
// CENA
// =================

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050505)

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,7,20)

// =================
// RENDER
// =================

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile })
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setPixelRatio(isMobile ? 0.6 : window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// =================
// LUZ LEVE
// =================

const ambient = new THREE.AmbientLight(0xffffff,1)
scene.add(ambient)

// =================
// CHÃO
// =================

const floor = new THREE.Mesh(
new THREE.PlaneGeometry(70,70),
new THREE.MeshBasicMaterial({ color:0x1a1a1a })
)

floor.rotation.x = -Math.PI/2
scene.add(floor)

// =================
// PAREDES
// =================

function criarParede(x,y,z,w,h,d){

const wall = new THREE.Mesh(
new THREE.BoxGeometry(w,h,d),
new THREE.MeshBasicMaterial({ color:0x2a2a2a })
)

wall.position.set(x,y,z)
scene.add(wall)
}

criarParede(0,10,-35,70,20,1)
criarParede(0,10,35,70,20,1)
criarParede(-35,10,0,1,20,70)
criarParede(35,10,0,1,20,70)

// =================
// DADOS DAS FOTOS
// =================

const dadosFotos = [
{ id:"img1", ano:"2021", pos:[-34,8,-20], rot:Math.PI/2 },
{ id:"img2", ano:"2022", pos:[-34,8,0], rot:Math.PI/2 },
{ id:"img3", ano:"2023", pos:[-34,8,20], rot:Math.PI/2 },

{ id:"img4", ano:"2024", pos:[34,8,-20], rot:-Math.PI/2 },
{ id:"img5", ano:"2025", pos:[34,8,0], rot:-Math.PI/2 },
{ id:"img6", ano:"2026", pos:[34,8,20], rot:-Math.PI/2 }
]

let quadros = []
let indexAtual = 0

// =================
// CRIAR QUADROS
// =================

function criarQuadros(){

const loader = new THREE.TextureLoader()

dadosFotos.forEach((dado,i)=>{

const img = document.getElementById(dado.id)

loader.load(img.src,(texture)=>{

const quadro = new THREE.Mesh(
new THREE.PlaneGeometry(8,5),
new THREE.MeshBasicMaterial({ map:texture })
)

quadro.position.set(...dado.pos)
quadro.rotation.y = dado.rot

scene.add(quadro)

quadros.push({
mesh:quadro,
descricao:dado.ano
})

})

})

}

// =================
// FOCO DA CÂMERA
// =================

let targetCamera = new THREE.Vector3()
let olhando = false

function focarQuadro(index){

const q = quadros[index]

const pos = q.mesh.position

targetCamera.set(
pos.x * 0.85,
7,
pos.z * 0.85
)

camera.lookAt(pos)

indexAtual = index
olhando = true

}

// =================
// NAVEGAÇÃO
// =================

function proximo(){
if(indexAtual < quadros.length - 1){
focarQuadro(indexAtual + 1)
}
}

function anterior(){
if(indexAtual > 0){
focarQuadro(indexAtual - 1)
}
}

// =================
// CLICK
// =================

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener("click",(event)=>{

mouse.x = (event.clientX/window.innerWidth)*2-1
mouse.y = -(event.clientY/window.innerHeight)*2+1

raycaster.setFromCamera(mouse,camera)

const intersects = raycaster.intersectObjects(quadros.map(q=>q.mesh))

if(intersects.length > 0){

const index = quadros.findIndex(q=>q.mesh === intersects[0].object)

focarQuadro(index)
return
}

// clique lado direito/esquerdo da tela
if(event.clientX > window.innerWidth/2){
proximo()
}else{
anterior()
}

})

// =================
// TOUCH MOBILE
// =================

window.addEventListener("touchend",(event)=>{

const touch = event.changedTouches[0]

if(touch.clientX > window.innerWidth/2){
proximo()
}else{
anterior()
}

})

// =================
// OVERLAY
// =================

function abrirImagem(){

const q = quadros[indexAtual]

document.getElementById("overlay").style.display="flex"
document.getElementById("imgExpandida").src = q.mesh.material.map.image.src
document.getElementById("overlayTexto").innerText = q.descricao

}

document.getElementById("fechar").onclick=()=>{
document.getElementById("overlay").style.display="none"
}

// abre ao dar segundo clique parado
let ultimoClique = 0

window.addEventListener("dblclick",()=>{
abrirImagem()
})

// =================
// LOOP
// =================

function animate(){

requestAnimationFrame(animate)

// movimento suave
camera.position.lerp(targetCamera,0.08)

renderer.render(scene,camera)

}

criarQuadros()

// começa no primeiro
setTimeout(()=>{
focarQuadro(0)
},500)

animate()