const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x050505,20,90)

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,7,16)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)


// =================
// VARIÁVEIS
// =================

let quadros=[]
let overlayAberto=false

const limiteParede = 30
let cameraTarget = null
let zoomQuadro = null


// =================
// CHÃO
// =================

const woodTexture = new THREE.TextureLoader().load(
"/static/images/wood.avif"
)

woodTexture.wrapS = THREE.RepeatWrapping
woodTexture.wrapT = THREE.RepeatWrapping
woodTexture.repeat.set(6,6)

const floorMaterial = new THREE.MeshStandardMaterial({
map:woodTexture,
roughness:0.8
})

const floor = new THREE.Mesh(
new THREE.PlaneGeometry(70,70),
floorMaterial
)

floor.rotation.x = -Math.PI/2
floor.receiveShadow = true
scene.add(floor)

const luzChao = new THREE.Mesh(
new THREE.CircleGeometry(4,32),
new THREE.MeshBasicMaterial({
color:0xf4e6c3,
transparent:true,
opacity:0.15
})
)

luzChao.rotation.x = -Math.PI/2
luzChao.position.y = 0.02
scene.add(luzChao)

//textura parede

const wallTexture = new THREE.TextureLoader().load(
"/static/images/parede.avif"
)

wallTexture.wrapS = THREE.RepeatWrapping
wallTexture.wrapT = THREE.RepeatWrapping
wallTexture.repeat.set(4,2)



// =================
// PAREDES
// =================

const wallMaterial = new THREE.MeshStandardMaterial({
map:wallTexture,
roughness:0.9,
metalness:0
})

const backWall = new THREE.Mesh(
new THREE.BoxGeometry(70,20,1),
wallMaterial
)

backWall.position.set(0,10,-35)
scene.add(backWall)


const leftWall = new THREE.Mesh(
new THREE.BoxGeometry(1,20,70),
wallMaterial
)

leftWall.position.set(-35,10,0)
scene.add(leftWall)

const rightWall = new THREE.Mesh(
new THREE.BoxGeometry(1,20,70),
wallMaterial
)

rightWall.position.set(35,10,0)
scene.add(rightWall)

// parede da entrada

const frontWall = new THREE.Mesh(
new THREE.BoxGeometry(70,20,1),
wallMaterial
)

frontWall.position.set(0,10,35)

scene.add(frontWall)

// =================
// PORTA
// =================

const doorGroup = new THREE.Group()

const doorTexture = new THREE.TextureLoader().load(
"/static/images/porta.avif"
)


// PORTA
const door = new THREE.Mesh(

new THREE.BoxGeometry(7,13,0.25),

new THREE.MeshStandardMaterial({
map:doorTexture,
roughness:0.7
})

)

door.position.set(0,0,0)

doorGroup.add(door)


// MOLDURA ESQUERDA
const frameMaterial = new THREE.MeshStandardMaterial({
color:0x3a2a14
})

const frameLeft = new THREE.Mesh(
new THREE.BoxGeometry(0.4,14,0.4),
frameMaterial
)

frameLeft.position.set(-3.7,0,0.1)

doorGroup.add(frameLeft)


// MOLDURA DIREITA
const frameRight = frameLeft.clone()

frameRight.position.set(3.7,0,0.1)

doorGroup.add(frameRight)


// MOLDURA SUPERIOR
const frameTop = new THREE.Mesh(
new THREE.BoxGeometry(7.4,0.4,0.4),
frameMaterial
)

frameTop.position.set(0,6.9,0.1)

doorGroup.add(frameTop)


// MAÇANETA BASE
const handleBase = new THREE.Mesh(

new THREE.CylinderGeometry(0.05,0.05,0.5,16),

new THREE.MeshStandardMaterial({
color:0xd9dde0,
metalness:1,
roughness:0.2
})

)

handleBase.rotation.z = Math.PI/2
handleBase.position.set(2.6,-1,-0.25)

doorGroup.add(handleBase)


// MAÇANETA
const handle = new THREE.Mesh(

new THREE.SphereGeometry(0.18,32,32),

new THREE.MeshStandardMaterial({
color:0xd9dde0,
metalness:1,
roughness:0.15
})

)

handle.position.set(2.9,-1,-0.25)

doorGroup.add(handle)


