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

	//set cone variable
	ConeJS = new Cone(gl, 8, vertShader, fragShader);
	
    gl.clearColor( 0.0, 1.0, 0.0, 1.0 );
	gl.enable( gl.DEPTH_TEST );

    render();
}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
	ConeJS.render();
	
	requestAnimationFrame( render );
}

window.onload = init;