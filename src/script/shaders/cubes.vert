#define HUGE 9E16
#define PI 3.14159265
#define TAU 6.28318531
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

attribute vec3 pos;
attribute vec3 nor;
attribute vec2 noiseUV;

uniform float progress;
uniform vec2 resolution;

varying vec3 vPos;
varying vec3 vNor;
varying vec4 vCol;

uniform mat4 matP;
uniform mat4 matV;
uniform mat4 matM;

uniform sampler2D samplerNoise1;

// ------

mat2 rotate2D( float t ) { return mat2( cos( t ), sin( t ), -sin( t ), cos( t ) ); }

// ------

void main() {
  vec3 tex = texture2D( samplerNoise1, noiseUV ).xyz;
  tex *= vec3( 1.0, 2.0, 3.0 );

  float size = ( 0.02 + 0.1 * length( tex ) );
  vec4 p = matM * vec4( size * pos, 1.0 );
  p.yz = rotate2D( 3.0 * tex.x ) * p.yz;
  p.zx = rotate2D( 3.0 * tex.y ) * p.zx;

  vec3 trans = vec3( 0.0 );
  trans.xy += 4.0 * ( noiseUV * 2.0 - 1.0 );
  trans.xyz += tex;
  p.xyz += trans;

  vPos = p.xyz;

  vec3 n = nor;
  n.yz = rotate2D( 3.0 * tex.x ) * n.yz;
  n.zx = rotate2D( 3.0 * tex.y ) * n.zx;

  mat4 matN = matM;
  matN[ 0 ] = normalize( matN[ 0 ] );
  matN[ 1 ] = normalize( matN[ 1 ] );
  matN[ 2 ] = normalize( matN[ 2 ] );
  matN[ 3 ] = vec4( 0.0, 0.0, 0.0, 1.0 );
  vNor = ( matN * vec4( n, 1.0 ) ).xyz;

  vec4 outPos = matP * matV * p;
  outPos.x /= resolution.x / resolution.y;
  
  gl_Position = outPos;

  vec3 c = tex.yzx;
  vCol = vec4( 0.5 + 0.5 * c, 1.0 );
}