// POSIÇÃO FINAL
doorGroup.position.set(0,7,33.8)

scene.add(doorGroup)

// textura teto

const ceilingTexture = new THREE.TextureLoader().load(
"/static/images/teto.avif"
)

ceilingTexture.wrapS = THREE.RepeatWrapping
ceilingTexture.wrapT = THREE.RepeatWrapping
ceilingTexture.repeat.set(4,4)

// =================
// TETO
// =================

const ceilingMaterial = new THREE.MeshStandardMaterial({
map:ceilingTexture,
roughness:0.8
})

const ceiling = new THREE.Mesh(
new THREE.PlaneGeometry(70,70),
ceilingMaterial
)

ceiling.rotation.x = Math.PI/2
ceiling.position.y = 20

scene.add(ceiling)


//moldura do teto
function criarMolduraTeto(){

const material = new THREE.MeshStandardMaterial({
color:0xd8d1c5,
roughness:0.6
})

// TAMANHO DO TETO
const tamanho = 70
const metade = tamanho / 2

// frente
const frente = new THREE.Mesh(
new THREE.BoxGeometry(tamanho,0.6,1),
material
)

frente.position.set(0,19.2,metade)
scene.add(frente)


// fundo
const fundo = frente.clone()
frente.position.set(0,19.2,metade)
scene.add(fundo)


// esquerda
const esquerda = new THREE.Mesh(
new THREE.BoxGeometry(1,0.6,tamanho),
material
)

esquerda.position.set(-metade,19.2,0)
scene.add(esquerda)


// direita
const direita = esquerda.clone()
direita.position.set(metade,19.2,0)
scene.add(direita)

}

criarMolduraTeto()

// ===============================
// SISTEMA DE TRILHO DE ILUMINAÇÃO
// ===============================

// cria um spot individual
function criarSpotTrilho(x,y,z){

const grupo = new THREE.Group()

// SUPORTE DO SPOT
const suporte = new THREE.Mesh(
new THREE.CylinderGeometry(0.08,0.08,0.6,16),
new THREE.MeshStandardMaterial({
color:0x111111,
metalness:0.6,
roughness:0.4
})
)

suporte.rotation.x = Math.PI/2
grupo.add(suporte)


// CORPO DO SPOT
const corpo = new THREE.Mesh(
new THREE.CylinderGeometry(0.35,0.45,1,32),
new THREE.MeshStandardMaterial({
color:0x202020,
metalness:0.9,
roughness:0.2
})
)

corpo.rotation.z = Math.PI/2
corpo.position.y = -0.4
grupo.add(corpo)


// LUZ DO SPOT
const luz = new THREE.SpotLight(0xffe2b5,3)

luz.position.set(0,-0.4,0)

luz.angle = 0.35
luz.penumbra = 0.8
luz.decay = 2
luz.distance = 35

grupo.add(luz)
grupo.add(luz.target)

grupo.position.set(x,y,z)

scene.add(grupo)

}


// cria trilho completo
function criarTrilhoLuz(x,z,comprimento){

// trilho principal
const trilho = new THREE.Mesh(
new THREE.BoxGeometry(comprimento,0.35,0.9),
new THREE.MeshStandardMaterial({
color:0x2a2a2a,
metalness:0.9,
roughness:0.3
})
)

trilho.position.set(x,19.7,z)

scene.add(trilho)


// suportes do trilho
for(let i = -comprimento/2 + 2; i < comprimento/2; i += 6){

const suporte = new THREE.Mesh(
new THREE.CylinderGeometry(0.08,0.08,0.5,12),
new THREE.MeshStandardMaterial({color:0x111111})
)

suporte.position.set(x + i,19.9,z)

scene.add(suporte)

}


// spots no trilho
for(let i = -comprimento/2 + 4; i < comprimento/2; i += 8){

criarSpotTrilho(x + i,19.4,z)

}

}
// =================
// LUZ
// =================

const ambient = new THREE.AmbientLight(0xfff3d6,0.25)
scene.add(ambient)

function criarLuzQuadro(x,y,z){

const luz = new THREE.SpotLight(0xffc46b,1.2)

luz.position.set(x,15,z)

luz.angle = 0.30
luz.penumbra = 0.9
luz.decay = 2
luz.distance = 35

luz.target.position.set(x,8,z)

scene.add(luz)
scene.add(luz.target)

}

