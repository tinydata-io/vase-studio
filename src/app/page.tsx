import { PropertyEditor } from "@/components/PropertyEditor";
import { VasePreview } from "@/components/VasePreview";

import { SampleA } from "@/examples/vase";

export default function Home() {
  return (
    <main className="flex justify-center h-full p-4 pb-[40px]">
      <div className="flex w-full 2xl:w-[1500px]">
        <div className="flex justify-center items-center w-3/5 bg-red-200">
          <div className="relative flex justify-center items-center w-[calc(85vh)] 2xl:w-full aspect-square bg-green-200">
            <VasePreview vase={SampleA} />
          </div>
        </div>
        <div className="flex justify-center items-start w-2/5 pl-4">
          {/* Place for Tabs Component */}
          <PropertyEditor />
        </div>
      </div>
    </main>
  );
}
