#define PI 3.141592654
#define TAU 6.283185307
#define lofi(i,j) floor((i)/(j)+.5)*(j)

precision highp float;

uniform float progress;
uniform vec2 resolution;
uniform sampler2D sampler0;

// ------

vec2 invertUV( vec2 v ) { return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * v; }
bool validUV( vec2 v ) { return all( lessThan( abs( v - 0.5 ), vec2( 0.5 ) ) ); }

mat2 rotate2D( float t ) { return mat2( cos( t ), sin( t ), -sin( t ), cos( t ) ); }

float hash( float v ) {
  return fract( sin( v * 5814.22 ) * 481.22 );
}

// ------

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uvq = abs( uv - 0.5 );

  bool disp = false;

  if (
    0.45 < uvq.y
    && uvq.y < 0.49
    && mod( uvq.y, 0.01 ) < 0.005
    && uvq.x < 0.485
  ) {
    float py = lofi( uv.y, 0.01 );
    float speed = hash( py ) * 2.0 - 1.0;
    float px = uv.y < 0.5 ? uv.x : -uv.x;
    px = lofi( mod( px + speed * progress, abs( speed ) ), 0.01 );
    if ( 0.3 < hash( px + hash( py ) ) ) {
      disp = true;
    }
  }

  if (
    all( lessThan( uvq, vec2( 0.1 ) ) )
    && any( lessThan( vec2( 0.02 ), uvq ) )
  ) {
    uv = rotate2D( 2.0 * TAU * progress ) * ( uv - 0.5 ) + 0.5;
  }

  if ( 0.5 < texture2D( sampler0, invertUV( uv ) ).w ) {
    disp = true;
  }

  if ( disp ) { gl_FragColor = vec4( 1.0 ); }
  else { discard; }
}