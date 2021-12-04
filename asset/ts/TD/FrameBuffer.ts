import {GL} from './GL.js'
import { RenderBuffer } from './RenderBuffer.js';

export class FrameBuffer {
    private gl: WebGLRenderingContext = GL.instance;
    private frameBuffer: WebGLFramebuffer | null;
    public constructor() {
        this.frameBuffer = this.gl.createFramebuffer();
        if (!this.frameBuffer) {
            throw new Error("cannot create framebuffer.");
        }
    }

    public bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    }

    public unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    public setTexture2D(texture: WebGLTexture) {
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
    }

    public setRenderBufferDepthAttachment(renderBuffer: RenderBuffer) {
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderBuffer.GLRenderBuffer);
    }
}