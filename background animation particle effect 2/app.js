let canvas = document.querySelector('#background-animation');
let ctx = canvas.getContext('2d');

function makeCanvasFullscreen()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

makeCanvasFullscreen();

window.addEventListener('resize', makeCanvasFullscreen);

let pointsCount = 100;
let stepSize = 2;
let maxLineDis = 250;

let points = [];

function radian(deg)
{
    return deg * Math.PI / 180;
}

function dis(a, b)
{
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function makePoint(step = stepSize)
{
    let deg = radian(Math.random() * 360);
    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        xStep: Math.cos(deg) * step,
        yStep: Math.sin(deg) * step,
    });
}

function makePoints()
{
    for(let i = 0;i < pointsCount;i++)
    {
        makePoint();
    }
}

function clearCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPoints(radius = 1, color = 'white')
{
    ctx.fillStyle = color;
    points.forEach((point) => {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });
}

function updatePoint(point, step = 2)
{
    point.x += point.xStep;
    point.y += point.yStep;

    if(point.x < 0)
        point.x *= -1,
            point.xStep *= -1;
    else if(point.x > canvas.width)
        point.x = canvas.width - (point.x - canvas.width),
            point.xStep *= -1;

    if(point.y < 0)
        point.y *= -1,
            point.yStep *= -1;
    else if(point.y > canvas.height)
        point.y = canvas.height - (point.y - canvas.height),
            point.yStep *= -1;

    return point;
}

function drawLines(color = 'white', strokeWidth = 2)
{
    for(let i = 0;i < points.length;i++)
        for(let j = 0;j < points.length;j++)
        {
            if(dis(points[i], points[j]) < maxLineDis)
            {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.globalAlpha = (100 - (dis(points[i], points[j]) * 100 / maxLineDis)) / 100;
                ctx.lineWidth = strokeWidth;
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
}

function updatePoints()
{
    for(let i = 0;i < points.length;i++)
        points[i] = updatePoint(points[i]);
}

makePoints();

function render()
{
    clearCanvas();
    drawPoints();
    drawLines();
    updatePoints();

    requestAnimationFrame(render);
}

render();