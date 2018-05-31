import resources from 'E:/RSS/final-game/src/resources.js';

export default class Sprite {
    constructor (url, posSprite, size, posCanvas, speed, frames, dir, once) {
        this.posSprite = posSprite;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.posCanvas = posCanvas
    }
    
    update(dt) {
        this._index += dt * this.speed;
    }

    render(ctx, pic) {
        let frame;
        if ( this.speed != 0) {
            let max = this.frames.length;
            let index = Math.floor(this._index);
            frame = this.frames [index % max];
        }
        else {
            frame = 0;
        }
        let deltaX = 0, deltaY = 0;

        this.dir = "horizontal" ? deltaX = frame * this.size[0] : deltaY = frame * this.size[1];
        ctx.drawImage(resources.get(this.url), this.posSprite[0] + deltaX, this.posSprite[1] + deltaY, this.size[0], this.size[1], this.posCanvas[0], this.posCanvas[1], this.size[0], this.size[1]);
    }
};