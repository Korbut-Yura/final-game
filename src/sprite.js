import resources from './resources.js';

export default class Sprite {
    constructor (url, posSprite, size, posCanvas, speed, frames, dir, once, dynamic, map) {
        this.posSprite = posSprite;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir||'horisontal';
        this.once = once;
        this.posCanvas = posCanvas;
        this.dynamic = dynamic;
        this.spriteMap = map;
    }
    
    update(dt) {
        this._index += dt * this.speed;
        if (this.dynamic) {
            this.dynamic == "right" ? this.posCanvas[0] += dt*2*this.size[0] : this.posCanvas[0] -= dt*2*this.size[0];
        }
    }

    render(ctx) {
        let frame;
        if (this.speed != 0) {
            let max = this.frames.length;
            let index = Math.floor(this._index);
            if (this.once == "last" && this._index >= max) {
                frame = _.last(this.frames);
            }
            else {
                frame = this.frames[index % max];
            }
            if (this.once === true && frame == _.last(this.frames)) {
                this.once = false;
                this.posSprite[1] = 0;
            } 
        }
        else {
            frame = 0;
        }
        let deltaX = 0, deltaY = 0;
        this.dir === "horisontal" ? deltaX = frame * this.size[0] : deltaY = frame * this.size[1];
        ctx.drawImage(resources.get(this.url), this.posSprite[0] + deltaX, this.posSprite[1] + deltaY, this.size[0], this.size[1], this.posCanvas[0], this.posCanvas[1], this.size[0], this.size[1]);
    }

    action(move) {
        this.posSprite[1] += this.size[1]*(this.spriteMap.indexOf(move));
        move === 'die' ? this.once = 'last' : this.once = true;
        this._index = 0;
    }
};