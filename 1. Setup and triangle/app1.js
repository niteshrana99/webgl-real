var initDemo = function() {
    //Step 1: Initialize WebGl.
    var canvas = document.getElementById('game_surface');
    // Now we need to get openGl context
    
    var gl = canvas.getContext('webgl');
    
    if(!gl) {
        console.log('Webgl Not supported')
    }
    
    // Now we set color: gl.clearColor(R,G,B, alphavalue(1.0)[for transparency]);
    gl.clearColor(0.75, 0.85, 0.80, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) //Graphics applications have too much buffers that they render to, The one that we have to be concerned with are color buffer and depth buffer. The color buffer stores what color on the pixel should be, and depth buffer stores how deep into screen that pixel was, Suppose a circle is behind the square, the depth buffer when it draws pixel from the square might put a value lower than the circle which means it is closer to screen and so if program goes to draw a pixwl from a circle, and it notices that pixel is already there it will just ignore it because depth buffer already had a value that supersedes what was attempted to be drawn. So we need to clear both.
    
    // Now we are gonna need shaders: Shaders are programs that run on GPU. We need two shaders:
    // 1. Vertex shader: Take in input params, called attributes, varying are output params. With vertex shader there is special variable called gl_position, which sets where on the rendering surface we want to draw vertex, it then goes to rasteriser and for every single pixel that comes through rasteriser will go through fragment shader. 
    //2. Varying are now the inputs to fragment shader, and only output will be gl_fragcolor.
    // After we declare vertexShaderText and fragmentShaderText we need to get opengl ready to use these.
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //we want to compile the code from fragmentShaderText and vertexShaderText that we provide down. Two steps, 1st step is we have to set the shader source by gl.shaderSource, first parameter is shader and second is it's source code.
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    // 2nd step is we need to compile it.
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    // We can check if there is any error by below code:
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error Compiling vertex shader', gl.getShaderInfoLog(vertexShader));
    }
    
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error Compiling fragmentShader ', gl.getShaderInfoLog(fragmentShader));
    }
    
    // Now we have vertex shader and fragment shader that we are ready to use, and those are the two programs that we have to write for graphics pipeline and we need to tell openGl that we need to use them togetther, and this is done by using program in openGl terms.
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader); // We attach both our shaders.
    gl.attachShader(program, fragmentShader);
    
    // now we need to link program together. 
    gl.linkProgram(program);
    //checking for linker errors
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log('Error Linking', gl.getProgramInfo(program));
        return;
    }
    
    //We need to set all the information graphics card is using, so we need to create a buffer which will be a list of x and y coordinates that is going to define our triangle. after we do that we need to attach that list to graphics card or vertex shader. 
    
    var triangleVertices = [
        //x,y      RGB
        0.0,0.5,    1.0,1.0,0.0,
        -0.5,-0.5,  0.7, 0.0,1.0,
        0.5,-0.5,   0.1,1.0,0.6 
    ];
    
    var triangleVertexBufferObject = gl.createBuffer(); //Chunk of memory on GPU.
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); // This line says that the active buffer we are using is arrayBuffer and we bind this to buffer object we created. After that we want to specify the data.
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangleVertices), gl.STATIC_DRAW); // JS stores everything in 64 bit floating point number but openGl expects 32 bit, so we use float32 array. gl.STATIC_DRAW means we send info from CPU memory to GPU memory and we are not gona change it.
    // Now we need  to inform vertexShader that the attribute is these vertices (x,y) we have in triang;eVertices.  So we need to get a handle to that attribute
    var positionAttributeLocation = gl.getAttribLocation(program,'vertPosition');
    var positionAttributeLocation = gl.getAttribLocation(program,'vertColor');

    //Now we need to specify layout
    gl.vertexAttribPointer(
        //arguments
        positionAttributeLocation, //attribute location
        2, //number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE, //data is normalised
        2* Float32Array.BYTES_PER_ELEMENT,//Size of individual vertex
        0  //offset from the beggening of single vertex to this attribute
    );
    
    // We need to enable  vertex attribute array.
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    //Main render loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES,0,3); //1st parameter is what u want to draw, 2nd is how many vertices you want to skip, and third is how many you want to draw
}

var vertexShaderText = 
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;', // We have floats in C based languages,here we have vec vec2(pairs(vector of 2 elements)), //vec3(triplets),vec4
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        'fragColor = vertColor;',
        'gl_Position = vec4(vertPosition, 0.0, 1.0);', //gl_positition is 4D vector, x and y come from vertPosition, z=0.0 and alpha=1.0 
        '}'
    ].join('\n');

var fragmentShaderText = 
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        'gl_FragColor = vec4(fragColor, 1.0);', //gl_positition is 4D vector, x and y come from vertPosition, z=0.0 and alpha=1.0 
        '}'
    ].join('\n');

