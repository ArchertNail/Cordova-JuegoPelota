/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var canvas=null;
var contexto=null;
var JuegoStart;
var choque = false;

var watchID;

var fondoMenu = new Image();
fondoMenu.src="img/fondo.jpg";

var fondo = new Image();
fondo.src="img/fondo.jpg";

//Menu
var easy;
var normal;
var hard;
var salir;

//Pantalla
var wWidth = window.screen.width;
var wHeight = window.screen.height;

// BARRA 
var barra = new Image();
barra.src="img/barra.png";
var barX;
var barY; 

//BOLA
var bola = new Image();
bola.src="img/bola.png";
var x;  
var y; 
var controlY=1;  
var controlX=1;  
var velocidad=1;


//VIDAS
var vida = 3;
var tresVidas=new Image();
tresVidas.src = "img/TresVida.png";
var dosVidas=new Image();
dosVidas.src = "img/DosVida.png";
var unaVida=new Image();
unaVida.src = "img/UnaVida.png";


var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    
        
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        
        /*Al iniciar la aplicacion */
        fondo.width = wWidth;
        fondo.height = wHeight;
        canvas= document.getElementById('canvas');
        canvas.width = wWidth;
        canvas.height = wHeight;
        contexto= canvas.getContext('2d');
        contexto.canvas.width = wWidth;
        contexto.canvas.height = wHeight - 30;
        
        barX = (wWidth/2) - barra.width/2;
        barY = (wHeight-barra.height)*0.8;
        
        x = wWidth/2;
        y = wHeight/4;

        easy= document.getElementById("easy").addEventListener("click", function(){Menu(1)});
        normal = document.getElementById("normal").addEventListener("click",function(){Menu(2)});
        hard = document.getElementById("hard").addEventListener("click", function(){Menu(3)});
        salir = document.getElementById("salir").addEventListener("click", function(){Menu(4)});
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();


function Menu(dificult){
    if(dificult==1){
        velocidad=1;
    }
    else if(dificult==2){
        velocidad=2;
    }
    else if(dificult==3){
        velocidad=3;
    }
    else{
        navigator.app.exitApp();
    }
    vida = 3;
    document.getElementById('menu').classList.add("hidden");
    document.getElementById('lienzo').classList.remove("hidden");
    document.getElementById('lienzo').classList.add("visible");
    
    watchAcceleration();
}

function watchAcceleration(){
    
   var accelerometerOptions = {
      frequency: 10
   }

   watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOptions);

   function accelerometerSuccess(acceleration) {
       dibujarFondo();
       dibujarVidas();
       dibujarBarra();
       dibujarBola();

       barX+= -1*(acceleration.x * 1.5);
  
       if(barX <=0){
           barX =0;
       }
       else if(barX >= canvas.offsetWidth - barra.width){
           barX = canvas.offsetWidth - barra.width;
       }
       
        mover();

   };

   function accelerometerError() {
      alert('onError!');
   };
	
}

function dibujarVidas(){
    if(vida==3){
        contexto.drawImage(tresVidas,0,0);      
    }
    else if(vida==2){    
        contexto.drawImage(dosVidas,0,0);
    }      
    else if(vida == 1){       
        contexto.drawImage(unaVida,0,0);   
    }
    else{
        var r = confirm("GAME OVER!\n¿Deseas volver a jugar?");
        if(r == true){
            vida = 3;
        }else{
            document.getElementById('menu').classList.remove("hidden");
            document.getElementById('menu').classList.add("visible");
           
            document.getElementById('lienzo').classList.remove("visible");
            document.getElementById('lienzo').classList.add("hidden");
            
            navigator.accelerometer.clearWatch(watchID);
        }
    }
}

function dibujarFondo(){
    contexto.drawImage(fondo,0,0,canvas.width,canvas.height); 
}

function dibujarBarra(){
    contexto.drawImage(barra, barX,barY); 
}

function dibujarBola(){
    contexto.drawImage(bola, x,y);
    
}


function mover(){
    //Eje Y
				
    if(controlY == 1){ 
        
        y += velocidad;
    }else{         
        y -= velocidad;		
    }		
    if(y <= 0){
					
        controlY = 1;		
        y = 0;			
    }else if(y >= (document.getElementById("canvas").offsetHeight*0.8) - bola.height/2){ 		
			
        x = wWidth/2;
        y = wHeight/4;
        vida--;
    }
    if (barX < x + bola.width && barX + barra.width  > x && barY < y + bola.height && barY + barra.height > y) {
        controlY = 0;
        y = (document.getElementById("canvas").offsetHeight*0.8) - bola.height;		
    }
				
    if(controlX == 1){ 			
        x += velocidad;		
    }else{         			
        x -= velocidad;		
    }	
    
    if(x <= 0){
        controlX = 1;			
        x= 0; 
    }else if( x >= document.getElementById("canvas").offsetWidth - bola.width){			
        controlX = 0;			
        x = document.getElementById("canvas").offsetWidth - bola.width;			
    }
							
    bola.style.left = String(x)+"px";			
    bola.style.top = String(y)+"px";
   
}