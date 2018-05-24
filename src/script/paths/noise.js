import MathCat from '../libs/mathcat';
const glslify = require( 'glslify' );

// ------

module.exports = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  // ------

  glCatPath.add( {
    noise: {
      width: 512,
      height: 512,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/my-noise.frag' ),
      blend: [ gl.ONE, gl.ZERO ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};