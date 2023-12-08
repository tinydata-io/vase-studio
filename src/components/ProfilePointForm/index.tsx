import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProfilePointForm = () => {
  return (
    <div
      id="formContainer"
      className="flex p-2 gap-2 w-fit border border-black">
      <div id="verticalLine" className="w-1 h-auto bg-[#BBBBBB]"></div>
      <div
        id="color"
        className="h-[33px] aspect-square bg-red-500 border border-black"></div>
      <div id="inputs&slidersContainer" className="flex flex-col gap-2 px-2">
        <div className="flex items-center justify-between gap-6 ">
          <Label>Points</Label>
          <Input className="h-9 w-16" />
        </div>
        {/* <div className="flex">
          <label>Angle start</label>
          <Input />
        </div>
        <div className="flex">
          <label>Angle step</label>
          <Input />
        </div>
        <div>
          <label>Easing in</label>
          {/* <Slider /> */}
        {/* </div>
        <div>
          <label>Easing out</label>
          {/* <Slider /> */}
        {/*} </div> */}
      </div>
    </div>
  );
};
