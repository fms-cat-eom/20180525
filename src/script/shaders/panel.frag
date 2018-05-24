#define PI 3.141592654
#define TAU 6.283185307
#define lofi(i,j) floor((i)/(j)+.5)*(j)

precision highp float;

varying vec2 vUv;
uniform float progress;
uniform sampler2D sampler0;

// ------

vec2 invertUV( vec2 v ) { return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * v; }
bool validUV( vec2 v ) { return all( lessThan( abs( v - 0.5 ), vec2( 0.5 ) ) ); }

float hash( float v ) {
  return fract( sin( v * 5814.22 ) * 481.22 );
}

// ------

void main() {
  vec2 uv = vUv;
  uv = 1.1 * ( uv - 0.5 ) + 0.5;

  vec2 deform = vec2( 0.0 );

  {
    float h1 = hash( lofi( uv.x + uv.y, 0.2 ) );
    float h2 = hash( 2.5 + lofi( uv.x + uv.y, 0.2 ) );
    float v = mod( h1 + uv.x + uv.y + progress, 1.0 );
    if ( 0.9 + 0.2 * h2 < v ) {
      deform += 0.01;
    }
  }

  if ( !validUV( uv ) ) { discard; }

  gl_FragColor = vec4( 1.0 );
  for ( int i = 0; i < 3; i ++ ) {
    vec2 v = uv + deform * ( 1.0 + float( i ) );
    gl_FragColor[ i ] = (
      validUV( v )
      ? texture2D( sampler0, v )[ i ]
      : 0.0
    );
  }
}