console.log('Loading data...');

let table;
let newFont;

const canvasWidth = window.innerWidth;
const canvasHeight = 6000; // ⚠️ size limit if too long
const xPosAxis1 = 20; // px
const xPosAxis2 = 500; // px

const animationSpeed = 150;
const cityScaling = 10;
let runTime = 0;

const getCitiesObject = (name, meanTemp, futureMeanTemp, deltaTemp, posX, posY) =>  ({
  name,
  meanTemp,
  futureMeanTemp,
  deltaTemp,
  posX,
  posY
});

const allCities = [];


// https://p5js.org/reference/#/p5/loadTable
function preload() {
  table = loadTable('future_cities_data_truncated.csv', 'csv', 'header');
  newFont =
    loadFont('assets/SF-Pro-Text-Bold.otf');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  const barMargin = 10;
  const barHeight = 30;

  // count the columns
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print('All cities:', table.getColumn('current_city'));

  for (let i = 0; i < table.getRowCount(); i++) {
    const city = table.get(i, 'current_city');
    const meanTemp = parseFloat(table.get(i, 'Annual_Mean_Temperature'));
    const futureMeanTemp = parseFloat(table.get(i, 'future_Annual_Mean_Temperature'));
    const deltaTemp = abs(futureMeanTemp - meanTemp);
    
    let posX = 0;
    let posY = 0;
    
    if (i < 3){
      posX = 150 + i * (220 + random(-30,30));
      posY = 150;
    } else if (i < 6 && i >= 3){
      posX = 150 + (i-3) * (220 + random(-30,30));
      posY = 350;
    } else if (i < 9 && i >= 6){
      posX = 150 + (i-6) * (220 + random(-30,30));
      posY = 550;
    } else if (i < 12 && i >= 9){
      posX = 150 + (i-9) * (220 + random(-30,30));
      posY = 750;
    }
    
    allCities.push(getCitiesObject(city, meanTemp, futureMeanTemp, deltaTemp, posX, posY))

    //allCities.find((city) => city.name == "ASD")  - find by city name
  }
  console.log(allCities);
}

let isGrowing = false;

function draw(){
  clear();
  background(0);

  //circle animation
  if (isGrowing && runTime >= animationSpeed) {
    isGrowing = false;
    runTime = animationSpeed;
  } else if (!isGrowing && runTime <= 0) {
    isGrowing = true;
    runTime = 0;
  }

  for(let i = 0; i < allCities.length; i++) {
    const city = allCities[i];
    runtimeNormalized = (runTime-0) / (animationSpeed-0);
    fill(255 * runtimeNormalized,255 * (1-runtimeNormalized),150);
    let radius = (city.meanTemp + (city.deltaTemp/animationSpeed) * runTime) * cityScaling;
    circle(city.posX, city.posY, radius);
    fill('white');
    textFont(newFont);
    textSize(16);
    text(city.name,city.posX - 9 * (city.name.length / 2),city.posY - 5);
    textSize(20);
    text((radius/cityScaling).toFixed(2),city.posX - 9 * (city.name.length / 2),city.posY + 15);
  }

  if (isGrowing) {
    runTime += 1;
  } else {
    runTime -= 1;
  }
}

function mousePressed(){
  noLoop();
}

function mouseReleased(){
  loop();
}
