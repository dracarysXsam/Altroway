import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RolePlaceholder({ role }: { role: string }) {
  const roleName = role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {roleName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your personalized dashboard is currently under construction.
          </p>
          <p className="text-gray-600 mt-2">
            Check back soon for features tailored just for you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
