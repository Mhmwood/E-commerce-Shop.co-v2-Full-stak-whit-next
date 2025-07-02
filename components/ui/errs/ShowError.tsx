import { CircleAlert } from "lucide-react";

const ShowError = ({ errorMsg }: { errorMsg?: string | null }) => {
  return (
    <div className="text-red-500 flex flex-col  py-5 items-center space-y-1 w-full">
      <CircleAlert className="size-14 " strokeWidth={1.3} />
      <h1>{errorMsg ? errorMsg : "Something went wrong"}</h1>
    </div>
  );
};

export default ShowError;
