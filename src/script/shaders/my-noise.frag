#define PI 3.141592654
#define TAU 6.283185307

precision highp float;

uniform float progress;
uniform vec2 resolution;
uniform sampler2D sampler0;

#pragma glslify: noise = require( './glsl-noise/simplex/4d.glsl' );

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv += 0.7 * sin( 2.0 * length( uv - 0.5 ) - TAU * progress ) * ( uv - 0.5 );
  uv *= 2.5;
  // uv.x += 0.1 * sin( 10.0 * uv.y + TAU * progress );

  vec3 nz1 = vec3(
    noise( vec4( uv, 0.123, 2.0 * progress ) ),
    noise( vec4( uv, 0.523, 2.0 * progress ) ),
    noise( vec4( uv, 0.823, 2.0 * progress ) )
  );
  vec3 nz2 = vec3(
    noise( vec4( uv, 0.123, 2.0 * ( progress - 1.0 ) ) ),
    noise( vec4( uv, 0.523, 2.0 * ( progress - 1.0 ) ) ),
    noise( vec4( uv, 0.823, 2.0 * ( progress - 1.0 ) ) )
  );
  vec3 nz = mix( nz1, nz2, smoothstep( 0.7, 1.0, progress ) );

  gl_FragColor = vec4( nz, 1.0 );
}
