//Create variables here
var gameState;
var currentTime;
var dog;
var dogImg;
var happyDog;
var happyDogImg;
var sadDog;
var database;
var foodS;
var foodStock;
var fedTime, lastFed;
var feedPet, addFood;
var changingGameState, readingGameState;
var bedroom;
var bedroomImg;
var garden;
var gardenImg;
var washroom;
var washroomImg;


function preload()
{
  //load images here
  dogImg=loadImage("images/Dog.png");
  happyDogImg=loadImage("images/dogImg1.png");
  bedroomImg=loadImage("images/virtual pet images/BedRoom.png");
  gardenImg=loadImage("images/virtual pet images/Garden.png");
  washroomImg=loadImage("images/virtual pet images/WashRoom.png");
  sadDog=loadImage("images/virtual pet images/deadDog.png");

}

function setup() {
  createCanvas(1200, 500);
  database = firebase.database();

  dog=createSprite(800,250);
  dog.addImage(dogImg);
  dog.scale= 0.2;

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});

}


function draw() {  
  background(46, 139, 87);
  drawSprites();

  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill("black");
  text("Note:Press UP_ARROW Key To Feed Dog Milk!",20,20);
  text("remaining food:"+foodS,20,40);
  //add styles here
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30)
  }
  else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }
  else{
    text("Last Feed : "+ lastFed + "AM", 350,30);
  }

  /*if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }

  currentTime-hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<-(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
  }*/
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  console.log(foodS);
}
function writeStock(x){
  if(x<= 0){
    x=x
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}