// =================
// Lustre
// =================

function criarLustre(x,z){

// base do teto
const base = new THREE.Mesh(
new THREE.CylinderGeometry(0.4,0.5,0.4,20),
new THREE.MeshStandardMaterial({
color:0x8b6a3e,
metalness:0.6,
roughness:0.4
})
)

base.position.set(x,19.6,z)
scene.add(base)


// haste
const haste = new THREE.Mesh(
new THREE.CylinderGeometry(0.05,0.05,2.5,12),
new THREE.MeshStandardMaterial({
color:0x8b6a3e,
metalness:0.7,
roughness:0.3
})
)

haste.position.set(x,18.5,z)
scene.add(haste)


// aro decorativo
const aro = new THREE.Mesh(
new THREE.TorusGeometry(0.9,0.08,16,100),
new THREE.MeshStandardMaterial({
color:0xb08d57,
metalness:0.8,
roughness:0.3
})
)

aro.rotation.x=Math.PI/2
aro.position.set(x,17.6,z)

scene.add(aro)


// vidro da luz
const vidro = new THREE.Mesh(
new THREE.SphereGeometry(0.55,32,32),
new THREE.MeshStandardMaterial({
color:0xfff5cc,
emissive:0xffd27f,
emissiveIntensity:0.7,
roughness:0.1,
metalness:0
})
)

vidro.position.set(x,17.6,z)

scene.add(vidro)


// luz real
const luz = new THREE.PointLight(0xffd8a6,0.8,35)

luz.position.set(x,17.6,z)

scene.add(luz)

}

// =================
// TEXTO FUNDO
// =================

async function criarTextoParede(){

await document.fonts.load("120px Great Vibes")

const canvas=document.createElement("canvas")
canvas.width=1600
canvas.height=400

const ctx=canvas.getContext("2d")

ctx.shadowColor="#3a0d12"
ctx.shadowBlur=25

ctx.fillStyle="#F7E7CE"
ctx.textAlign="center"

ctx.font="120px 'Great Vibes'"
ctx.fillText("Os momentos mais bonitos da minha história",canvas.width/2,170)

ctx.font="110px 'Great Vibes'"
ctx.fillText("aconteceram ao contigo.",canvas.width/2,300)

ctx.strokeStyle = "#F7E7CE"
ctx.lineWidth = 6

ctx.beginPath()
ctx.moveTo(350,340)
ctx.lineTo(1250,340)
ctx.stroke()

const texture=new THREE.CanvasTexture(canvas)

const texto=new THREE.Mesh(
new THREE.PlaneGeometry(45,12),
new THREE.MeshBasicMaterial({
map:texture,
transparent:true
})
)
texto.position.set(0,12,-34)

scene.add(texto)

}

criarTextoParede()


// =================
// Placa de entrada criar dps
// =================

async function criarPlacaEntrada(){

await document.fonts.load("70px Great Vibes")

// ===== PLACA (TEXTURA) =====

const canvas = document.createElement("canvas")
canvas.width = 900
canvas.height = 300

const ctx = canvas.getContext("2d")

// fundo escuro elegante
ctx.fillStyle = "#121212"
ctx.fillRect(0,0,canvas.width,canvas.height)

// borda dourada
ctx.strokeStyle = "#c9a54c"
ctx.lineWidth = 10
ctx.strokeRect(10,10,canvas.width-20,canvas.height-20)

// texto
ctx.fillStyle = "#e6c76b"
ctx.textAlign = "center"

ctx.font = "70px Great Vibes"
ctx.fillText("Nosso Palácio",canvas.width/2,120)

ctx.font = "60px Great Vibes"
ctx.fillText("da Memória",canvas.width/2,210)

const texture = new THREE.CanvasTexture(canvas)


// ===== PLACA =====

const placa = new THREE.Mesh(

new THREE.BoxGeometry(10,3,0.3),

new THREE.MeshStandardMaterial({
map:texture,
metalness:0.3,
roughness:0.6,
side: THREE.DoubleSide
})
)

placa.position.set(-5,6.5,18)
scene.add(placa)


// ===== HASTE =====

const haste = new THREE.Mesh(

new THREE.CylinderGeometry(0.08,0.08,5,16),

new THREE.MeshStandardMaterial({
color:0x8b6a3e,
metalness:0.7,
roughness:0.3
})

)

haste.position.set(-5,3.2,18)

scene.add(haste)


// ===== BASE NO CHÃO =====

const base = new THREE.Mesh(

new THREE.CylinderGeometry(0.6,0.8,0.4,20),

new THREE.MeshStandardMaterial({
color:0x3a2a14,
metalness:0.4,
roughness:0.6
})

)

base.position.set(-5,0.3,18)

scene.add(base)


// ===== LUZ DA PLACA =====

const luz = new THREE.SpotLight(0xffd27f,1.8)

luz.position.set(0,14,22)

luz.angle = 0.35
luz.penumbra = 0.8
luz.decay = 2
luz.distance = 40

luz.target = placa

scene.add(luz)
scene.add(luz.target)

}

