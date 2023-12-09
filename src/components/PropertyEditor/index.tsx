import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const PropertyEditor = () => {
  return (
    <Tabs defaultValue="configure" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="configure">Configure</TabsTrigger>
        <TabsTrigger value="customizeShape">Customize shape</TabsTrigger>
      </TabsList>
      <TabsContent value="configure">
        <Card>
          <CardContent className="space-y-2 pt-6 pb-2">
            Dimensions Form
            <Separator />
            Profile
            <Separator />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Export</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="customizeShape">
        {/* TODO - Change sample content to the right one.  */}
        <Card>
          <CardHeader>
            <CardTitle>Customize shape</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi ad,
              quaerat nesciunt libero necessitatibus aspernatur ab omnis
              doloremque perferendis! Est sapiente sint atque accusantium
              blanditiis consectetur iste rerum, dolorum soluta!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            excepturi cupiditate natus modi minus, tempore similique, animi vel
            rem alias adipisci culpa molestiae sapiente optio nesciunt ea
            aliquam. Sapiente, eaque.
          </CardContent>
          <CardFooter>{/* <Button>Save password</Button> */}</CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
