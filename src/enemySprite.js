import resources from './resources.js';

export default class enemySprite {
    constructor (posCanvas, speed, leftLegs, rightLegs, leftArms, bodys, rightArms, heads) {
        this.leftLegsParam = new GenericParametrs(leftLegs,[41,62], [21,0]);
        this.rightLegsParam = new GenericParametrs(rightLegs, [44,64],[22,0]);
        this.leftArmsParam = new GenericParametrs(leftArms, [200,151], [175,20]);
        this.rightArmsParam = new GenericParametrs(rightArms, [77,140], [25,30]);
        this.bodysParam = new GenericParametrs(bodys, [134,150], [67,100]);
        this.headsParam = new GenericParametrs(heads, [150,187], [90,100]); 
        this.idle = [
            [[-50,20,0],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]],
            [[-50,20,4],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,-4],     [-15,10,1]],
            [[-50,20,8],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,-8],     [-15,10,2]],
            [[-50,20,12],   [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,-12],    [-15,10,3]],
            [[-50,20,6],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,-6],     [-15,10,1.5]],
            [[-50,20,0],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]]
        ];
        this.attack = [
            [[-50,20,0],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]],
            [[-50,20,40],   [-18,90,0],    [15,90,-5],  [0,70,-2],  [50,20,-10],    [-17,10,1]],
            [[-50,20,80],   [-18,90,0],    [15,90,-10], [0,70,-4],  [50,20,-15],    [-18,10,2]],
            [[-50,20,120],  [-18,90,0],    [15,90,-20], [0,70,-6],  [50,20,-20],    [-20,10,3]],
            [[-50,20,60],   [-18,90,0],    [15,90,-10], [0,70,-3],  [50,20,-10],    [-17.5,10,1.5]],
            [[-50,20,0],    [-18,90,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]]
        ];
        this.hurt = [
            [[-50,20,0],    [-18,89,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]],
            [[-49,20,-4],   [-18,88,1],    [15,91,-1],  [0,70,2],   [50,20,-10],    [-14,9,10]],
            [[-48,20,-8],   [-18,87,2],    [15,92,-2],  [0,70,4],   [50,20,-15],    [-13,8,20]],
            [[-47,20,-12],  [-18,86,3],    [15,93,-3],  [0,70,6],   [50,20,-20],    [-12,7,30]],
            [[-48.5,20,-6], [-18,88,1.5],  [15,91.5,-1.5],  [0,70,3],   [50,20,-10],    [-13.5,8.5,15]],
            [[-50,20,0],    [-18,89,0],    [15,90,0],   [0,70,0],   [50,20,0],      [-15,10,0]]
        ];
        this.speed = typeof speed === 'number' ? speed : 0;
        this.posCanvas = posCanvas;
        this.parts = [this.leftArmsParam, this.leftLegsParam, this.rightLegsParam, this.bodysParam, this.rightArmsParam, this.headsParam];
        this.frames = this.idle;
        this._index = 0;
        this.once = false;
    } 
    update(dt) {
        this._index += dt * this.speed;
    }

    render(ctx) {
        let frame;
        if (this.speed != 0) {
            let max = this.frames.length;
            let index = Math.floor(this._index);
            frame = this.frames[index % max];
            if (this.once && frame == _.last(this.frames)) {
                this.once = false;
                this.frames = this.idle;
            } 
        }
        else {
            frame = 0;
        }
        const TO_RADIANS = Math.PI/180; 
        for (let i=0; i< this.parts.length; i++) {
            let part = this.parts[i];
            ctx.save(); 
            ctx.translate(this.posCanvas[0] + frame[i][0], this.posCanvas[1]+ frame[i][1]);
            ctx.rotate( frame[i][2] * TO_RADIANS);
            ctx.drawImage(resources.get(part.url), part.simpleSize[0] * part.pos, 0, part.simpleSize[0], part.simpleSize[1], -(part.wrapPoint[0]), -(part.wrapPoint[1]), part.simpleSize[0], part.simpleSize[1]);
            ctx.restore(); 
        } 
    }

    action(move) {
        this.frames = this[move];
        this._index = 0;
        this.once = true;
    }
};

class GenericParametrs{
    constructor(url,simpleSize, wrapPoint) {
        this.url = url;
        this.simpleSize = simpleSize;
        this.wrapPoint = wrapPoint;
        this.pos = _.random(0,5);
    }
}