// =================
// LEGENDA
// =================

function criarLegenda(titulo,ano,x,y,z,rot){

const canvas=document.createElement("canvas")
canvas.width=400
canvas.height=200

const ctx=canvas.getContext("2d")

ctx.fillStyle="#333"
ctx.textAlign="left"

ctx.font="40px Arial"
ctx.fillText(titulo,20,100)

ctx.font="28px Arial"
ctx.fillText(ano,20,150)

const texture=new THREE.CanvasTexture(canvas)

const texto=new THREE.Mesh(
new THREE.PlaneGeometry(3,1.5),
new THREE.MeshBasicMaterial({
map:texture,
transparent:true
})
)

texto.position.set(x,y,z)
texto.rotation.y=rot

scene.add(texto)

}


// =================
// QUADRO
// =================

function criarQuadro(x,y,z,rotacao,idImagem,descricao){

const img=document.getElementById(idImagem)
const loader=new THREE.TextureLoader()

loader.load(img.src,function(texture){

const frame=new THREE.Mesh(
new THREE.BoxGeometry(8.6,5.9,0.2),
new THREE.MeshStandardMaterial({color:0x3a2a14})
)

frame.position.set(x,y,z)
frame.rotation.y=rotacao
scene.add(frame)

const quadro=new THREE.Mesh(
new THREE.PlaneGeometry(8,5.3),
new THREE.MeshStandardMaterial({
map:texture,
roughness:0.2,
metalness:0.1
})
)

quadro.position.set(x,y,z)
quadro.rotation.y=rotacao

if(rotacao===Math.PI/2) quadro.position.x+=0.11
if(rotacao===-Math.PI/2) quadro.position.x-=0.11

scene.add(quadro)

quadros.push({
mesh:quadro,
img:img.src,
descricao:descricao
})

})

}

// =================
// Haste Segurança
// =================

function criarHasteSeguranca(x,z){

const base = new THREE.Mesh(
new THREE.CylinderGeometry(0.35,0.4,0.15,32),
new THREE.MeshStandardMaterial({
color:0x111111,
metalness:0.8,
roughness:0.3
})
)

base.position.set(x,0.075,z)
scene.add(base)


const pole = new THREE.Mesh(
new THREE.CylinderGeometry(0.07,0.07,3,32),
new THREE.MeshStandardMaterial({
color:0xcccccc,
metalness:1,
roughness:0.2
})
)

pole.position.set(x,1.5,z)
scene.add(pole)

}

function criarCorda(x1,z1,x2,z2){

const dx = x2 - x1
const dz = z2 - z1

const distancia = Math.sqrt(dx*dx + dz*dz)

const geometry = new THREE.CylinderGeometry(0.05,0.05,distancia,16)

const material = new THREE.MeshStandardMaterial({
color:0x8b0000
})

const rope = new THREE.Mesh(geometry,material)

rope.position.set(
(x1+x2)/2,
1.7,
(z1+z2)/2
)

rope.rotation.y = Math.atan2(dz,dx)
rope.rotation.z = Math.PI/2

scene.add(rope)

}

function criarBarreiraMuseu(x,z){

const distancia = 5

criarHasteSeguranca(x,z-distancia)
criarHasteSeguranca(x,z+distancia)

criarCorda(x,z-distancia,x,z+distancia)

}

const musica = document.getElementById("musica")

