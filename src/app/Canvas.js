"use client";

import { useRef, useState, useEffect } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);

  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currColor, setCurrColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawingAction, setDrawingAction] = useState([]);
  const [currPath, setCurrPath] = useState([]);
  const [currStyle, setCurrStyle] = useState({
    color: "black",
    lineWidth: 3,
  });

  const reDrawPreviousData = (ctx) => {
    drawingAction.forEach(({ path, style }) => {
      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 900;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      reDrawPreviousData(ctx);
    }
  }, []);

  const startDrawing = (e) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (context) {
      context.strokeStyle = currStyle.color;
      context.lineWidth = currStyle.lineWidth;
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      setCurrPath([
        ...currPath,
        { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
      ]);
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    context && context.closePath();
    if (currPath.length > 0) {
      setDrawingAction([
        ...drawingAction,
        { path: currPath, style: currStyle },
      ]);
    }
    setCurrPath([]);
  };

  const changeColor = (color) => {
    setCurrColor(color);
    setCurrStyle({ ...currStyle, color });
  };

  const changeWidth = (width) => {
    setLineWidth(width);
    setCurrStyle({ ...currStyle, lineWidth: width });
  };

  const undoDrawing = () => {
    if (drawingAction.length > 0) {
      drawingAction.pop();
      if (canvasRef.current) {
        const newContext = canvasRef.current?.getContext("2d");
        newContext?.clearRect(
          0,
          0,
          canvasRef.current?.width,
          canvasRef.current?.height
        );

        drawingAction.forEach(({ path, style }) => {
          newContext?.beginPath();
          newContext.strokeStyle = style.color;
          newContext.lineWidth = style.lineWidth;
          newContext?.moveTo(path[0].x, path[0].y);
          path.forEach((point) => {
            newContext?.lineTo(point.x, point.y);
          });
          newContext?.stroke();
        });
      }
    }
  };

  const clearDrawing = () => {
    setDrawingAction([]);
    setCurrPath([]);
    const newContext = canvasRef.current?.getContext("2d");
    newContext?.clearRect(
      0,
      0,
      canvasRef.current?.width,
      canvasRef.current?.height
    );
  };

  return (
    <div className="flex gap-12">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className="border border-gray-700"
      />
      <div className="flex flex-col my-4 justify-evenly">
        <div className="flex justify-center space-x-4">
          {["black", "red", "blue", "green", "yellow"].map((color) => (
            <button
              key={color}
              onClick={() => changeColor(color)}
              style={{ backgroundColor: color }}
              className="w-8 h-8 rounded-full cursor-pointer"
              // className={`w-8 h-8 rounded-full cursor-pointer ${currColor === color ? `${color === "black" ? "bg-white" : `bg-${color}-800`  ` }`}
            />
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={lineWidth}
          onChange={(e) => changeWidth(parseInt(e.target.value, 10))}
        />
        <div className="flex justify-center my-4">
          <button
            onClick={undoDrawing}
            className="bg-gray-800 text-white px-4 py-2 rounded-md mr-4"
          >
            Undo
          </button>
          <button
            onClick={clearDrawing}
            className="bg-gray-800 text-white px-4 py-2 rounded-md mr-4"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
