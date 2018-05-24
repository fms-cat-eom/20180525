import MathCat from '../libs/mathcat';
const UltraCat = require( '../libs/ultracat' );
const glslify = require( 'glslify' );

// ------

module.exports = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboQuad = glCat.createVertexbuffer( UltraCat.triangleStripQuad );

  // ------

  glCatPath.add( {
    bloom: {
      width: width / 4,
      height: height / 4,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/gauss.frag' ),
      blend: [ gl.ONE, gl.ONE ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      tempFb: glCat.createFramebuffer( width / 4, height / 4 ),
      func: ( path, params ) => {
        glCat.attribute( "p", vboQuad, 2 );

        for ( let i = 0; i < 3; i ++ ) {
          let gaussVar = [ 3.0, 10.0, 30.0 ][ i ];
          glCat.uniform1f( "var", gaussVar );

          gl.bindFramebuffer( gl.FRAMEBUFFER, path.tempFb.framebuffer );
          glCat.clear( ...path.clear );
          glCat.uniform1i( "isVert", false );
          glCat.uniformTexture( "sampler0", params.input, 0 );
          gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
          
          gl.bindFramebuffer( gl.FRAMEBUFFER, params.framebuffer );
          glCat.uniform1i( "isVert", true );
          glCat.uniformTexture( "sampler0", path.tempFb.texture, 0 );
          gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
        }
      }
    },
  
    bloomFinalize: {
      width: width,
      height: height,
      vert: glslify( "../shaders/quad.vert" ),
      frag: glslify( "../shaders/bloom-finalize.frag" ),
      blend: [ gl.ONE, gl.ZERO ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( "p", vboQuad, 2 );
        glCat.uniform3fv( "bias", params.bias );
        glCat.uniform3fv( "factor", params.factor );
        glCat.uniformTexture( "samplerDry", params.dry, 0 );
        glCat.uniformTexture( "samplerWet", params.wet, 1 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};