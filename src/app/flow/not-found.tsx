import Link from "next/link";
import { Card, CardContent } from "@/components/flow/ui/card";
import { AlertCircle } from "lucide-react";

export default function FlowNotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="!text-2xl">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <div className="mt-6">
            <Link href="/flow" className="text-primary hover:underline">
              Return to Flow Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
