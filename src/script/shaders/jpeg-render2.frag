#define saturate(i) clamp(i,0.,1.)
#define lofi(i,j) floor((i)/(j)+.5)*(j)
#define PI 3.14159265

precision highp float;

uniform vec2 resolution;

uniform int blockSize;
uniform sampler2D sampler0;
uniform sampler2D samplerCareer;

// ------

bool validuv( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }

vec3 yuv2rgb( vec3 yuv ) {
  return vec3(
    yuv.x + 1.402 * yuv.z,
    yuv.x - 0.344136 * yuv.y - 0.714136 * yuv.z,
    yuv.x + 1.772 * yuv.y
  );
}

void main() {
  vec2 block = vec2( float( blockSize ) );
  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;

  ivec2 bs = ivec2( min( vec2( blockSize ), resolution - blockOrigin + 0.5 ) );

  vec2 delta = mod( gl_FragCoord.xy, float( blockSize ) );
  
  vec4 sum = vec4( 0.0 );
  for ( int iy = 0; iy < 64; iy ++ ) {
    if ( bs.y <= iy ) { break; }

    for ( int ix = 0; ix < 64; ix ++ ) {
      if ( bs.x <= ix ) { break; }

      vec2 fdelta = vec2( float( ix ), float( iy ) );
      vec4 val = texture2D( sampler0, ( blockOrigin + fdelta ) / resolution );

      float len = length( fdelta );
      vec2 uv = gl_FragCoord.xy / resolution;
      vec4 tex = texture2D( samplerCareer, uv );
      tex.x = tex.w == 0.0 ? 0.0 : tex.x;
      float q = 1.0 * pow( 1.0 - tex.x, 4.0 ) * len;

      val.x = 0.0 < q ? lofi( val.x, q * 0.1 ) : val.x;
      val.y = 0.0 < q ? lofi( val.y, q ) : val.y;
      val.z = 0.0 < q ? lofi( val.z, q ) : val.z;
      val.a = 0.0 < q ? lofi( val.a, q ) : val.a;
      val *= tex.w == 0.0 ? len : tex.x + 3.0 * len * q;

      float wave = (
        cos( delta.x * fdelta.x / float( bs.x ) * PI ) *
        cos( delta.y * fdelta.y / float( bs.y ) * PI )
      );
      sum += wave * val;
    }
  }

  sum.xyz = yuv2rgb( sum.xyz );

  gl_FragColor = vec4( sum.xyz, 1.0 );
}