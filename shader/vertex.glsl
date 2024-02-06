varying vec2 vUv;
float PI = 3.141592653589793238;
attribute float size;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_PointSize = size * ( 100.0 / -mvPosition.z );
	gl_Position = projectionMatrix * mvPosition;
}
