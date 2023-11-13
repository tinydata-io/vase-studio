import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const About = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline cursor-pointer">about</button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum libero
            quod, et eveniet blanditiis fugiat at facilis voluptatem nisi. Nisi
            deserunt ut ducimus? Ea repellat repellendus veritatis, dolorum
            dolore vel. Voluptate quam quas libero, modi dolor, quasi minima
            rerum porro maxime eius eos aspernatur inventore, aperiam corporis!
            Inventore, ut. Aliquam, aliquid. Eveniet est id hic labore. Cum modi
            nisi numquam?
            <br />
            <br />
            Cupiditate aperiam modi magni libero, commodi fugit dolor,
            doloremque nam officiis, sequi temporibus quas laboriosam aliquam
            odio voluptatibus? Corporis error suscipit ut recusandae molestiae
            placeat iusto impedit ducimus modi vero! Architecto nostrum quisquam
            nulla quidem suscipit voluptatibus iure aut dolorum sapiente. Veniam
            similique ex aut quasi omnis eum, magni in facere id repellendus
            itaque nesciunt deleniti suscipit non cupiditate modi.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
