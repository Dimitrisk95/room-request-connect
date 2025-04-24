
import { Hotel } from "lucide-react";

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-primary p-3">
          <Hotel className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold">Room Request Connect</h1>
      <p className="text-muted-foreground mt-2">
        Connect with your hotel for a seamless stay
      </p>
    </div>
  );
};

export default LoginHeader;
