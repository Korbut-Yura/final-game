import resources from './resources.js';

export default class Sprite {
    constructor (url, posSprite, size, posCanvas, speed, frames, dir, once, dynamic, map) {
        this.posSprite = posSprite;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.posCanvas = posCanvas;
        this.dynamic = dynamic;
        this.spriteMap = map;
    }
    
    update(dt) {
        this._index += dt * this.speed;
        if (this.dynamic) {
            this.posCanvas[0] += dt*2*this.size[0];
        }
    }

    render(ctx, pic) {
        let frame;
        if (this.speed != 0) {
            let max = this.frames.length;
            let index = Math.floor(this._index);
            frame = this.frames[index % max];
            if (this.once && frame == _.last(this.frames)) {
                this.once = false;
                this.posSprite[1] = 0;
            } 
        }
        else {
            frame = 0;
        }
        let deltaX = 0, deltaY = 0;

        this.dir = "horizontal" ? deltaX = frame * this.size[0] : deltaY = frame * this.size[1];
        ctx.drawImage(resources.get(this.url), this.posSprite[0] + deltaX, this.posSprite[1] + deltaY, this.size[0], this.size[1], this.posCanvas[0], this.posCanvas[1], this.size[0], this.size[1]);
    }

    attack(self, spell) {
        this.posSprite[1] += this.size[1]*(this.spriteMap.indexOf('attack'));
        this.once = true;
        this._index = 0;
    }

    hurt() {
        this.posSprite[1] += this.size[1]*(this.spriteMap.indexOf('hurt'));
        this.once = true;
        this._index = 0;
    }
    
    die() {
        this.posSprite[1] += this.size[1]*(this.spriteMap.indexOf('die'));
        this.once = true;
        this._index = 0;
    }
};