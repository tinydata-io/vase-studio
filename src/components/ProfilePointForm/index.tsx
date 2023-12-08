import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="points">Points</Label>
          <Input id="points" className="h-7 w-24 border-slate-300" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="offset">Offset</Label>
          <Input id="offset" className="h-7 w-24 border-slate-300" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="angleStart">Angle start</Label>
          <Input id="angleStart" className="h-7 w-24 border-slate-300" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="angleStep">Angle step</Label>
          <Input id="angleStep" className="h-7 w-24 border-slate-300" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="easingIn" className="w-fit">
            Easing in
          </Label>
          <Slider id="easingIn" className="w-24 h-7" />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Label htmlFor="easingOut" className="w-fit">
            Easing out
          </Label>
          <Slider id="easingOut" className="w-24 h-9" />
        </div>
      </div>
    </div>
  );
};
