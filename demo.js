var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8,speed:0.2,turnSpeed:Math.PI*0.02 };

// An object to hold all the things needed for our loading screen
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

	// Loading Screen Codes 
	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);

	loadingManager = new THREE.LoadingManager();

	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};

	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
	};

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color:0xff9999,wireframe:false})
		);
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);

	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20,10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
		);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);

	meshTop = new THREE.Mesh(
		new THREE.PlaneGeometry(20,10,10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
		);
	meshTop.rotation.x -= Math.PI;
	meshTop.receiveShadow = true;
	meshTop.position.set(0,5,10);
	scene.add(meshTop);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff,0.8,18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	var textureLoader = new THREE.TextureLoader(loadingManager);
	crateTexture = new textureLoader.load("textures/map/text.jpg");
	crateBumpMap = textureLoader.load("textures/map/BUMP.jpg");
	crateNormalMap = textureLoader.load("textures/map/NORM.jpg");

	

	for ( let i = 0; i < 100; i ++ ){

	crate = new THREE.Mesh(
	new THREE.BoxGeometry(3,3,3),
	new THREE.MeshPhongMaterial({
		color:0xffffff,
		map:crateTexture,
		bumpMap:crateBumpMap,
		normalMap:crateNormalMap
	}) 
	);
	crate.position.set(0,i+0.5,0);
	crate.scale.set(0.2,0.2,0.2);
	scene.add( crate );

	}

	// scene.add(crate);
	// crate.position.set(2.5,3/2,2.5);
	// crate.scale.set(0.2,0.2,0.2);
	// crate.receiveShadow = true;
	// crate.castShadow = true;

	var mtlLoader = new THREE.MTLLoader(loadingManager);
	mtlLoader.load("assets/tes.mtl", function(materials){
		materials.preload();
		var objLoader = new THREE.OBJLoader(loadingManager);
		objLoader.setMaterials(materials);

		objLoader.load("assets/tes.obj", function(mesh){
			mesh.position.sub( center );
			console.log(mesh.position);
			scene.add(mesh);
			mesh.position.set(0,0,0);
		});
	});


	// camera.position.set(0,player.height,-5);
	camera.position.set(0,0.8,-5);
	camera.lookAt(new THREE.Vector3(0,0,0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth,window.innerHeight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth,window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

	animate();

}

function animate(){

	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.rotation.y -= 0.05;
		// if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		// loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return; // Stop the function here.
	}

	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	if(keyboard[87]){ //W Key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ //S Key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ //A Key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ //D Key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}

	if(keyboard[37]){ //Left arrow key
		camera.rotation.y -= player.turnSpeed;
	}

	if(keyboard[39]){ //Right Arrow key
		camera.rotation.y += player.turnSpeed; 
	}

	renderer.render(scene,camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;


