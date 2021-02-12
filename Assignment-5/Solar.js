/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//  Edit by Scott Hawley
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;

//---------------------------------------------------------------------------
//
//  Declare our array of planets (each of which is a sphere)
//
// The list of planets to render.  Uncomment any planets that you are 
// including in the scene. For each planet in this list, make sure to 
// set its distance from the Sun, as well its size, color, and orbit
// around the Sun. 

var Planets = {
  Sun : undefined,
  Mercury : undefined,
  Venus : undefined,
  Earth : undefined,
  Mars : undefined,
  Jupiter : undefined,
  Moon : undefined,
  Europa : undefined,
  Io : undefined,
  Saturn : undefined,
  Uranus : undefined,
  Neptune : undefined,
  Pluto : undefined
};

//experiment for rendering moons
/*
var Moons = {
	Moon : undefined,
	Europa : undefined,
	Io : undefined
}
*/

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 120;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;

  for (var name in Planets ) {

    // Create a new sphere object for our planet, and assign it into the
    // appropriate place in the Planets dictionary.  And to simplify the code
    // assign that same value to the local variable "p", for later use.

//second variable moons lets me pull from a list and create many moons
    var planet = Planets[name] = new Sphere();
	//var moon = Moons[name] = new Sphere();
    // For each planet, we'll add a new property (which itself is a 
    // dictionary) that contains the uniforms that we will use in
    // the associated shader programs for drawing the planets.  These
    // uniform's values will be set each frame in render().

    planet.uniforms = { 
      color : gl.getUniformLocation(planet.program, "color"),
      MV : gl.getUniformLocation(planet.program, "MV"),
      P : gl.getUniformLocation(planet.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

var name, planet, data;

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack

//set translate to be able to render planets that are very far
  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  

  //var name1, planet1, data1;

  //name1 = "Mercury";
  //planet1 = Planets[name];
  //data1 = SolarSystem[name];
  

  
  // Set PointMode to true to render all the vertices as points, as
  // compared to filled triangles.  This can be useful if you think
  // your planet might be inside another planet or the Sun.  Since the
  // "planet" variable is set for each object, you will need to set this
  // for each planet separately.


  
  // Use the matrix stack to configure and render a planet.  How you rener
  // each planet will be similar, but not exactly the same.  In particular,
  // here, we're only rendering the Sun, which is the center of the Solar
  // system (and hence, has no translation to its location).
  
  //older method for rendering, while it does work it doesnt properly display moons parenting.
  //could be modified to rendder moons.

  /*for (var names in Planets){
	  name = names;
	  planet = Planets[name];
	  data = SolarSystem[name];
	  
	  planet.PointMode = false;	
	  ms.push();  
	  ms.scale(data.radius);
	  if (name != "Sun" && name != "Moon") {
		  ms.rotate((1.0/data.year) * time, data.axi s);   
		  ms.translate(data.distance, 0, 0);
		  if (name == "Earth"){
			ms.rotate(data.day, data.axis);
		  }
	  }
	  
	  gl.useProgram(planet.program);
	  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
	  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
	  gl.uniform4fv(planet.uniforms.color, flatten(data.color));
	  planet.render();
	  if (name != "Sun") {
		ms.pop();
	  }
	  if (name == "Moon" || name == "Pluto"){
		ms.pop();
	  }
  }*/

  // new method, using function to render planets 
  sun = Planets["Sun"];
  sun_data = SolarSystem["Sun"];

  sun.PointMode = false;
    
  ms.push();
  ms.scale(sun_data.radius);
  gl.useProgram(sun.program);
  gl.uniformMatrix4fv(sun.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(sun.uniforms.P, false, flatten(P));
  gl.uniform4fv(sun.uniforms.color, flatten(sun_data.color));
  sun.render();
  
  //too many exceptions for a for loop, would work if planets was a disctionary
  //and not a list 
/*  for (var names in Planets){
	  if (names =! "Sun"){
		 
		  CreatePlanet(ms, names, 0)
	  }
  }*/

  //testing moons on different planets
  /*
  CreatePlanet(ms, "Mercury", 0)
  CreatePlanet(ms, "Venus", 0)
  CreatePlanet(ms, "Earth", 1)
  CreatePlanet(ms, "Mars", 0)
  CreatePlanet(ms, "Jupiter", 2)
  CreatePlanet(ms, "Saturn", 0)
  CreatePlanet(ms, "Uranus", 0)
  CreatePlanet(ms, "Neptune", 0)
  CreatePlanet(ms, "Pluto", 0)
  */
  
  //new mehtod for rendering moons
  CreatePlanet(ms, "Mercury", [])
  CreatePlanet(ms, "Venus", [])
  CreatePlanet(ms, "Earth", ["Moon"])
  CreatePlanet(ms, "Mars", [])
  CreatePlanet(ms, "Jupiter", ["Europa","Io"])
  CreatePlanet(ms, "Saturn", [])
  CreatePlanet(ms, "Uranus", [])
  CreatePlanet(ms, "Neptune", [])
  CreatePlanet(ms, "Pluto", [])
//after all is finished pop the sun
  ms.pop();
  window.requestAnimationFrame(render);
}

function CreatePlanet(ms, name, moons)
{
    var planet = Planets[name];
    var data = SolarSystem[name];
    planet.PointMode = false;
    
    ms.push();
    
    // similar to sun, set data points from solarsystem.js
    ms.rotate((1.0 / data.year) * time, [0.0, 0.0, 1.0]);
    ms.translate(data.distance, 0, 0);
    ms.scale(data.radius);
    
	//random rendering calls already defined
    gl.useProgram(planet.program);
    gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
    gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
    gl.uniform4fv(planet.uniforms.color, flatten(data.color));
    planet.render();
	
	//calls to render the moon
	for(var i = 0; i < moons.length; i++)
	{
		//CreateMoon(ms, name, i);
		CreateMoon(ms, moons[i]);
	}
	//remove from stack after finished with parenting planet
    ms.pop();
}


function CreateMoon(ms, name)
{
	//this gets the planet name to determine which moons to place
	//if (planet == "Earth"){var moon = Moons["Moon"]; var data = SolarSystem["Moon"];}"
    //if (planet == "Jupiter"){
	//	if(i == 0) {var moon = Moons["Europa"]; var data = SolarSystem["Europa"]; }
	//	else {var moon = Moons["Io"]; var data = SolarSystem["Io"];}
	//}
    var moon = Planets[name];
	var data = SolarSystem[name];
    moon.PointMode = false;
    
	//call boring render calls
    ms.push();
    ms.rotate((1.0 / data.year) * time, [0.0, 0.0, 1.0]);
    ms.translate(data.distance, 0, 0);
    ms.scale(data.radius);
    gl.useProgram(moon.program);
    gl.uniformMatrix4fv(moon.uniforms.MV, false, flatten(ms.current()));
    gl.uniformMatrix4fv(moon.uniforms.P, false, flatten(P));
    gl.uniform4fv(moon.uniforms.color, flatten(data.color));
    moon.render();
    
    // Drop the scope.
    ms.pop();
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 100.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;