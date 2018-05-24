import MathCat from '../libs/mathcat';
const UltraCat = require( '../libs/ultracat' );
const glslify = require( 'glslify' );

// ------

module.exports = ( glCatPath, width, height, callback ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let image = new Image();
  let textureImage = glCat.createTexture();
  image.onload = () => {
    glCat.setTexture( textureImage, image );
    callback();
  }
  image.src = './images/h.png';

  // ------

  let vboQuad = glCat.createVertexbuffer( UltraCat.triangleStripQuad );
  let vboPos = glCat.createVertexbuffer( UltraCat.triangleStripQuad3 );
  let vboUv = glCat.createVertexbuffer( UltraCat.triangleStripQuadUV );

  // ------

  glCatPath.add( {
    background: {
      vert: glslify( '../shaders/object.vert' ),
      frag: glslify( '../shaders/background.frag' ),
      blend: [ gl.SRC_ALPHA, gl.ONE ],
      func: ( path, params ) => {
        glCat.attribute( 'pos', vboPos, 3 );
        glCat.attribute( 'uv', vboUv, 2 );

        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4ScaleXYZ( 10.0 ), matM );
        matM = MathCat.mat4Apply( MathCat.mat4Translate( [ 0.0, 0.0, -5.0 ] ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );

        glCat.uniformTexture( 'sampler0', glCatPath.fb( 'panelTex' ).texture, 0 );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },

    panelTex: {
      width: 1024,
      height: 1024,
      vert: glslify( '../shaders/quad.vert' ),
      frag: glslify( '../shaders/panel-tex.frag' ),
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
      float: true,
      framebuffer: true,
      func: ( path, params ) => {
        glCat.attribute( 'p', vboQuad, 2 );

        glCat.uniformTexture( 'sampler0', textureImage, 0 );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },

    panel: {
      vert: glslify( '../shaders/object.vert' ),
      frag: glslify( '../shaders/panel.frag' ),
      blend: [ gl.SRC_ALPHA, gl.ONE ],
      func: ( path, params ) => {
        glCat.attribute( 'pos', vboPos, 3 );
        glCat.attribute( 'uv', vboUv, 2 );

        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4ScaleXYZ( 3.0 ), matM );
        matM = MathCat.mat4Apply( MathCat.mat4Translate( [ 0.0, 0.0, 3.5 ] ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );

        glCat.uniformTexture( 'sampler0', glCatPath.fb( 'panelTex' ).texture, 0 );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    },
  } );
};