window.addEventListener("click", ()=>{

musica.volume = 0.1
musica.play()

},{ once:true })


//abajur

function criarAbajur(x,z){

// base metálica
const base = new THREE.Mesh(
new THREE.CylinderGeometry(0.5,0.6,0.2,32),
new THREE.MeshStandardMaterial({
color:0xbfa46f,
metalness:0.8,
roughness:0.3
})
)

base.position.set(x,0.15,z)
scene.add(base)


// haste
const haste = new THREE.Mesh(
new THREE.CylinderGeometry(0.06,0.06,3.2,32),
new THREE.MeshStandardMaterial({
color:0xbfa46f,
metalness:0.9,
roughness:0.2
})
)

haste.position.set(x,1.8,z)
scene.add(haste)


// suporte da cúpula
const suporte = new THREE.Mesh(
new THREE.SphereGeometry(0.15,32,32),
new THREE.MeshStandardMaterial({
color:0xbfa46f,
metalness:0.8,
roughness:0.2
})
)

suporte.position.set(x,3.4,z)
scene.add(suporte)


// cúpula de tecido
const cupula = new THREE.Mesh(
new THREE.CylinderGeometry(1.1,0.7,1.2,32,true),
new THREE.MeshStandardMaterial({
color:0xf5deb3,
side:THREE.DoubleSide,
roughness:0.9
})
)

cupula.position.set(x,4,z)
scene.add(cupula)


// luz do abajur
const luz = new THREE.PointLight(0xffd9a0,1.3,10)

luz.position.set(x,3.9,z)

scene.add(luz)

}

// Colunas

const textureLoader = new THREE.TextureLoader()

const texturaPedestal = textureLoader.load("/static/images/marmoreescuro.avif")
const texturaMarmore = textureLoader.load("/static/images/marmore.avif")

texturaMarmore.wrapS = THREE.RepeatWrapping
texturaMarmore.wrapT = THREE.RepeatWrapping
texturaMarmore.repeat.set(1,4)

texturaPedestal.wrapS = THREE.RepeatWrapping
texturaPedestal.wrapT = THREE.RepeatWrapping
texturaPedestal.repeat.set(2,2)

function criarColuna(x,z){

const grupo = new THREE.Group()

// BASE
const base = new THREE.Mesh(
new THREE.CylinderGeometry(2,2,0.8,32),
new THREE.MeshStandardMaterial({
map:texturaMarmore,
roughness:0.8
})
)

base.position.y = 0.4
grupo.add(base)


// ANEL DECORATIVO
const anel = new THREE.Mesh(
new THREE.TorusGeometry(1.2,0.15,16,50),
new THREE.MeshStandardMaterial({color:0xcfc8bb})
)

anel.rotation.x = Math.PI/2
anel.position.y = 0.8
grupo.add(anel)


// CORPO DA COLUNA
const corpo = new THREE.Mesh(
new THREE.CylinderGeometry(0.9,1,12,32),
new THREE.MeshStandardMaterial({
map:texturaMarmore,
roughness:0.8
})
)

corpo.position.y = 6.5
grupo.add(corpo)


// TOPO DA COLUNA
const topo = new THREE.Mesh(
new THREE.CylinderGeometry(2,2,1,32),
new THREE.MeshStandardMaterial({
color:0xded8cc
})
)

topo.position.y = 13
grupo.add(topo)


// CAPITEL DECORATIVO
const capitel = new THREE.Mesh(
new THREE.TorusGeometry(1.3,0.2,16,50),
new THREE.MeshStandardMaterial({color:0xcfc8bb})
)

capitel.rotation.x = Math.PI/2
capitel.position.y = 12.5
grupo.add(capitel)

grupo.position.set(x,0,z)

scene.add(grupo)

}

// Pedestal para foto

