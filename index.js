(function (global) {
  var canvas,
    gl,
    program,
    dataModul = [],
    click_counter = 0,
    mode,
    counter = 0,
    shaders = [],
    pointsLine = [],
    colorsLine = [],
    colorsSquare = [],
    pointsSquare = [],
    pointsRectangle = [],
    colorsRectangle = [];

  glUtils.SL.init({
    callback: function () {
      main();
    },
  });

  function main() {
    console.log("Main FUnction");

    var loadButton = document.getElementById("btn-modul");
    loadButton.addEventListener("click", loadFunction);

    var drawSelectionForm = document.getElementById("drawSelection");
    drawSelectionForm.addEventListener("change", drawSelectionChange);

    loadExternalModule();

    mode = "line";

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(
        gl,
        gl.VERTEX_SHADER,
        glUtils.SL.Shaders.v1.vertex
      ),
      fragmentShader = glUtils.getShader(
        gl,
        gl.FRAGMENT_SHADER,
        glUtils.SL.Shaders.v1.fragment
      );

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    // UI events
    canvas.addEventListener("mousedown", function (event) {
      if (mode == "square") {
        console.log("Main mode Square");
        onmousedownSquare(event);
      } else if (mode == "line") {
        console.log("Main mode line");
        onmousedownLine(event);
      } else if (mode == "rectangle") {
        console.log("Main mode rectangle");
        onmousedownRectangle(event);
      }
    });

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  // Load data modul eksternal
  function loadExternalModule() {
    console.log("Loading external modul");
    console.log("JSON");
    fetch("modul.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dataModul = data;
      });
  }

  function loadFunction() {
    console.log("Square");
    for (let i = 0; i < dataModul["Square"].length; i++) {
      console.log(dataModul["Square"][i]);
      pointsSquare = pointsSquare.concat(dataModul["Square"][i]["points"]);
      colorsSquare = colorsSquare.concat(dataModul["Square"][i]["color"]);
    }

    console.log("Line");
    for (let i = 0; i < dataModul["Line"].length; i++) {
      console.log(dataModul["Line"][i]);
      pointsLine = pointsLine.concat(dataModul["Line"][i]["points"]);
      colorsLine = colorsLine.concat(dataModul["Line"][i]["color"]);
    }

    console.log("Rectangle");
    for (let i = 0; i < dataModul["Rectangle"].length; i++) {
      console.log(dataModul["Rectangle"][i]);
      pointsRectangle = pointsRectangle.concat(
        dataModul["Rectangle"][i]["points"]
      );
      colorsRectangle = colorsRectangle.concat(
        dataModul["Rectangle"][i]["color"]
      );
    }

    // Draw from data modul
    drawAll();
  }

  function drawSelectionChange() {
    mode = document.getElementById("drawSelection").value;
    console.log(mode);
  }

  // Fungsi untuk menggambar semua model
  function drawAll() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw Line / Garis
    console.log("Points Line");
    console.log(pointsLine);
    console.log("Colors Line");
    console.log(colorsLine);
    drawA(gl.LINES, new Float32Array(pointsLine), new Float32Array(colorsLine));

    // Draw Square / Kotak
    console.log("Colors Square");
    console.log(colorsSquare);
    drawA(
      gl.TRIANGLES,
      new Float32Array(pointsSquare),
      new Float32Array(colorsSquare)
    );

    // Draw Rectangle / Persegi Panjang
    console.log("Points Rectangle");
    console.log(pointsRectangle);
    console.log("Colors Rectangle");
    console.log(colorsRectangle);
    drawA(
      gl.TRIANGLES,
      new Float32Array(pointsRectangle),
      new Float32Array(colorsRectangle)
    );
  }

  // Rectangle / Persegi
  function drawSquare() {
    console.log("Draw");
    program = shaders[0];
    gl.useProgram(program);

    var n = initBuffersSquare(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function initBuffersSquare(gl) {
    console.log("Init buffer");
    console.log(pointsSquare);
    var vertices = new Float32Array(pointsSquare);
    var n = pointsSquare.length / 2;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    return n;
  }

  // UI Events
  function onmousedownSquare(event) {
    console.log("Mouse down Square");
    // counter++;
    // if (counter == 4) {
    //   console.log("Foo");
    //   mode = "line";
    // }
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    console.log(point);
    pointsSquare.push(point.x);
    pointsSquare.push(point.y);
    // Add color for square
    colorsSquare.push(0.0, 1.0, 1.0, 1.0);

    click_counter = click_counter + 1;
    if (click_counter == 2) {
      console.log("Counter sama dengan 2");
      click_counter = 0;
      generatePoints();
    }
  }

  function generatePoints() {
    console.log("Add more points");
    var current_length = pointsSquare.length;

    var deltaX = Math.abs(
      pointsSquare[current_length - 4] - pointsSquare[current_length - 2]
    );
    var deltaY = Math.abs(
      pointsSquare[current_length - 3] - pointsSquare[current_length - 1]
    );
    console.log("Delta X ");
    console.log(deltaX);
    console.log("Delta Y");
    console.log(deltaY);

    if (deltaX > deltaY) {
      console.log("Delta x lebih besar delta Y");
      if (pointsSquare[current_length - 2] > pointsSquare[current_length - 4]) {
        pointsSquare[current_length - 2] =
          pointsSquare[current_length - 4] + deltaY;
      } else {
        pointsSquare[current_length - 2] =
          pointsSquare[current_length - 4] - deltaY;
      }
    } else {
      console.log("Delta Y lebih besar delta X");
      if (pointsSquare[current_length - 1] > pointsSquare[current_length - 3]) {
        pointsSquare[current_length - 1] =
          pointsSquare[current_length - 3] + deltaX;
      } else {
        pointsSquare[current_length - 1] =
          pointsSquare[current_length - 3] - deltaX;
      }
    }

    deltaX = Math.abs(
      pointsSquare[current_length - 4] - pointsSquare[current_length - 2]
    );
    deltaY = Math.abs(
      pointsSquare[current_length - 3] - pointsSquare[current_length - 1]
    );
    console.log("Delta X ");
    console.log(deltaX);
    console.log("Delta Y");
    console.log(deltaY);

    console.log(pointsSquare);

    console.log("Pertama");
    pointsSquare.push(pointsSquare[current_length - 4]);
    pointsSquare.push(pointsSquare[current_length - 1]);
    colorsSquare.push(0.0, 1.0, 1.0, 1.0);
    // drawAll();

    console.log("Kedua");
    pointsSquare.push(pointsSquare[current_length - 4]);
    pointsSquare.push(pointsSquare[current_length - 3]);
    colorsSquare.push(0.0, 1.0, 1.0, 1.0);
    // drawAll();

    pointsSquare.push(pointsSquare[current_length - 2]);
    pointsSquare.push(pointsSquare[current_length - 1]);
    colorsSquare.push(0.0, 1.0, 1.0, 1.0);
    // drawAll();

    pointsSquare.push(pointsSquare[current_length - 2]);
    pointsSquare.push(pointsSquare[current_length - 3]);
    colorsSquare.push(0.0, 1.0, 1.0, 1.0);

    console.log("Points square");
    console.log(pointsSquare);

    // pointsSquare[0] = pointsSquare[0] + 0.5;
    // pointsSquare[2] = pointsSquare[2] + 0.5;
    // pointsSquare[4] = pointsSquare[4] + 0.5;
    // pointsSquare[6] = pointsSquare[6] + 0.5;
    // pointsSquare[8] = pointsSquare[8] + 0.5;
    // pointsSquare[10] = pointsSquare[10] + 0.5;

    // pointsSquare[1] = pointsSquare[1] + 0.5;
    // pointsSquare[3] = pointsSquare[3] + 0.5;
    // pointsSquare[5] = pointsSquare[5] + 0.5;
    // pointsSquare[7] = pointsSquare[7] + 0.5;
    // pointsSquare[9] = pointsSquare[9] + 0.5;
    // pointsSquare[11] = pointsSquare[11] + 0.5;
    console.log("Points square update");
    console.log(pointsSquare);

    drawAll();
  }

  // Persegi Panjang
  function onmousedownRectangle(event) {
    console.log("Mouse down Rectangle");
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    console.log(point);
    pointsRectangle.push(point.x);
    pointsRectangle.push(point.y);
    // Add color for square
    colorsRectangle.push(1.0, 0.0, 1.0, 1.0);

    click_counter = click_counter + 1;
    if (click_counter == 2) {
      console.log("Counter sama dengan 2");
      click_counter = 0;
      GeneratePointsRectangle();
    }
  }

  function GeneratePointsRectangle() {
    console.log("Add more points rectangle");
    var current_length = pointsRectangle.length;

    console.log("Pertama");
    pointsRectangle.push(pointsRectangle[current_length - 4]);
    pointsRectangle.push(pointsRectangle[current_length - 1]);
    colorsRectangle.push(1.0, 0.0, 1.0, 1.0);

    console.log("Kedua");
    pointsRectangle.push(pointsRectangle[current_length - 4]);
    pointsRectangle.push(pointsRectangle[current_length - 3]);
    colorsRectangle.push(1.0, 0.0, 1.0, 1.0);

    pointsRectangle.push(pointsRectangle[current_length - 2]);
    pointsRectangle.push(pointsRectangle[current_length - 1]);
    colorsRectangle.push(1.0, 0.0, 1.0, 1.0);

    pointsRectangle.push(pointsRectangle[current_length - 2]);
    pointsRectangle.push(pointsRectangle[current_length - 3]);
    colorsRectangle.push(1.0, 0.0, 1.0, 1.0);

    drawAll();
  }

  // Garis Line
  function drawLine() {
    // console.log(pointsLine);
    console.log("Draw Line");
    program = shaders[1];
    gl.useProgram(program);
    var n = initBuffersLine(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, n);
  }

  function initBuffersLine(gl) {
    console.log("Init buffer Line");
    var vertices = new Float32Array(pointsLine);
    var n = pointsLine.length / 2;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    return n;
  }

  function onmousedownLine(event) {
    console.log("MOuse down Line");
    // counter++;
    // console.log(counter);
    // if (counter == 10) {
    //   mode = "rectangle";
    //   console.log("mode rectangle Sekarang");
    // }
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    pointsLine.push(point.x);
    pointsLine.push(point.y);
    colorsLine.push(1.0, 0.0, 0.0, 1.0);
    // drawLine();
    drawAll();
  }

  function translation() {
    console.log("Translation Function");
    // var translation = [0, 0, 0, 0];

    if (counter >= 4 && counter < 10) {
      var translation = [0, 0, 0, 0];
    } else {
      var translation = [+0.25, +0.25, 0, 0];
      // var translation = [0, 0, 0, 0];
    }
    var uTranslation = gl.getUniformLocation(program, "uTranslation");
    var uniform = gl.getUniform(program, uTranslation);
    console.log(uniform);
    gl.uniform4f(
      uTranslation,
      translation[0],
      translation[1],
      translation[2],
      translation[3]
    );
    uniform = gl.getUniform(program, uTranslation);
    console.log(uniform);
  }

  function drawA(type, vertices, colors) {
    var n = initBuffers(vertices, colors);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

    // Translation!
    // if (true) {
    //   console.log("Translation");
    //   translation();
    // }

    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices, colors) {
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, "aPosition");
    if (aPosition < 0) {
      console.log("Failed to get the storage location of aPosition");
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Do it all again for the color buffer
    // var colors = new Float32Array([
    //   1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    //   1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
    //   0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
    //   0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
    // ]);
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    return n;
  }
})(window || this);
