import { PropertyEditor } from "@/components/PropertyEditor";

export default function Home() {
  return (
    <main className="flex h-full  p-4 pb-[56px]">
      <div className="flex justify-center items-center w-3/5 bg-red-200">
        <div className="relative flex justify-center items-center h-4/5 xl:h-full aspect-square bg-green-200">
          {/* Place for vase image component */}
        </div>
      </div>
      <div className="flex justify-center items-start w-2/5 ">
        {/* Place for Tabs Component */}
        <PropertyEditor />
      </div>
    </main>
  );
}