function criarPedestalFoto(x,z,idImagem,descricao){

const img = document.getElementById(idImagem)
const loader = new THREE.TextureLoader()

loader.load(img.src,function(texture){

const grupo = new THREE.Group()
grupo.userData.rotacionar = true

// BASE LARGA
const base = new THREE.Mesh(
new THREE.CylinderGeometry(2.6,2.8,0.8,40),
new THREE.MeshStandardMaterial({
map:texturaPedestal,
roughness:0.7
})
)

base.position.y = 0.4
grupo.add(base)


// CORPO PRINCIPAL
const corpo = new THREE.Mesh(
new THREE.CylinderGeometry(1.9,2.2,3.5,40),
new THREE.MeshStandardMaterial({
map:texturaPedestal,
roughness:0.7
})
)

corpo.position.y = 2.4
grupo.add(corpo)


// TOPO DO PEDESTAL
const topo = new THREE.Mesh(
new THREE.CylinderGeometry(2.2,2.2,0.5,40),
new THREE.MeshStandardMaterial({
map:texturaPedestal,
roughness:0.6
})
)

topo.position.y = 4.4
grupo.add(topo)


// MOLDURA DA FOTO
const moldura = new THREE.Mesh(
new THREE.BoxGeometry(7,5,0.3),
new THREE.MeshStandardMaterial({
color:0x111111,
roughness:0.4
})
)

moldura.position.set(0,7,0)
grupo.add(moldura)


// FOTO
const foto = new THREE.Mesh(
new THREE.PlaneGeometry(6.5,4.5),
new THREE.MeshBasicMaterial({
map:texture
})
)

foto.position.set(0,7,0.18)
grupo.add(foto)

// Vidro

const vidro = new THREE.Mesh(
new THREE.BoxGeometry(7.2,5.7,1.2),
new THREE.MeshPhysicalMaterial({
color:0xffffff,
transparent:true,
opacity:0.15,
roughness:0.05,
metalness:0,
clearcoat:1,
clearcoatRoughness:0.1,
reflectivity:1
})
)

vidro.position.set(0,7,0.4)
grupo.add(vidro)

// BORDA DO VIDRO

const edges = new THREE.EdgesGeometry(
new THREE.BoxGeometry(7.25,5.75,1.25)
)

const bordaVidro = new THREE.LineSegments(
edges,
new THREE.LineBasicMaterial({ color:0x722f37 })
)

bordaVidro.position.set(0,7,0.4)

grupo.add(bordaVidro)

// LUZ DRAMÁTICA
const luz = new THREE.SpotLight(0xffd8a6,2)

luz.position.set(0,14,3)
luz.angle = 0.35
luz.penumbra = 0.8
luz.decay = 2
luz.distance = 35

luz.target = foto

grupo.add(luz)
grupo.add(luz.target)

grupo.position.set(x,0,z)

scene.add(grupo)

})
}




// =================
// INICIAR
// =================

function iniciarQuadros(){

criarQuadro(-34,8,-20,Math.PI/2,"img1","2021")
criarBarreiraMuseu(-28,-20)

criarQuadro(-34,8,0,Math.PI/2,"img2","2022")
criarBarreiraMuseu(-28,0)

criarQuadro(-34,8,20,Math.PI/2,"img3","2023")
criarBarreiraMuseu(-28,20)

criarQuadro(34,8,-20,-Math.PI/2,"img4","2024")
criarBarreiraMuseu(28,-20)

criarQuadro(34,8,0,-Math.PI/2,"img5","2025")
criarBarreiraMuseu(28,0)

criarQuadro(34,8,20,-Math.PI/2,"img6","2026")
criarBarreiraMuseu(28,20)

}

function iniciarLuzes(){

criarLuzQuadro(-34,15,-20)
criarLuzQuadro(-34,15,0)
criarLuzQuadro(-34,15,20)

criarLuzQuadro(34,15,-20)
criarLuzQuadro(34,15,0)
criarLuzQuadro(34,15,20)

}

function iniciarLustres(){

criarLustre(-15,-10)
criarLustre(15,-10)

criarLustre(-15,10)
criarLustre(15,10)

}


function iniciarLegendas(){

criarLegenda("Nós","2021",-34.3,8,-16,Math.PI/2)
criarLegenda("Nós","2022",-34.3,8,4,Math.PI/2)
criarLegenda("Nós","2023",-34.3,8,24,Math.PI/2)

criarLegenda("Nós","2024",34.3,8,-14,-Math.PI/2)
criarLegenda("Nós","2025",34.3,8,6,-Math.PI/2)
criarLegenda("Nós","2026",34.3,8,26,-Math.PI/2)

}


