import MathCat from '../libs/mathcat';
const UltraCat = require( '../libs/ultracat' );
const genOctahedron = require( '../geoms/octahedron' );
const glslify = require( 'glslify' );

// ------

let oct = genOctahedron( { div: 0 } );

const instancesSqrt = 50;
const instances = instancesSqrt * instancesSqrt;
let noiseUV = UltraCat.matrix2d( instancesSqrt, instancesSqrt ).map( ( v ) => (
  ( v + 0.5 ) / instancesSqrt
) );

// ------

module.exports = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let vboPos = glCat.createVertexbuffer( oct.position );
  let vboNor = glCat.createVertexbuffer( oct.normal );
  let ibo = glCat.createIndexbuffer( oct.index );

  let vboNoiseUV = glCat.createVertexbuffer( noiseUV );

  // ------

  glCatPath.add( {
    cubeArray: {
      vert: glslify( '../shaders/cubes.vert' ),
      frag: glslify( '../shaders/shade-dir.frag' ),
      blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
      func: ( path, params ) => {
        glCat.attribute( 'noiseUV', vboNoiseUV, 2, 1 );
        glCat.attribute( 'pos', vboPos, 3 );
        glCat.attribute( 'nor', vboNor, 3 );
        glCat.uniform3fv( 'color', [ 1.0, 1.0, 1.0 ] );
        glCat.uniform3fv( 'lightDir', [ -1.0, -1.0, -1.0 ] );

        let matM = MathCat.mat4Identity();
        glCat.uniformMatrix4fv( 'matM', matM );

        glCat.uniformTexture( 'samplerNoise1', params.noise1, 0 );

        let ext = glCat.getExtension( "ANGLE_instanced_arrays" );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibo );
        ext.drawElementsInstancedANGLE( gl.TRIANGLES, ibo.length, gl.UNSIGNED_SHORT, 0, instances );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
      }
    },
  } );
};