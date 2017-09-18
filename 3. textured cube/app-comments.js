var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTextCoord;', //only U and V coordinates , similarly for fragmentshader
'varying vec2 fragTextCoord;',
'uniform mat4 mWorld;', //world matrix, rotating the cube
'uniform mat4 mView;', //View Matrix, camera is sitting
'uniform mat4 mProj;', //Projection matrix, to get points    
'',
'void main()',
'{',
'  fragTextCoord = vertTextCoord;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',// here we multiply matrix and it happens from rifgt to left.
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec2 fragTextCoord;',
'uniform sampler2D sampler;', //For sampeling image
'',    
'void main()',
'{',
'  gl_FragColor = texture2D(sampler, fragTextCoord);', // 
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
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW) //Counter clock wise.
    gl.cullFace(gl.BACK)

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
	var boxVertices = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

    var boxIndices =
	[
		// Top tells which sets of vertices form triangle 
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
    
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var textCoordAttribLocation = gl.getAttribLocation(program, 'vertTextCoord');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		textCoordAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(textCoordAttribLocation);
    
    // Create Texture:Textture is also an array on graphic card, so we create it in the same way, we create the buffer.
    
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    
    //After binding we need it to give parameters foe wrapping and filtering: The next 4 things are done on texture but they can be changed latr. 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // for sampeling
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //for texture T coordinate
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX, gl.LINEAR);
    //texImg2D specifies what information texture is gonna use.
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('create-image'));
    gl.bindTexture(gl.TEXTURE_2D, null); //unbinding buffer
    
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
    mat4.lookAt(viewMatrix,[0,0,-8],[0,0,0],[0,1,0])// see document
    // Now we set up our camera we gonna set projection
//    mat4.identity(projMatrix);
    
    mat4.perspective(projMatrix, glMatrix.toRadian(45),canvas.width/canvas.height,0.1, 1000.0) // see documentation
    
    // Now we need to send our matrices to shaders.
    gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation,gl.FALSE, projMatrix);

    // To rotate cube along two axis we would form two rotation matrix and multiply them together. 
    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    
    //
	// Main render loop
	//
    
    // To make a rotating effect we are gonna use rendering loop
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop  = function() {
        angle = performance.now()/1000/6*Math.PI; // number of ms since your window started, so we convert into seconds, and then equal to 2pi and a full roattion,
//        mat4.rotate(worldMatrix,identityMatrix,angle,[0,1,0]); use this code for one axis rotation.
        mat4.rotate(xRotationMatrix,identityMatrix,angle,[0,1,0]);
        mat4.rotate(yRotationMatrix,identityMatrix,angle,[1,0,0]);
        mat4.mul(worldMatrix,xRotationMatrix,yRotationMatrix)
        gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix)// To update world matrix
        gl.clearColor(0.75,0.85,0.8,1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D,boxTexture);
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, boxIndices.length,gl.UNSIGNED_SHORT, 0);
       requestAnimationFrame(loop); 
    };
    requestAnimationFrame(loop);//i want to call whenever screen is ready to draw i.e. 1/60th of a second. 
    
	gl.useProgram(program);
	
};