window.addEventListener("load",()=>{

iniciarQuadros()
iniciarLuzes()
iniciarLegendas()
iniciarLustres()
criarPlacaEntrada()
criarAbajur(-10,-5)
criarAbajur(10,-5)
criarColuna(-30,-30)
criarColuna(30,-30)

criarColuna(-30,30)
criarColuna(30,30)
criarPedestalFoto(0,0,"img7","Aqui estão as nossas memórias dos melhores momentos que vivemos.")

criarTrilhoLuz(0,-15,40)
criarTrilhoLuz(0,0,40)
criarTrilhoLuz(0,15,40)
})

// =================
// ABRIR IMAGEM
// =================

function abrirImagem(obj){

overlayAberto=true

document.getElementById("overlay").style.display="flex"
document.getElementById("imgExpandida").src=obj.img
document.getElementById("overlayTexto").innerText=obj.descricao


}


// =================
// FECHAR
// =================

document.getElementById("fechar").onclick=()=>{

overlayAberto=false
document.getElementById("overlay").style.display="none"

}


// =================
// MOVIMENTO
// =================

let targetPosition=null
const moveSpeed=0.12

const raycaster=new THREE.Raycaster()
const mouse=new THREE.Vector2()

function setTarget(clientX,clientY){

if(overlayAberto) return

mouse.x=(clientX/window.innerWidth)*2-1
mouse.y=-(clientY/window.innerHeight)*2+1

raycaster.setFromCamera(mouse,camera)

const intersects=raycaster.intersectObject(floor)

if(intersects.length>0){

const point=intersects[0].point

targetPosition=new THREE.Vector3(
point.x,
camera.position.y,
point.z
)

}

}


// =================
// ROTAÇÃO
// =================

let isDragging=false
let startX=0
let moved=false
let rotationY=0

function rotateCamera(deltaX){

rotationY-=deltaX*0.005
camera.rotation.y=rotationY

}


// =================
// CONTROLES
// =================

window.addEventListener("mousedown",(event)=>{

if(overlayAberto) return

isDragging=true
moved=false
startX=event.clientX

})

window.addEventListener("mousemove",(event)=>{

if(!isDragging) return

const deltaX=event.clientX-startX

if(Math.abs(deltaX)>2){

moved=true
rotateCamera(deltaX)

}

startX=event.clientX

})

window.addEventListener("mouseup",(event)=>{

if(overlayAberto) return
if(cameraTarget) return

isDragging=false

mouse.x=(event.clientX/window.innerWidth)*2-1
mouse.y=-(event.clientY/window.innerHeight)*2+1

raycaster.setFromCamera(mouse,camera)

const objetos=quadros.map(q=>q.mesh)

const intersects=raycaster.intersectObjects(objetos)

if(intersects.length>0){

const objeto=quadros.find(q=>q.mesh===intersects[0].object)

zoomQuadro = objeto
cameraTarget = objeto.mesh.position.clone()
return

}

if(!moved){
setTarget(event.clientX,event.clientY)
}

})


// =================
// LOOP
// =================

function animate(){

requestAnimationFrame(animate)

if(targetPosition){

const direction=new THREE.Vector3()

direction.subVectors(targetPosition,camera.position)

if(direction.length()>0.2){

direction.normalize()

camera.position.add(direction.multiplyScalar(moveSpeed))

}else{

targetPosition=null

}

}
camera.position.x = Math.max(-limiteParede, Math.min(limiteParede, camera.position.x))
camera.position.z = Math.max(-limiteParede, Math.min(limiteParede, camera.position.z))

// pedestal rotativo
scene.traverse((obj) => {

if(obj.userData.rotacionar){

obj.rotation.y += 0.003

}

})

// =================
// ZOOM CINEMATOGRÁFICO
// =================

if(cameraTarget){

// segurança contra travamento
if(cameraTarget && camera.position.distanceTo(cameraTarget) < 5){
    
    abrirImagem(zoomQuadro)

    cameraTarget = null
    zoomQuadro = null
}

const destino = new THREE.Vector3(
cameraTarget.x * 0.85,
camera.position.y,
cameraTarget.z * 0.85
)

camera.position.lerp(destino,0.08)

if(camera.position.distanceTo(destino) < 2.5){

abrirImagem(zoomQuadro)

cameraTarget = null
zoomQuadro = null

}

}

renderer.render(scene,camera)

}

animate()