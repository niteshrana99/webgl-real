var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;', //world matrix, rotating the cube
'uniform mat4 mView;', //View Matrix, camera is sitting
'uniform mat4 mProj;', //Projection matrix, to get points    
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',// here we multiply matrix and it happens from rifgt to left.
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var triangleVertices = 
	[ // X, Y, Z      R, G, B
		0.0, 0.5,0,    1.0, 1.0, 0.0,
		-0.5, -0.5,0,  0.7, 0.0, 1.0,
		0.5, -0.5,0,   0.1, 1.0, 0.6
	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
    
    //Tell OpenGl state which program should be active
    gl.useProgram(program);

    //Now after we set up attributes be now set up our uniforms:
    var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program,'mView');
    var matProjUniformLocation = gl.getUniformLocation(program,'mProj');
    
    var worldMatrix = new Float32Array(16); //this is gonna set them all zeroes
	var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    
    // now we create identity matrix.
    mat4.identity(worldMatrix);
//    mat4.identity(viewMatrix);
    //lets make a camera using viewAt function
    mat4.lookAt(viewMatrix,[0,0,-2],[0,0,0],[0,1,0])// see document
    // Now we set up our camera we gonna set projection
//    mat4.identity(projMatrix);
    
    mat4.perspective(projMatrix, glMatrix.toRadian(45),canvas.width/canvas.height,0.1, 1000.0) // see documentation
    
    // Now we need to send our matrices to shaders.
    gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation,gl.FALSE, projMatrix);

    //
	// Main render loop
	//
    
    // To make a rotating effect we are gonna use rendering loop
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop  = function() {
        angle = performance.now()/1000/6*Math.PI; // number of ms since your window started, so we convert into seconds, and then equal to 2pi and a full roattion,
        mat4.rotate(worldMatrix,identityMatrix,angle,[0,1,0]);
        gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix)// To update world matrix
        gl.clearColor(0.75,0.85,0.8,1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 3);
       requestAnimationFrame(loop); 
    };
    requestAnimationFrame(loop);//i want to call whenever screen is ready to draw i.e. 1/60th of a second. 
    
	gl.useProgram(program);
	
};