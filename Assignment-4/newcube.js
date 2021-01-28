//Initialize Variables
var CubeJs = undefined;
var gl = undefined;
var angle = 0;

function init ()
{
	//get canvas
    var canvas = document.getElementById("webgl-canvas");
    //get utilities
    gl = WebGLUtils.setupWebGL(canvas);
    //did get util fail?
    if (!gl) 
    {
        alert("Unable to setup WebGL properly.");
        return;
    }

	//determine background color
    gl.clearColor( .8, 0.0, 0.1, 1.0);
	//ensures 3rd dimention
    gl.enable(gl.DEPTH_TEST);
	
	//create cube and render: maintaining consistant variable names w/ previous assignment
    CubeJs = new newCube();
    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angle += 2.0; 
	
	//call for cube to rotate and then render change
    CubeJs.MV = rotate  (angle, [-10, -10, 10]);
    CubeJs.render();

	//recursive call for render (animation)
    requestAnimationFrame(render); 

}

window.onload = init;