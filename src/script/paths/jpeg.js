import MathCat from '../libs/mathcat';
const glslify = require( 'glslify' );

const blockSize = 16.0;

// ------

module.exports = ( glCatPath, width, height, auto ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  // ------

  glCatPath.add( {
    jpegCosine: {
      width: width,
      height: height,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/jpeg-cosine.frag' ),
      blend: [ gl.ONE, gl.ONE ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      tempFb: glCat.createFloatFramebuffer( width, height ),
      func: ( path, params ) => {
        glCat.attribute( "p", vboQuad, 2 );
        glCat.uniform1i( "blockSize", blockSize );

        glCat.uniform1f( "quantize", 0.1 );
        glCat.uniform1f( "quantizeF", 0.0 );
        glCat.uniform1f( "highFreqMultiplier", 0.0 );
        
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
    },

    jpegRender: {
      width: width,
      height: height,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/jpeg-render.frag' ),
      blend: [ gl.ONE, gl.ONE ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      tempFb: glCat.createFloatFramebuffer( width, height ),
      func: ( path, params ) => {
        glCat.attribute( "p", vboQuad, 2 );
        glCat.uniform1i( "blockSize", blockSize );

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
    },

    jpegRender2: {
      width: width,
      height: height,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/jpeg-render2.frag' ),
      blend: [ gl.ONE, gl.ONE ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( "p", vboQuad, 2 );
        glCat.uniform1i( "blockSize", blockSize );
        glCat.uniformTexture( "sampler0", params.input, 0 );
        glCat.uniformTexture( "samplerCareer", params.career, 1 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};