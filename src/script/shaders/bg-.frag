#define TAU 6.283185307

precision highp float;

uniform vec2 resolution;
uniform float progress;
uniform vec4 bgColor;

// ------

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv.x = -0.5 * abs( uv.x - 0.5 );
  float phase = 30.0 * ( uv.x + uv.y ) + 2.0 * TAU * progress;
  float mul = 1.0 + smoothstep( -0.1, 0.1, sin( phase ) );
  gl_FragColor = vec4( bgColor.xyz * mul, 1.0 );
}