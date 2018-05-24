#define lofi(i,j) floor((i)/(j)+.5)*(j)
#define PI 3.14159265

// ------

precision highp float;

uniform vec2 resolution;

uniform bool isVert;
uniform int blockSize;
uniform sampler2D sampler0;
uniform sampler2D samplerCareer;

// ------

vec3 rgb2yuv( vec3 rgb ) {
  return vec3(
    0.299 * rgb.x + 0.587 * rgb.y + 0.114 * rgb.z,
    -0.148736 * rgb.x - 0.331264 * rgb.y + 0.5 * rgb.z,
    0.5 * rgb.x - 0.418688 * rgb.y - 0.081312 * rgb.z
  );
}

void main() {
  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );
  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );
  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;
  int bs = int( min( float( blockSize ), dot( bv, resolution - blockOrigin + 0.5 ) ) );

  float freq = floor( mod( dot( bv, gl_FragCoord.xy ), float( blockSize ) ) ) / float( bs ) * PI;
  float factor = ( freq == 0.0 ? 1.0 : 2.0 ) / float( bs );

  vec4 sum = vec4( 0.0 );
  for ( int i = 0; i < 1024; i ++ ) {
    if ( bs <= i ) { break; }

    vec2 delta = float( i ) * bv;
    float wave = cos( ( float( i ) + 0.5 ) * freq );

    vec2 uv = ( blockOrigin + delta ) / resolution;
    vec4 val = texture2D( sampler0, uv );
    if ( !isVert ) { val.xyz = rgb2yuv( val.xyz ); }
    sum += wave * factor * val;
  }

  if ( isVert ) {
    // float len = length( floor( mod( gl_FragCoord.xy, float( blockSize ) ) ) );

    // float q = quantize + quantizeF * len;

    // sum.x = 0.0 < q ? lofi( sum.x, q ) : sum.x;
    // sum.y = 0.0 < q ? lofi( sum.y, q ) : sum.y;
    // sum.z = 0.0 < q ? lofi( sum.z, q ) : sum.z;
    // sum.a = 0.0 < q ? lofi( sum.a, q ) : sum.a;

    // sum *= 1.0 + len * highFreqMultiplier;
  }

  gl_FragColor = sum;
}