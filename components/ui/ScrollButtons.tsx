import { ArrowLeft, ArrowRight } from "lucide-react";

const ScrollButtons = ({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLDivElement>;
}) => {
  const scrollAmount = 350;

  const scrollLeft = () => {
    if (targetRef.current) {
      targetRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (targetRef.current) {
      targetRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-4 ">
      <button onClick={scrollLeft} aria-label="previous coutstomer button">
        <ArrowLeft strokeWidth={1.75} />
      </button>
      <button onClick={scrollRight} aria-label="next coutstomer button">
        <ArrowRight strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default ScrollButtons;
