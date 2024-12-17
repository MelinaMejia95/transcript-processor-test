'use client'

import DragDrop from "./components/DragDrop/DragDrop";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-6">
      <h1 className="text-3xl font-bold my-3 text-[#00cdff]">Let&apos;s transcript your file!</h1>
      <DragDrop />
    </div>
  );
}
