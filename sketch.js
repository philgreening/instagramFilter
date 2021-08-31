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
  // resultImg = radialBlurFilter(resultImg);
  // resultImg = borderFilter(resultImg)
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
            var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
            var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);

            imageOut.pixels[index + 0 ] = newRed;
            imageOut.pixels[index + 1 ] = newGreen;
            imageOut.pixels[index + 2 ] = newBlue;
            imageOut.pixels[index + 3 ] = 255;
        }
    }
    imageOut.updatePixels();
    return imageOut;
}

function darkCorners(img){
    var imageOut = createImage(img.width , img.height);

    imageOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x<img.width; x++)
    {
        for (var y = 0; y<img.height; y++)
        {
            var index = (y*img.width + x)*4;

            // var distX = img.width/2;
            // var distY = img.height/2;

            var distance = dist(x, y, img.width/2, img.height/2 );

            distance = constrain(distance, 300,450);
            var dynLum = map(distance, 300, 450, 1, 0.4);

            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];

            imageOut.pixels[index + 0 ] = oldRed * dynLum;
            imageOut.pixels[index + 1 ] = oldGreen * dynLum;
            imageOut.pixels[index + 2 ] = oldBlue * dynLum;
            imageOut.pixels[index + 3 ] = 255;
        }
    }
    imageOut.updatePixels();
    return imageOut;

}
