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

var isEarlyBird;
var selection;
var filterName;
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height + 200);
    pixelDensity(1);

    //Variables to define initial filter
    isEarlyBird = true;
    selection = 0;
    filterName = "Early Bird";
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(255);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    textBar();
    noLoop();
}

/////////////////////////////////////////////////////////////////
function mousePressed(){
    // Condition to ensure that radial blur is only active on the Early Bird filter
    if (isEarlyBird){
        loop();
    }
}
/////////////////////////////////////////////////////////////////
function keyPressed(){
    if (keyCode === 88 && selection < 4) // 88 = x key
    {
        //Moves to next filter
        selection ++;
        changeFilter();
    }
    if (keyCode === 90 && selection > 0) // 90 = z key
    {
        //moves to previous filter
        selection --;
        changeFilter();
    }
}
////////////////////////////////////////////////////////////////
function changeFilter(){
    var imgOut;
    // Condition changes when selection variable changes
    switch (selection)
    {
        case 0: //Early bird filter
            isEarlyBird = true;
            filterName = "Early Bird";
            earlyBirdFilter(imgIn);
            loop();
            break;
        case 1: //Edge detection filter
            isEarlyBird = false;
            filterName = "Edge Detection";
            textBar();
            imgOut = edgeDetectionFilter(imgIn);
            imgOut = borderFilter(imgOut);
            image(imgOut, imgIn.width,0);
            break;
        case 2: //Sharpen filter
            isEarlyBird = false;
            filterName = "Sharpen";
            textBar();
            imgOut = sharpenFilter(imgIn);
            imgOut = borderFilter(imgOut);
            image(imgOut, imgIn.width,0);
            break;
        case 3: //Emboss filter
            isEarlyBird = false;
            filterName = "Emboss";
            textBar();
            imgOut = embossFilter(imgIn);
            imgOut = borderFilter(imgOut);
            image(imgOut, imgIn.width,0);
            break;
        case 4: //Pop Art filter
            isEarlyBird = false;
            filterName = "Pop Art";
            textBar();
            imgOut = popArtFilter(imgIn);
            imgOut = borderFilter(imgOut);
            image(imgOut, imgIn.width,0);
            break;
    }
}
/////////////////////////////////////////////////////////////////
//Function to display text at the bottom of the canvas
function textBar(){
    fill(0);
    textSize(18);
    text("Press 'X' to select next filter",
        30,
        imgIn.height + 50);
    text("Press 'Z' to select previous  filter",
        30,
        imgIn.height + 100);
    //
    text("Current Filter: " + filterName,
        width/2 + 30,
        imgIn.height + 50 );
    //Displays further instructions when Early Bird filter is selected
    if (isEarlyBird)
    {
        text("Click anywhere on the left image to center radial blur",
            width/2 + 30,
            imgIn.height + 100);
    }
    //Ensures that filter name text is dynamic
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

            //Coverts the old pixel colours into new values and constrains up to 255
            var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
            newRed = floor(constrain(newRed, 0, 255));

            var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
            newGreen = floor(constrain(newGreen, 0, 255));

            var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);
            newBlue = floor(constrain(newBlue, 0, 255));
            //Applies new rgb values to the image
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
            // Works out the luminance value
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
            // new RGB values are scaled by luminance values
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
            //dynBlur works out what pixels are blurred using mouse location
            var dynBlur = floor(dist(x, y, mouseX, mouseY));
            dynBlur = constrain(dynBlur, 100, 300);
            dynBlur = map(dynBlur, 100, 300, 0, 1);
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
//Function creates a rounded border around filtered image
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
/////////////////////////////////////////////////////////////////////////
//Filter code from Week 15
function edgeDetectionFilter(img){

    var matrixX = [    // in javascript format
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];
    //vertical edge detection / horizontal lines
    var matrixY = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrixX.length;

    imgOut.loadPixels();
    img.loadPixels();

    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;
            var cX = convolution(x, y, matrixX, matrixSize, img);
            var cY = convolution(x, y, matrixY, matrixSize, img);

            cX = map(abs(cX[0]), 0, 1020, 0, 255);
            cY = map(abs(cY[0]), 0, 1020, 0, 255);
            var combo = cX + cY;

            imgOut.pixels[index + 0] = combo;
            imgOut.pixels[index + 1] = combo;
            imgOut.pixels[index + 2] = combo;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
/////////////////////////////////////////////////////////////////////////
//Filter code from Week 15
function sharpenFilter(img){
    //sharpen matrix
    var matrix = [
        [-1, -1, -1],
        [-1, 9, -1],
        [-1, -1, -1]
    ];

    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;
            var c = convolution(x, y, matrix, matrixSize, img);

            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
/////////////////////////////////////////////////////////////////////////
function embossFilter(img){
    //emboss matrix
    var matrix = [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
    ];

    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;
            var c = convolution(x, y, matrix, matrixSize, img);

            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
/////////////////////////////////////////////////////////////////////////
function popArtFilter(img){
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++) {
        for (y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            //Pixel colour worked out by using thresholds
            if (dist(r, g, b, 255, 100, 100) < 110) {
                imgOut.pixels[index + 0] = 255;
                imgOut.pixels[index + 1] = 0;
                imgOut.pixels[index + 2] = 0;
                imgOut.pixels[index + 3] = 255;
            } else if (dist(r, g, b, 255, 255, 255) > 128) {
                imgOut.pixels[index + 0] = 0;
                imgOut.pixels[index + 1] = 100;
                imgOut.pixels[index + 2] = 100;
                imgOut.pixels[index + 3] = 255;
            } else if (dist(r, g, b, 0, 255, 0) > 200) {
                imgOut.pixels[index + 0] = 255;
                imgOut.pixels[index + 1] = 255;
                imgOut.pixels[index + 2] = 175;
                imgOut.pixels[index + 3] = 255;
            }
        }
    }
    imgOut.updatePixels();
    return imgOut;
}




