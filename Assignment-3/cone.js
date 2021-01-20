var gl = null;
var ConeJS = null;

function init() {
    var canvas = document.getElementById( "webgl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
	//create stringname variables
	var vertShader = "Cone-vertex-shader";
	var fragShader = "Cone-fragment-shader";
	
    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }
	//gl.useProgram();

	//set cone variable
	ConeJS = Cone(gl, 8, vertShader, fragShader);
	
    gl.clearColor( 0.0, 1.0, 0.0, 1.0 );

    render();
}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
    ConeJS.render();
}

window.onload = init;