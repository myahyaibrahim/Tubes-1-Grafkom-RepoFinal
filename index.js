(function (global) {
  var canvas,
    gl,
    program,
    dataModul = [],
    click_counter = 0,
    polygonVerticesCounter = 0,
    mode,
    pressedKeys = {},
    shaders = [],
    pointsLine = [],
    colorsLine = [],
    translationLine = [],
    scaleLine = [],
    colorsSquare = [],
    pointsSquare = [],
    centerSquare = [],
    translationSquare = [],
    scaleSquare = [],
    pointsRectangle = [],
    colorsRectangle = [],
    centerRectangle = [],
    translationRectangle = [],
    scaleRectangle = [],
    pointsPolygon = [],
    colorsPolygon = [],
    translationPolygon = [],
    scalePolygon = [],
    nVerticesPolygon = [];

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

    var modelForm = document.getElementById("model-selection");
    modelForm.addEventListener("input", updateFormValue);

    var transButton = document.getElementById("btn-trans");
    transButton.addEventListener("click", translationAll);

    var colorButton = document.getElementById("btn-color");
    colorButton.addEventListener("click", changeColor);

    var scaleButton = document.getElementById("btn-scale");
    scaleButton.addEventListener("click", scaleAll);

    var saveButton = document.getElementById("btn-save");
    saveButton.addEventListener("click", saveToFile);

    loadExternalModule();

    mode = "line";

    addFormTranslation();

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
      } else if (mode == "polygon") {
        console.log("Main mode polygon");
        onmousedownPolygon(event);
        document.onkeydown = keyDown;
        document.onkeyup = keyUp;
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

  function convertToJSON() {
    // Ambil data square
    squareList = [];
    for (let i = 0; i < pointsSquare.length / 12; i++) {
      console.log(i);
      // Points
      var squarePointsTemp = pointsSquare.slice(i * 12, i * 12 + 12);
      console.log(squarePointsTemp);
      // colors
      var squareColorsTemp = colorsSquare.slice(i * 24, i * 24 + 24);
      console.log(squareColorsTemp);
      // center
      var squareCenterTemp = centerSquare.slice(i * 2, i * 2 + 2);
      console.log(squareCenterTemp);
      // translation
      var squareTranslationTemp = translationSquare.slice(i * 2, i * 2 + 2);
      console.log(squareTranslationTemp);
      // scale
      var squareScaleTemp = scaleSquare.slice(i * 2, i * 2 + 2);
      console.log(squareScaleTemp);

      squareList.push({
        points: squarePointsTemp,
        color: squareColorsTemp,
        center: squareCenterTemp,
        translation: squareTranslationTemp,
        scale: squareScaleTemp,
      });
    }
    console.log("Square List");
    console.log(squareList);

    // Ambil data Line
    lineList = [];
    for (let i = 0; i < pointsLine.length / 4; i++) {
      console.log(i);
      // Points
      var linePointsTemp = pointsLine.slice(i * 4, i * 4 + 4);
      console.log(linePointsTemp);
      // colors
      var lineColorsTemp = colorsLine.slice(i * 8, i * 8 + 8);
      console.log(lineColorsTemp);
      // translation
      var lineTranslationTemp = translationLine.slice(i * 4, i * 4 + 4);
      console.log(lineTranslationTemp);
      // scale
      var lineScaleTemp = scaleLine.slice(i * 2, i * 2 + 2);
      console.log(lineScaleTemp);

      lineList.push({
        points: linePointsTemp,
        color: lineColorsTemp,
        translation: lineTranslationTemp,
        scale: lineScaleTemp,
      });
    }

    console.log("line List");
    console.log(lineList);

    // Ambil data rectangle
    rectangleList = [];
    for (let i = 0; i < pointsRectangle.length / 12; i++) {
      console.log(i);
      // Points
      var rectanglePointsTemp = pointsRectangle.slice(i * 12, i * 12 + 12);
      console.log(rectanglePointsTemp);
      // colors
      var rectangleColorsTemp = colorsRectangle.slice(i * 24, i * 24 + 24);
      console.log(rectangleColorsTemp);
      // center
      var rectangleCenterTemp = centerRectangle.slice(i * 2, i * 2 + 2);
      console.log(rectangleCenterTemp);
      // translation
      var rectangleTranslationTemp = translationRectangle.slice(
        i * 2,
        i * 2 + 2
      );
      console.log(rectangleTranslationTemp);
      // scale
      var rectangleScaleTemp = scaleRectangle.slice(i * 2, i * 2 + 2);
      console.log(rectangleScaleTemp);

      rectangleList.push({
        points: rectanglePointsTemp,
        color: rectangleColorsTemp,
        center: rectangleCenterTemp,
        translation: rectangleTranslationTemp,
        scale: rectangleScaleTemp,
      });
    }
    console.log("rectangle List");
    console.log(rectangleList);

    // Ambil data polygon
    polygonList = [];
    nVerticesBefore = 0;
    for (let i = 0; i < nVerticesPolygon.length; i++) {
      console.log(i);
      // Points
      var polygonPointsTemp = pointsPolygon.slice(
        nVerticesBefore * 2,
        nVerticesBefore * 2 + nVerticesPolygon[i] * 2
      );
      console.log(polygonPointsTemp);
      // colors
      var polygonColorsTemp = colorsPolygon.slice(
        nVerticesBefore * 4,
        nVerticesBefore * 4 + nVerticesPolygon[i] * 4
      );
      console.log(polygonColorsTemp);
      // translation
      var polygonTranslationTemp = translationPolygon.slice(i * 2, i * 2 + 2);
      console.log(polygonTranslationTemp);
      // scale
      var polygonScaleTemp = scalePolygon.slice(i * 2, i * 2 + 2);
      console.log(polygonScaleTemp);
      // nvertices
      var polygonVerticesTemp = nVerticesPolygon.slice(i, i + 1);
      console.log(polygonVerticesTemp);

      polygonList.push({
        points: polygonPointsTemp,
        color: polygonColorsTemp,
        translation: polygonTranslationTemp,
        scale: polygonScaleTemp,
        nVertices: polygonVerticesTemp,
      });
      nVerticesBefore = nVerticesBefore + nVerticesPolygon[i];
    }

    console.log("polygon List");
    console.log(polygonList);

    var jsonObject = {
      Square: squareList,
      Line: lineList,
      Rectangle: rectangleList,
      Polygon: polygonList,
    };

    document.getElementById("output").value = JSON.stringify(jsonObject);
  }

  function saveToFile() {
    convertToJSON();

    var jsonObjectAsString = document.getElementById("output").value;

    var blob = new Blob([jsonObjectAsString], {
      type: "application/json",
      // type: "octet/stream",
    });
    console.log(blob);

    var anchor = document.createElement("a");
    anchor.download = "modul.json";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.innerHTML = "download";

    document.getElementById("output").append(anchor);
  }

  // fungsi untuk draw model yang sudah dibaca
  function loadFunction() {
    console.log("Square");
    for (let i = 0; i < dataModul["Square"].length; i++) {
      console.log(dataModul["Square"][i]);
      pointsSquare = pointsSquare.concat(dataModul["Square"][i]["points"]);
      colorsSquare = colorsSquare.concat(dataModul["Square"][i]["color"]);
      centerSquare = centerSquare.concat(dataModul["Square"][i]["center"]);
      translationSquare = translationSquare.concat(
        dataModul["Square"][i]["translation"]
      );
      scaleSquare = scaleSquare.concat(dataModul["Square"][i]["scale"]);
    }

    console.log("Line");
    for (let i = 0; i < dataModul["Line"].length; i++) {
      console.log(dataModul["Line"][i]);
      pointsLine = pointsLine.concat(dataModul["Line"][i]["points"]);
      colorsLine = colorsLine.concat(dataModul["Line"][i]["color"]);
      translationLine = translationLine.concat(
        dataModul["Line"][i]["translation"]
      );
      scaleLine = scaleLine.concat(dataModul["Line"][i]["scale"]);
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
      centerRectangle = centerRectangle.concat(
        dataModul["Rectangle"][i]["center"]
      );
      translationRectangle = translationRectangle.concat(
        dataModul["Rectangle"][i]["translation"]
      );
      scaleRectangle = scaleRectangle.concat(
        dataModul["Rectangle"][i]["scale"]
      );
    }

    console.log("Polygon");
    for (let i = 0; i < dataModul["Polygon"].length; i++) {
      console.log(dataModul["Polygon"][i]);
      pointsPolygon = pointsPolygon.concat(dataModul["Polygon"][i]["points"]);
      colorsPolygon = colorsPolygon.concat(dataModul["Polygon"][i]["color"]);
      translationPolygon = translationPolygon.concat(
        dataModul["Polygon"][i]["translation"]
      );
      scalePolygon = scalePolygon.concat(dataModul["Polygon"][i]["scale"]);
      nVerticesPolygon = nVerticesPolygon.concat(
        dataModul["Polygon"][i]["nVertices"]
      );
    }

    // Draw from data modul
    drawAll();
    updateFormValue();
  }

  function drawSelectionChange() {
    mode = document.getElementById("drawSelection").value;
    console.log(mode);
    var elem = document.getElementsByClassName("form-row")[0];
    elem.parentNode.removeChild(elem);
    addFormTranslation();
    updateFormValue();
  }

  function addFormTranslation() {
    var translationDiv = document.getElementsByClassName("translation-div")[0];
    var formRow = document.createElement("div");
    formRow.classList.add("form-row");
    if (mode == "line") {
      var formRowContents = `
      <p>X1 : <input type="text" id="fieldX1"></p>
      <p>Y1 : <input type="text" id="fieldY1"></p>
      <p>X2 : <input type="text" id="fieldX2"></p>
      <p>Y2 : <input type="text" id="fieldY2"></p>
      `;
    } else if (mode == "square" || mode == "rectangle" || mode == "polygon") {
      var formRowContents = `
      <p>X : <input type="text" id="fieldX1"></p>
      <p>Y : <input type="text" id="fieldY1"></p>
      `;
    }

    formRow.innerHTML = formRowContents;
    translationDiv.appendChild(formRow);
  }

  function updateFormValue() {
    console.log("Update form value");
    // Update form value
    var idx = document.getElementById("model-selection").value;
    if (mode == "line") {
      // Mode line
      // Update transition columns
      for (let i = (idx - 1) * 4; i < (idx - 1) * 4 + 4; i++) {
        if (i < (idx - 1) * 4 + 2) {
          // Vertice pertama
          if (i % 2 == 0) {
            document.getElementById("fieldX1").value = pointsLine[i];
          } else {
            document.getElementById("fieldY1").value = pointsLine[i];
          }
        } else {
          // vertice kedua
          if (i % 2 == 0) {
            document.getElementById("fieldX2").value = pointsLine[i];
          } else {
            document.getElementById("fieldY2").value = pointsLine[i];
          }
        }
        // changing color forms
        document.getElementById("color-r").value = colorsLine[(idx - 1) * 8];
        document.getElementById("color-g").value =
          colorsLine[(idx - 1) * 8 + 1];
        document.getElementById("color-b").value =
          colorsLine[(idx - 1) * 8 + 2];
        document.getElementById("color-a").value =
          colorsLine[(idx - 1) * 8 + 3];
        // Changing scale
        document.getElementById("scaleX").value = scaleLine[(idx - 1) * 2];
        document.getElementById("scaleY").value = scaleLine[(idx - 1) * 2 + 1];
      }
    } else if (mode == "square") {
      // Mode square
      // Changing transition forms
      console.log("Update square");
      console.log(centerSquare);
      document.getElementById("fieldX1").value = centerSquare[(idx - 1) * 2];
      document.getElementById("fieldY1").value =
        centerSquare[(idx - 1) * 2 + 1];
      // Changing the color forms
      document.getElementById("color-r").value = colorsSquare[(idx - 1) * 24];
      document.getElementById("color-g").value =
        colorsSquare[(idx - 1) * 24 + 1];
      document.getElementById("color-b").value =
        colorsSquare[(idx - 1) * 24 + 2];
      document.getElementById("color-a").value =
        colorsSquare[(idx - 1) * 24 + 3];
      // Changing scale
      document.getElementById("scaleX").value = scaleSquare[(idx - 1) * 2];
      document.getElementById("scaleY").value = scaleSquare[(idx - 1) * 2 + 1];
    } else if (mode == "rectangle") {
      // Mode rectangle
      // Changing the transition forms
      document.getElementById("fieldX1").value = centerRectangle[(idx - 1) * 2];
      document.getElementById("fieldY1").value =
        centerRectangle[(idx - 1) * 2 + 1];
      // Changing the color forms
      document.getElementById("color-r").value =
        colorsRectangle[(idx - 1) * 24];
      document.getElementById("color-g").value =
        colorsRectangle[(idx - 1) * 24 + 1];
      document.getElementById("color-b").value =
        colorsRectangle[(idx - 1) * 24 + 2];
      document.getElementById("color-a").value =
        colorsRectangle[(idx - 1) * 24 + 3];
      // Changing scale
      document.getElementById("scaleX").value = scaleRectangle[(idx - 1) * 2];
      document.getElementById("scaleY").value =
        scaleRectangle[(idx - 1) * 2 + 1];
    } else if (mode == "polygon") {
      // mode polygon
      console.log(idx);
      if (idx != "") {
        console.log("Tidak sama dengan null");
        var nVerticesBefore = 0;
      }
      for (let i = 0; i < idx - 1; i++) {
        var nVerticesBefore = nVerticesBefore + nVerticesPolygon[i];
      }
      console.log("N Vertices Before");
      console.log(nVerticesBefore);
      // Changing the transition forms
      document.getElementById("fieldX1").value =
        pointsPolygon[nVerticesBefore * 2];
      document.getElementById("fieldY1").value =
        pointsPolygon[nVerticesBefore * 2 + 1];
      // Changing the color forms
      document.getElementById("color-r").value =
        colorsPolygon[nVerticesBefore * 4];
      document.getElementById("color-g").value =
        colorsPolygon[nVerticesBefore * 4 + 1];
      document.getElementById("color-b").value =
        colorsPolygon[nVerticesBefore * 4 + 2];
      document.getElementById("color-a").value =
        colorsPolygon[nVerticesBefore * 4 + 3];
      // Changing scale
      document.getElementById("scaleX").value = scalePolygon[(idx - 1) * 2];
      document.getElementById("scaleY").value = scalePolygon[(idx - 1) * 2 + 1];
    }
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

    // Draw Polygon
    console.log("Points Polygon");
    console.log(pointsPolygon);
    console.log("Colors Polygon");
    console.log(colorsPolygon);
    console.log("N vertices Polygon");
    console.log(nVerticesPolygon);
    drawPolygon(
      gl.TRIANGLE_FAN,
      new Float32Array(pointsPolygon),
      new Float32Array(colorsPolygon)
    );
    updateFormValue();
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

  // UI Events untuk persegi
  function onmousedownSquare(event) {
    console.log("Mouse down Square");
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

    var centerX =
      (pointsSquare[current_length - 2] + pointsSquare[current_length - 4]) / 2;

    var centerY =
      (pointsSquare[current_length - 1] + pointsSquare[current_length - 3]) / 2;

    console.log("Center X ");
    console.log(centerX);
    console.log("Center Y");
    console.log(centerY);

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

    console.log("Center square");
    centerSquare.push(centerX, centerY);
    console.log(centerSquare);

    translationSquare.push(0.0, 0.0);
    scaleSquare.push(1.0, 1.0);

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

    var centerX =
      (pointsRectangle[current_length - 2] +
        pointsRectangle[current_length - 4]) /
      2;

    var centerY =
      (pointsRectangle[current_length - 1] +
        pointsRectangle[current_length - 3]) /
      2;

    console.log("Center X ");
    console.log(centerX);
    console.log("Center Y");
    console.log(centerY);

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

    console.log("points rectangle");
    console.log(pointsRectangle);

    console.log("Center rectangle");
    centerRectangle.push(centerX, centerY);
    console.log(centerRectangle);

    translationRectangle.push(0.0, 0.0);
    scaleRectangle.push(1.0, 1.0);

    drawAll();
  }

  // Gambar Polygon
  function onmousedownPolygon(event) {
    console.log("Draw Polygon");
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    console.log(point);
    pointsPolygon.push(point.x);
    pointsPolygon.push(point.y);
    // Add color for polygon
    colorsPolygon.push(0.0, 1.0, 0.0, 1.0);
    polygonVerticesCounter++;

    if (pressedKeys[16]) {
      console.log("Pressed key True");
      translationPolygon.push(0.0, 0.0);
      scalePolygon.push(1.0, 1.0);
      nVerticesPolygon.push(polygonVerticesCounter);
      polygonVerticesCounter = 0;
      drawAll();
    } else {
      console.log("Pressed key False");
    }
  }

  function keyDown(event) {
    pressedKeys[event.keyCode] = true;
  }

  function keyUp(event) {
    pressedKeys[event.keyCode] = false;
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
    var point = uiUtils.pixelInputToGLCoord(event, canvas);
    pointsLine.push(point.x);
    pointsLine.push(point.y);
    colorsLine.push(1.0, 0.0, 0.0, 1.0);
    translationLine.push(0.0, 0.0, 0.0, 0.0);
    scaleLine.push(1.0, 1.0);
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

  function translationAll() {
    var idx = document.getElementById("model-selection").value;
    console.log("Translation All");
    console.log(idx);
    if (mode == "line") {
      console.log("Translation line");
      var deltaX1 =
        document.getElementById("fieldX1").value - pointsLine[(idx - 1) * 4];
      var deltaY1 =
        document.getElementById("fieldY1").value -
        pointsLine[(idx - 1) * 4 + 1];
      var deltaX2 =
        document.getElementById("fieldX2").value -
        pointsLine[(idx - 1) * 4 + 2];
      var deltaY2 =
        document.getElementById("fieldY2").value -
        pointsLine[(idx - 1) * 4 + 3];

      for (let i = (idx - 1) * 4; i < (idx - 1) * 4 + 4; i++) {
        if (i < (idx - 1) * 4 + 2) {
          // Vertice pertama
          if (i % 2 == 0) {
            pointsLine[i] = pointsLine[i] + deltaX1;
            translationLine[i] = deltaX1;
          } else {
            pointsLine[i] = pointsLine[i] + deltaY1;
            translationLine[i] = deltaY1;
          }
        } else {
          // vertice kedua
          if (i % 2 == 0) {
            pointsLine[i] = pointsLine[i] + deltaX2;
            translationLine[i] = deltaX2;
          } else {
            pointsLine[i] = pointsLine[i] + deltaY2;
            translationLine[i] = deltaY2;
          }
        }
      }
      console.log(translationLine);
    } else if (mode == "square") {
      console.log("Translation square");
      var deltaX =
        document.getElementById("fieldX1").value - centerSquare[(idx - 1) * 2];
      var deltaY =
        document.getElementById("fieldY1").value -
        centerSquare[(idx - 1) * 2 + 1];
      console.log(translationSquare);
      translationSquare[(idx - 1) * 2] = deltaX;
      translationSquare[(idx - 1) * 2 + 1] = deltaY;
      centerSquare[(idx - 1) * 2] = parseFloat(
        document.getElementById("fieldX1").value
      );
      centerSquare[(idx - 1) * 2 + 1] = parseFloat(
        document.getElementById("fieldY1").value
      );
      for (let i = (idx - 1) * 12; i < (idx - 1) * 12 + 12; i++) {
        if (i % 2 == 0) {
          pointsSquare[i] = pointsSquare[i] + deltaX;
        } else {
          pointsSquare[i] = pointsSquare[i] + deltaY;
        }
      }
      console.log(translationSquare);
    } else if (mode == "rectangle") {
      console.log("Translation rectangle");
      var deltaX =
        document.getElementById("fieldX1").value -
        centerRectangle[(idx - 1) * 2];
      var deltaY =
        document.getElementById("fieldY1").value -
        centerRectangle[(idx - 1) * 2 + 1];
      translationRectangle[(idx - 1) * 2] = deltaX;
      translationRectangle[(idx - 1) * 2 + 1] = deltaY;
      centerRectangle[(idx - 1) * 2] = parseFloat(
        document.getElementById("fieldX1").value
      );
      centerRectangle[(idx - 1) * 2 + 1] = parseFloat(
        document.getElementById("fieldY1").value
      );
      for (let i = (idx - 1) * 12; i < (idx - 1) * 12 + 12; i++) {
        if (i % 2 == 0) {
          pointsRectangle[i] = pointsRectangle[i] + deltaX;
        } else {
          pointsRectangle[i] = pointsRectangle[i] + deltaY;
        }
      }
      console.log(translationRectangle);
    } else if (mode == "polygon") {
      console.log("Translation polygon");
      var nVerticesBefore = 0;
      for (let i = 0; i < idx - 1; i++) {
        nVerticesBefore = nVerticesBefore + nVerticesPolygon[i];
      }
      var deltaX =
        document.getElementById("fieldX1").value -
        pointsPolygon[nVerticesBefore * 2];
      var deltaY =
        document.getElementById("fieldY1").value -
        pointsPolygon[nVerticesBefore * 2 + 1];
      translationPolygon[(idx - 1) * 2] = deltaX;
      translationPolygon[(idx - 1) * 2 + 1] = deltaY;

      for (
        let i = nVerticesBefore * 2;
        i < nVerticesBefore * 2 + nVerticesPolygon[idx - 1] * 2;
        i++
      ) {
        if (i % 2 == 0) {
          pointsPolygon[i] = pointsPolygon[i] + deltaX;
        } else {
          pointsPolygon[i] = pointsPolygon[i] + deltaY;
        }
      }
    }

    drawAll();
  }

  function changeColor() {
    // Change model color
    console.log("Changing colors");
    var idx = document.getElementById("model-selection").value;
    // console.log(idx);
    console.log(colorsSquare);
    var colorR = parseFloat(document.getElementById("color-r").value);
    var colorG = parseFloat(document.getElementById("color-g").value);
    var colorB = parseFloat(document.getElementById("color-b").value);
    var colorA = parseFloat(document.getElementById("color-a").value);
    if (mode == "line") {
      // Line
      for (let i = (idx - 1) * 8; i < (idx - 1) * 8 + 8; i += 4) {
        colorsLine[i] = colorR;
        colorsLine[i + 1] = colorG;
        colorsLine[i + 2] = colorB;
        colorsLine[i + 3] = colorA;
      }
      console.log(colorsLine);
    } else if (mode == "square") {
      // square
      for (let i = (idx - 1) * 24; i < (idx - 1) * 24 + 24; i += 4) {
        colorsSquare[i] = colorR;
        colorsSquare[i + 1] = colorG;
        colorsSquare[i + 2] = colorB;
        colorsSquare[i + 3] = colorA;
      }
      console.log(colorsSquare);
    } else if (mode == "rectangle") {
      // rectangle
      for (let i = (idx - 1) * 24; i < (idx - 1) * 24 + 24; i += 4) {
        colorsRectangle[i] = colorR;
        colorsRectangle[i + 1] = colorG;
        colorsRectangle[i + 2] = colorB;
        colorsRectangle[i + 3] = colorA;
      }
      console.log(colorsRectangle);
    } else if (mode == "polygon") {
      // Polygon
      var nVerticesBefore = 0;
      for (let i = 0; i < idx - 1; i++) {
        nVerticesBefore = nVerticesBefore + nVerticesPolygon[i];
      }

      for (
        let i = nVerticesBefore * 4;
        i < nVerticesBefore * 4 + nVerticesPolygon[idx - 1] * 4;
        i += 4
      ) {
        colorsPolygon[i] = colorR;
        colorsPolygon[i + 1] = colorG;
        colorsPolygon[i + 2] = colorB;
        colorsPolygon[i + 3] = colorA;
      }
    }

    drawAll();
    updateFormValue();
  }

  function scaleAll() {
    // Scale
    var idx = document.getElementById("model-selection").value;
    console.log("Scale all function");
    var scaleX = parseFloat(document.getElementById("scaleX").value);
    var scaleY = parseFloat(document.getElementById("scaleY").value);
    if (mode == "line") {
      console.log("Scaling line");
      scaleLine[(idx - 1) * 2] = scaleX;
      scaleLine[(idx - 1) * 2 + 1] = scaleY;
      for (let i = (idx - 1) * 4; i < (idx - 1) * 4 + 4; i++) {
        if (i % 2 == 0) {
          pointsLine[i] = pointsLine[i] * scaleX;
        } else {
          pointsLine[i] = pointsLine[i] * scaleY;
        }
      }
      console.log(scaleLine);
    } else if (mode == "square") {
      console.log("Scaling square");
      scaleSquare[(idx - 1) * 2] = scaleX;
      scaleSquare[(idx - 1) * 2 + 1] = scaleY;
      centerSquare[(idx - 1) * 2] = centerSquare[(idx - 1) * 2] * scaleX;
      centerSquare[(idx - 1) * 2 + 1] =
        centerSquare[(idx - 1) * 2 + 1] * scaleY;
      for (let i = (idx - 1) * 12; i < (idx - 1) * 12 + 12; i++) {
        if (i % 2 == 0) {
          pointsSquare[i] = pointsSquare[i] * scaleX;
        } else {
          pointsSquare[i] = pointsSquare[i] * scaleY;
        }
      }
      console.log(scaleSquare);
    } else if (mode == "rectangle") {
      console.log("Scaling rectangle");
      scaleRectangle[(idx - 1) * 2] = scaleX;
      scaleRectangle[(idx - 1) * 2 + 1] = scaleY;
      centerRectangle[(idx - 1) * 2] = centerRectangle[(idx - 1) * 2] * scaleX;
      centerRectangle[(idx - 1) * 2 + 1] =
        centerRectangle[(idx - 1) * 2 + 1] * scaleY;
      for (let i = (idx - 1) * 12; i < (idx - 1) * 12 + 12; i++) {
        if (i % 2 == 0) {
          pointsRectangle[i] = pointsRectangle[i] * scaleX;
        } else {
          pointsRectangle[i] = pointsRectangle[i] * scaleY;
        }
      }
      console.log(scaleRectangle);
    } else if (mode == "polygon") {
      console.log("Scaling polygon");
      scalePolygon[(idx - 1) * 2] = scaleX;
      scalePolygon[(idx - 1) * 2 + 1] = scaleY;
      var nVerticesBefore = 0;
      for (let i = 0; i < idx - 1; i++) {
        nVerticesBefore = nVerticesBefore + nVerticesPolygon[i];
      }
      for (
        let i = nVerticesBefore * 2;
        i < nVerticesBefore * 2 + nVerticesPolygon[idx - 1] * 2;
        i++
      ) {
        if (i % 2 == 0) {
          pointsPolygon[i] = pointsPolygon[i] * scaleX;
        } else {
          pointsPolygon[i] = pointsPolygon[i] * scaleY;
        }
      }
    }

    drawAll();
  }

  function drawPolygon(type, vertices, colors) {
    var n = initBuffers(vertices, colors);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

    var startTemp = 0;
    for (let i = 0; i < nVerticesPolygon.length; i++) {
      gl.drawArrays(type, startTemp, nVerticesPolygon[i]);
      startTemp = startTemp + nVerticesPolygon[i];
      console.log(i);
    }
  }

  function drawA(type, vertices, colors) {
    var n = initBuffers(vertices, colors);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

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
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    return n;
  }
})(window || this);
