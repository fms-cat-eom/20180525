#define TAU 6.283185307

precision highp float;

varying vec2 vUv;

uniform float progress;
uniform vec4 bgColor;

// ------

void main() {
  vec2 uv = vUv;
  uv.x = -0.5 * abs( uv.x - 0.5 );
  float phase = 30.0 * ( uv.x + uv.y ) + 2.0 * TAU * progress;
  float m = smoothstep( -0.1, 0.1, sin( phase ) );
  gl_FragColor = vec4( mix(
    vec3( 0.00, 0.00, 0.00 ),
    vec3( 0.02, 0.02, 0.02 ),
    m
  ), 1.0 );
}