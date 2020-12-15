const { lerp } = require("canvas-sketch-util/math");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/500.json');


var canvas = document.getElementById("canva-art")
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext('2d')

var canvas2 = document.getElementById("canva-art2")
canvas2.width = canvas2.clientWidth;
canvas2.height = canvas2.clientHeight;
var ctx2  = canvas2.getContext('2d')


const palette = random.shuffle(random.pick(palettes)).slice(0,5);
document.querySelector('.heading').style.color = palette[1];
$(".btn").css("backgroundColor","black")
$(".btn").css("color",'white')

$(".btn").css("border","1px solid black")

const createGrid = (counter) => {
    const points = [];
    const count = counter;
    for(let i = 0; i < count; i++){
        for(let j = 0; j < count; j++){
            const u = count <= 1 ? 0.5 : i / (count-1)
            const v = count <= 1 ? 0.5 : j / (count-1)
            points.push({
                position: [u, v],
                color: random.pick(palette)
            })
        }
    }
    return points;
}

const points = createGrid(5)
const margin = 30;
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;
console.log(width, height)
ctx.fillStyle = 'white'
ctx.fillRect(0,0, width, height);

points.forEach(data => {
    const {position, color} = data;
    const [u, v] = position;
    
    const x = lerp(margin, width-margin, u);
    const y = lerp(margin, height-margin, v);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(random.range(margin, (width-margin)),random.range(margin, (height-margin)))
    ctx.lineTo(random.range(margin, (width-margin)),random.range(margin, (height-margin)))
    //ctx.arc(x, y, Math.abs(random.gaussian())*width/10, 0, Math.PI*random.range(1,2), false)
    ctx.fillStyle = color;
    ctx.fill();
    
})

const points2 = createGrid(30)
const margin2 = 50;
const width2 = canvas2.offsetWidth;
const height2 = canvas2.offsetHeight;
console.log(width2, height2)
ctx2.globalAlpha = 0.5;
points2.forEach(data2 => {
    const position2 = data2.position;
    const color2 = data2.color;
    const [u2, v2] = position2;

    const x2 = lerp(margin2, width2-margin2, u2);
    const y2 = lerp(margin2, height2-margin2, v2);
    
    if(random.chance(0.75)){
       ctx2.beginPath();
    ctx2.arc(x2, y2, random.range(10,200), 0, Math.PI * 2)
    ctx2.fillStyle = color2;
    ctx2.fill(); 
    }
    
})
