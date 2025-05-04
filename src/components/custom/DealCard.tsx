import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { Progress } from "../ui/progress";

export default function DealCard({ status }: { status: boolean }) {
  return (
    <Card className="border-0 rounded-none bg-[#1a1a1a] text-white p-5 w-[413px] max-w-md">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
              🚀 Startup
            </div>
          </div>

          {status ? (
            <Badge className="bg-[#00fb5745] text-white px-3 py-1 rounded-xs text-sm font-medium">
              <span className="mr-1 inline-block w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400">active</span>
            </Badge>
          ) : (
            <Badge className="bg-[#fd888845] text-white px-3 py-1 rounded-xs text-sm font-medium">
              <span className="mr-1 inline-block w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-400">closed</span>
            </Badge>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-4">Infotech Pvt. Ltd.</h2>
        <p className="text-zinc-400 mt-1">
          We are an Ed-tech company building CRM for local institutes
        </p>

        <div className="flex gap-2 mt-3">
          <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
            Ed-tech
          </span>
          <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
            Pre-seed
          </span>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <p className="text-sm text-zinc-400">Funding round</p>
            <p className="text-3xl font-bold">$200K</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Capital committed</p>
            <p className="text-3xl font-bold">$20K</p>
          </div>
        </div>
        <hr className="mt-3" />
        <div className="w-full mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-zinc-400 mb-1">10% raised</p>
            <Progress className="bg-white" value={33} />
          </div>
          <div className="flex justify-end items-center text-white font-medium text-lg cursor-pointer">
            Manage <ChevronDown className="ml-1 h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
