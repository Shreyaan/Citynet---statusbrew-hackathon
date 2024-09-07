import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GoogleAuthButton } from "./GoogleAuthButton";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="mx-auto my-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Use google to login or sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleAuthButton />
        </CardContent>
      </Card>
    </div>
  );
}
