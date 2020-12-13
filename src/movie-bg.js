const { lerp } = require("canvas-sketch-util/math");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes/500.json');
var canvas = document.getElementById("canva-art")
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext('2d')

const palette = random.shuffle(random.pick(palettes)).slice(0,5);
document.querySelector('.heading').style.color = palette[1];

$(".btn").css("color",palette[1])

$(".btn").css("border","1px solid black")

const createGrid = () => {
    const points = [];
    const count = 5;
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

const points = createGrid()
const margin = 100;
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