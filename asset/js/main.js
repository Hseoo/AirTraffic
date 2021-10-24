import { Buffer } from './TD/Buffer.js';
import { Camera } from './TD/Camera.js';
import { Earth } from './TD/Earth.js';
import { GL } from './TD/GL.js';
import { Shader } from './TD/Shader.js';
import { ShaderProgram } from './TD/ShaderProgram.js';
import { Texture } from './TD/Texture.js';
import mat4 from './tsm/mat4.js';
import vec3 from './tsm/vec3.js';
main();
function main() {
    const gl = GL.instance;
    initGL(gl);
    Earth.create(1.0, 36, 36);
    let vshader = new Shader("earth.vert", gl.VERTEX_SHADER);
    let fshader = new Shader("earth.frag", gl.FRAGMENT_SHADER);
    let prog = new ShaderProgram("earth");
    let cprog = prog.getShaderProgram(vshader, fshader);
    prog.use();
    let vertexBuffer = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    vertexBuffer.upload(new Float32Array(Earth.vertex));
    vertexBuffer.unbind();
    let indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    indexBuffer.uploadUShort(new Uint16Array(Earth.index));
    indexBuffer.unbind();
    let uvBuffer = new Buffer(gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    uvBuffer.upload(new Float32Array(Earth.texcoord));
    uvBuffer.unbind();
    vertexBuffer.bind();
    prog.setVertexArrayObject("vPosition", vertexBuffer, 3, gl.FLOAT, false, 0, 0);
    vertexBuffer.unbind();
    uvBuffer.bind();
    let uvAttrb = prog.getAttributeLocation("vinTexturecoord");
    gl.enableVertexAttribArray(uvAttrb);
    gl.vertexAttribPointer(uvAttrb, 2, gl.FLOAT, false, 0, 0);
    uvBuffer.unbind();
    let texture = new Texture("/asset/textures/earth_day.jpg", gl.TEXTURE0);
    gl.uniform1i(prog.getUniformLocation("uTexture"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture.getWebGLTexture());
    indexBuffer.bind();
    let orbitRadius = 100;
    let zoom = 0.7;
    let pov = Math.PI / 3;
    let aspect = 1.0;
    let camera = new Camera(pov, aspect, 0.1, 2000);
    function initCamera(radian, axis, prog) {
        let cameraMatrix = new mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        cameraMatrix.rotate(radian, axis);
        cameraMatrix.translate(new vec3([0, 0, orbitRadius / zoom]));
        let InverseCameraTransform = cameraMatrix.copy().inverse();
        let CameraProjection = camera.proMatrix;
        let uCameraMatrix = CameraProjection.multiply(InverseCameraTransform);
        let uict = prog.getUniformLocation("uCameraMatrix");
        gl.uniformMatrix4fv(uict, false, uCameraMatrix.all());
        return uCameraMatrix;
    }
    function camRotateZ(cameraMatrix, radian) {
        cameraMatrix.rotate(radian, new vec3([0, 0, 1]));
        let uict = prog.getUniformLocation("uCameraMatrix");
        gl.uniformMatrix4fv(uict, false, cameraMatrix.all());
    }
    function camRotateX(cameraMatrix, radian) {
        cameraMatrix.rotate(radian, new vec3([1, 0, 0]));
        let uict = prog.getUniformLocation("uCameraMatrix");
        gl.uniformMatrix4fv(uict, false, cameraMatrix.all());
    }
    let cam = initCamera(Math.PI / 2, new vec3([1, 0, 0]), prog);
    draw();
    var tick = setInterval(function () {
        camRotateX(cam, -Math.PI / 360);
        draw();
    }, 100);
}
function initGL(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function draw() {
    const gl = GL.instance;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, Earth.index.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}
//# sourceMappingURL=main.js.map