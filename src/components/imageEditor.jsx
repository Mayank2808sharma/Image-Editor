import React, { useEffect, useRef, useState } from "react";

const SimpleImageEditor = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState("#FF0000");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 550 });
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderShape, setBorderShape] = useState("rectangle");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [imageEffect, setImageEffect] = useState("none");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawImage();
  }, [
    image,
    text,
    fontSize,
    fontColor,
    textPosition,
    canvasSize,
    borderColor,
    borderShape,
    borderStyle,
    borderWidth,
    imageEffect,
  ]);
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "edited_image.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          resizeCanvas(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const applyImageEffect = (ctx) => {
    switch (imageEffect) {
      case "grayscale":
        ctx.filter = "grayscale(100%)";
        break;
      case "sepia":
        ctx.filter = "sepia(100%)";
        break;
      case "invert":
        ctx.filter = "invert(100%)";
        break;
      default:
        ctx.filter = "none";
    }
  };

  const resizeCanvas = (img) => {
    const maxWidth = window.innerWidth * 0.6;
    const maxHeight = window.innerHeight * 0.8;
    const widthRatio = maxWidth / img.width;
    const heightRatio = maxHeight / img.height;
    const ratio = Math.min(widthRatio, heightRatio);

    setCanvasSize({
      width: img.width * ratio,
      height: img.height * ratio,
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateTextPosition(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateTextPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateTextPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= 0 && x <= canvasSize.width && y >= 0 && y <= canvasSize.height) {
      setTextPosition({ x, y });
      drawImage();
    }
  };

  const drawBorder = (ctx) => {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;

    switch (borderStyle) {
      case "dotted":
        ctx.setLineDash([1, 5]);
        break;
      case "dashed":
        ctx.setLineDash([10, 10]);
        break;
      case "double":
        ctx.lineWidth = 1;
        break;
      default:
        ctx.setLineDash([]);
    }

    switch (borderShape) {
      case "rectangle":
        ctx.strokeRect(0, 0, canvasSize.width, canvasSize.height);
        if (borderStyle === "double") {
          ctx.strokeRect(10, 10, canvasSize.width - 20, canvasSize.height - 20);
        }
        break;
      case "circle":
        ctx.beginPath();
        ctx.ellipse(
          canvasSize.width / 2,
          canvasSize.height / 2,
          canvasSize.width / 2 - 5,
          canvasSize.height / 2 - 5,
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        if (borderStyle === "double") {
          ctx.beginPath();
          ctx.ellipse(
            canvasSize.width / 2,
            canvasSize.height / 2,
            canvasSize.width / 2 - 15,
            canvasSize.height / 2 - 15,
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }
        break;
    }
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (canvas && image) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        applyImageEffect(ctx);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none"; // Reset filter before drawing text
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = fontColor;
        ctx.fillText(text, textPosition.x, textPosition.y);
        drawBorder(ctx);
      }
    }
  };

  return (
    <div className="flex justify-center items-start mt-8 space-x-8">
      <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none"
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Text"
          className="p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none"
        />
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Font Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="p-3 border border-gray-300 rounded-lg w-20 focus:outline-none"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Font Color</label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-12 h-12 mr-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-12 h-12 mr-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Border Width</label>
          <input
            type="number"
            value={borderWidth}
            min="1"
            max="20"
            onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
            className="p-3 border border-gray-300 rounded-lg w-20 focus:outline-none"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Border Shape</label>
          <select
            value={borderShape}
            onChange={(e) => setBorderShape(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Border Style</label>
          <select
            value={borderStyle}
            onChange={(e) => setBorderStyle(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
            <option value="double">Double</option>
          </select>
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Image Effect</label>
          <select
            value={imageEffect}
            onChange={(e) => setImageEffect(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
          </select>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mt-4 focus:outline-none"
        >
          Download Image
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-400 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default SimpleImageEditor;
