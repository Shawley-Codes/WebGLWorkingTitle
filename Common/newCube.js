function newCube( vertexShaderId, fragmentShaderId)
{
    // initialize variables
    var myVertShader = vertexShaderId || "newCube-vertex-shader";
    var myFragShader = fragmentShaderId || "newCube-fragment-shader";
    this.program = initShaders(gl, myVertShader, myFragShader);

    //check if shader compilation failed
    if (this.program < 0) 
    {
        alert("Error: Cube shader pipe failed to compile properly. \n\n" +
            " \tvertex shader ID: \t" + myVertShader + "\n" +
            "\tfragment shader ID: \t" + myFragShader + "\n" );
        return;
    }

	//create a custom list of vertex position defaults
	//values determined in meeting with class
    this.positions = {
        values : new Float32Array([
            -0.5, -0.5, -0.5, //0, A

            -0.5, .5, -0.5, //1, B

            -0.5, .5, .5, //2, C

            -0.5, -0.5, .5, //3, D

            .5, -0.5, -0.5, //4, E

            .5, .5, -0.5, //5, F

            .5, .5, .5, //6, G
            
            .5, -0.5, .5 //7, H

        ]),
        numComponents : 3
    };
    
	//matrix of triangle index for cube faces
	//values determined in meeting with class
    this.indicies = {
        values : new Uint16Array([

            0, 7, 3, 0, 4, 7, //side AEHD

            4, 6, 7, 4, 5, 6, //side EFGH

            5, 2, 6, 5, 1, 2, //side FBCG

            1, 3, 2, 1, 0, 3, //side BADC

            3, 7, 6, 2, 3, 6, //side CDHG

            4, 1, 5, 4, 0, 1 //side EABF

        ])
    };
    this.indicies.count = this.indicies.values.length;

    //buffer vertex in prep for rendering
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW);

    //buffer indicies in prep for rendering
    this.indicies.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicies.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies.values, gl.STATIC_DRAW);

	//set up variable for getting vector locations
    this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition");
    gl.enableVertexAttribArray(this.positions.attributeLoc);

    //get MV location values and store to variable for render math
    MVLoc = gl.getUniformLocation(this.program, "MV");

    this.MV = undefined;

    //render call for cube with what should occur to draw a cube 
    this.render = function ()
    {
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.buffer);
        gl.vertexAttribPointer(this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicies.buffer);

        gl.uniformMatrix4fv(MVLoc, gl.FALSE, flatten(this.MV));

        gl.drawElements(gl.TRIANGLES, this.indicies.count, gl.UNSIGNED_SHORT, 0);
    }
}; 