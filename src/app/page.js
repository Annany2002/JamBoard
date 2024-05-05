import Canvas from "./Canvas";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between w-full">
      <h1 className="text-3xl text-slate-800 font-semibold py-4">
        JamBoard - A Whiteboard
      </h1>
      <Canvas />
    </main>
  );
}
