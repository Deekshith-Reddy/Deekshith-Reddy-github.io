var canvas = document.getElementById("tutorial");
var ctx = canvas.getContext('2d');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const palette = random.shuffle(random.pick(palettes)).slice(1, 6);

const creatGrid = () => {
    const points = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const u = count <= 1 ? 0.5 : i / (count - 1);
            const v = count <= 1 ? 0.5 : j / (count - 1);
            const radius = Math.abs(random.noise2D(u, v)) * 0.005 * count;
            points.push({
                color: random.pick(palette),
                radius,
                position: [u, v]
            });
        }

    }
    return points;
};

const points = creatGrid();
const margin = 100;
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);

points.forEach(data => {
    const { color, position, radius } = data;
    const [u, v] = position;
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);


    ctx.beginPath();
    ctx.arc(x, y, width * radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
})