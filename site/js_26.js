var staCanvas=document.getElementById("static-canvas");
var aniCanvas=document.getElementById("animate-canvas");
var satSelect=document.getElementById('satellites-select');
var orbSelect=document.getElementById('orbits-select');
// var orbits=new Array();
var orbits={};
var satellites=new Array();
var satNum=0;
var centerX=150;
var centerY=75;
var moon = new Image();
moon.src="https://mdn.mozillademos.org/files/1443/Canvas_moon.png"


window.onload=function () {
	var ctxEarth=staCanvas.getContext('2d');

	//draw earth
	ctxEarth.save();
	ctxEarth.translate(centerX,centerY);
	ctxEarth.beginPath();
	ctxEarth.arc(0,0,35,0,Math.PI*2,false);
	ctxEarth.fillStyle="#faa";
	ctxEarth.stroke();
	ctxEarth.fill();
	ctxEarth.closePath();
	ctxEarth.restore();

	//create orbits
/*	orbits.push(new Orbit(staCanvas,50,4));
	orbits.push(new Orbit(staCanvas,65,6));
	console.log(orbits);
	for (var i = 0; i < orbits.length; i++) {
		orbSelect.options.add(new Option(orbits[i].height+'#Height',orbits[i].height+'#Height'));
	}*/
	orbits['50#Height']=new Orbit(staCanvas,50,4);
	orbits['65#Height']=new Orbit(staCanvas,65,6);
	console.log(orbits);
	for (var key in orbits) {
		orbSelect.options.add(new Option(key,key));
	}



	//create satellites
/*	satellites.push(new Satellite(aniCanvas,orbits['50#Height']));
	satellites.push(new Satellite(aniCanvas,orbits['65#Height']));
	satellites.push(new Satellite(aniCanvas,orbits['65#Height']));

	for (var i = 0; i < satellites.length; i++) {
		// using jQuery
		// var opt=$("<option></option>").text(satellites[i].satNum+'#');
		// $("#satellites-select").append(opt);
		// without jQuery
		satSelect.options.add(new Option(satellites[i].satNum+'#',satellites[i].satNum+'#'));
	}*/
	
	//rotate satellites
	// window.requestAnimationFrame(rotate);
	window.setInterval(rotate,30);
	function rotate() {
		var ctxSatellite=aniCanvas.getContext('2d');
		ctxSatellite.clearRect(0,0,300,150)

		for (var i = 0; i < satellites.length; i++) {
			satellites[i].rotate();
		}

		// window.requestAnimationFrame(rotate);
	}

	//command
	$("#cmd-div").click(changeStatus);
	$("#createsat-btn").click(createSatellite);
}


//to do : how to control the canvas layer? setting ctx.globalCompositeOperation


//Orbit class: canvas; orbit height; lap time: s/lap
function Orbit(canvas,height,lapTime) {
	this.canvas=canvas;
	this.height=height;
	this.radianPerFrame= Math.PI*2/lapTime/60;              //  60frams/s;2PI Radians
	var ctxOrbit=canvas.getContext('2d');

	//draw orbite
	ctxOrbit.save();
	ctxOrbit.beginPath();
	ctxOrbit.translate(150,75);
	ctxOrbit.arc(0,0,height,0,Math.PI*2,false);
	ctxOrbit.strokeStyle="#fff";
	ctxOrbit.setLineDash([5,2]);
	ctxOrbit.stroke();
	ctxOrbit.closePath();	
	ctxOrbit.restore();
}


//Satellite class: canvas, orbit
function Satellite(canvas,orbit) {
	this.canvas=canvas;
	this.orbit=orbit;
	this.rotateRadian=0;
	this.satNum=++satNum;
	this.energy=100;    //consume 5 per seconds; 5/60 per frame;
	//satellite status: 
		//10-stop initially; 11-stop by command; 12-stop by short of energy;
		//20-Run by command
		//30-destroyed by command
	this.status=10;   

	console.log(this.satNum+'#');
	var ctxSatellite=canvas.getContext('2d');

	ctxSatellite.save();
	ctxSatellite.translate(centerX,centerY);
	ctxSatellite.drawImage(moon,this.orbit.height-3,0);

	ctxSatellite.font="1x"
	ctxSatellite.fillStyle="#fff";
	ctxSatellite.fillText(this.satNum+'#'+Math.ceil(this.energy)+'%',this.orbit.height+3,0);
	ctxSatellite.restore();

	this.rotate=function() {
		if (this.status == 20) {
			ctxSatellite.save();
			ctxSatellite.translate(centerX,centerY);
			
			//rotate	
			this.rotateRadian=this.rotateRadian+this.orbit.radianPerFrame;
			ctxSatellite.rotate(this.rotateRadian);
			ctxSatellite.drawImage(moon,this.orbit.height-3,0);
			ctxSatellite.font="2px"
			ctxSatellite.fillStyle="#fff";
			this.energy=this.energy-15/60; //hard code of energy consumption
			ctxSatellite.fillText(this.satNum+'#'+Math.ceil(this.energy)+'%',this.orbit.height+3,0);
			if (Math.ceil(this.energy)==0) {
				this.status=12;
			}


			ctxSatellite.restore();

		} else if (this.status != 30) {
			if (this.status==12 && this.energy<100) {
				//hard code of energy charging
				this.energy=this.energy+10/60;
			}

			ctxSatellite.save();
			ctxSatellite.translate(centerX,centerY);
			
			//draw without rotate	
			// this.rotateRadian=this.rotateRadian+this.orbit.radianPerFrame;
			ctxSatellite.rotate(this.rotateRadian);
			ctxSatellite.drawImage(moon,this.orbit.height-3,0);
			ctxSatellite.font="2px"
			ctxSatellite.fillStyle="#fff";
			// this.energy=this.energy-1/60;
			ctxSatellite.fillText(this.satNum+'#'+Math.floor(this.energy)+'%',this.orbit.height+3,0);

			ctxSatellite.restore();

		}
	}

}

//to do: how to cencapsulate the changeStatus;rotate methods in class of Satellite
//			it's good idea to encapsulate rotate in class of satellite,
//						but not good for change status?
function changeStatus() {
	var cmd=event.target.id;
	// var satelliteIdx=$('#satellites-select').val().split('#')[0]-1;   //event.target.value.split[0];
	var satelliteIdx=satSelect.value.split('#')[0]-1;
	if (cmd=='run-btn') {
		satellites[satelliteIdx].status=20;
	} else if (cmd=='stop-btn') {
		satellites[satelliteIdx].status=11;
	} else if (cmd=='destroy-btn') {
		satellites[satelliteIdx].status=30;
		satSelect.options.remove(satSelect.selectedIndex);
	}
}


function createSatellite() {
	var orbit=orbits[orbSelect.value];
	var satellite=new Satellite(aniCanvas,orbit);
	console.log(satellite);
	satellites.push(satellite);
	satSelect.options.add(new Option(satellite.satNum+'#',satellite.satNum+'#'));

}