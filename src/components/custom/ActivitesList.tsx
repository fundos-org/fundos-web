import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

const tags = Array.from({ length: 10 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default function ActivitesList() {
  return (
    <Card className="w-6/10 mt-5 border-0 rounded-none bg-[#1f1f1f] text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-400">ACTIVITIES</CardTitle>
        <CardDescription>Find your daily activities here</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[400px] rounded-md border-0">
        <div className="px-3">
          {tags.map((_, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src="/vite.svg" alt="Brooklyn Simmons" />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">
                    Rahul Singh invested 3,00,000 INR into Infotech Pvt ltd
                  </h4>
                  <p className="text-sm text-gray-500">just now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
