// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}
/////////////////////////////////////////////////////////////////
function sepiaFilter(img){
    var imageOut = createImage(img.width , img.height);

    imageOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x<img.width; x++)
    {
        for (var y = 0; y<img.height; y++)
        {
            var index = (y*img.width + x)*4;

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];

            var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
            newRed = floor(constrain(newRed, 0, 255));

            var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
            newGreen = floor(constrain(newGreen, 0, 255));

            var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);
            newBlue = floor(constrain(newBlue, 0, 255));

            imageOut.pixels[index + 0 ] = newRed;
            imageOut.pixels[index + 1 ] = newGreen;
            imageOut.pixels[index + 2 ] = newBlue;
            imageOut.pixels[index + 3 ] = 255;
        }
    }
    imageOut.updatePixels();
    return imageOut;
}
/////////////////////////////////////////////////////////////////
function darkCorners(img){
    var imageOut = createImage(img.width , img.height);

    imageOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x<img.width; x++)
    {
        for (var y = 0; y<img.height; y++)
        {
            var index = (y*img.width + x)*4;

            var distance = floor(dist(x, y, img.width/2, img.height/2 ));


            var dynLum;

            if (distance >= 300 && distance <= 450)
            {
                dynLum = map(distance, 300, 450, 1, 0.4);
            }
            else if (distance > 450)
            {
                dynLum = map(distance, 450, 500, 0.4, 0);
            }
            else if (distance < 300)
            {
                dynLum = 1;
            }

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];

            var newRed = oldRed * dynLum;
            newRed = floor(constrain(newRed, 0, 255));

            var newGreen = oldGreen * dynLum;
            newGreen = floor(constrain(newGreen, 0, 255));

            var newBlue = oldBlue * dynLum;
            newBlue = floor(constrain(newBlue, 0, 255));

            imageOut.pixels[index + 0 ] = newRed;
            imageOut.pixels[index + 1 ] = newGreen;
            imageOut.pixels[index + 2 ] = newBlue;
            imageOut.pixels[index + 3 ] = 255;
        }
    }
    imageOut.updatePixels();
    return imageOut;
}
/////////////////////////////////////////////////////////////////
function radialBlurFilter(img){
    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;
            var dynBlur = floor(dist(x, y, mouseX, mouseY));
            dynBlur = constrain(dynBlur, 100, 300);
            dynBlur = map(dynBlur, 100, 300, 0, 1);
            //var dynBlur = map(distance, 100, 300, 0, 1);
            var c = convolution(x, y, matrix, matrixSize, img);

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
            imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
            imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur);
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
/////////////////////////////////////////////////////////////////
function borderFilter(img){
    var buffer = createGraphics(img.width, img.height);
    buffer.image(img, 0, 0);
    buffer.noFill();
    buffer.stroke(255);
    buffer.strokeWeight(25);
    buffer.rect(0, 0, img.width, img.height, 50);
    buffer.rect(0, 0, img.width, img.height);

    return buffer;
}
/////////////////////////////////////////////////////////////////////////
function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}


