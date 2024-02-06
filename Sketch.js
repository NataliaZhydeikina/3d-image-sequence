import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import GUI from "lil-gui";

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    var frustumSize = 1;
    var aspect = this.container.offsetWidth / this.container.offsetHeight;
    console.log(aspect);
    this.camera = new THREE.OrthographicCamera(
      frustumSize*aspect / -2, 
      aspect*frustumSize / 2, 
      frustumSize / 2, frustumSize / -2, 
      -1000, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement );
    this.camera.position.set(0, 0, 2);
    this.controls.update();
    this.time = 0;


    this.isPlaying = true;
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();

  }

  rangeRandom(start, end) {
    let r = Math.random();
    return r*(end - start) + start;
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    console.log(this.width, this.height)
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.coordinateSystem = 1;

    this.camera.updateProjectionMatrix();

  }

  addObjects() {

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {

      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.PlaneGeometry(1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    //this.scene.add(this.plane);
    let geo = new THREE.BufferGeometry();
    let number = 3000;
    const positions = new Float32Array(number*3);
    const sizes = new Float32Array(number);
    const velocity = new Float32Array(number);
    const distance = new Float32Array(number);

    for (let i = 0; i < number; i++) {
      let i3 = i*3;
      positions[i3] = 0;
      positions[i3+1] = Math.random()-0.5 + 0.5*(Math.random()-0.5);
      positions[i3+2] = 0;
      sizes[i] = Math.random()*1;
      velocity[i] = this.rangeRandom(0.1, 1);
      distance[i] = this.rangeRandom(0.1, 1);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aVelocity", new THREE.BufferAttribute(velocity, 1));
    geo.setAttribute("aDistance", new THREE.BufferAttribute(distance, 1));
    this.points = new THREE.Points(geo, this.material);
   this.scene.add(this.points);
  }


  render() {
    if (!this.isPlaying) return;
    requestAnimationFrame(this.render.bind(this));
    //console.log(this.renderer)
    console.log(this.camera)
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

