import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import IndiaMap from "../IndiaMap";
import Chatbot from "../Chatbot";

export default function PlaceholderContent() {
  return (
    <Card className="  rounded-lg border-none mt-[8px] overflow-hidden">
      <CardContent className="p-6 relative h-[80vh]"> 
        <div className="absolute inset-0">
          <IndiaMap />
        </div>
      </CardContent>
      
    </Card>
  );
}
