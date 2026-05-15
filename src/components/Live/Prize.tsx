import { getPrizes } from "@/api/getData";
import { useQuery } from "@tanstack/react-query";
import { Heading } from "../Skeletons/Heading";
import { Prize, PrizeGrid } from "../Skeletons/PrizeSkeleton";

type Prize = {
  type: string;
  category: string;
  prizes: string;
};

export const PrizeSection = () => {
  const {
    data: prizes = [],
    isLoading,
    isError,
  } = useQuery<Prize[]>({
    queryKey: ["prizes"],
    queryFn: getPrizes,
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-start items-start animate-pulse">
        <Heading />
        <PrizeGrid />
      </div>
    );
  }

  if (isError) {
    return <p className="text-brown-light text-center py-8">Coming soon...</p>;
  }

  const groupedPrizes = prizes.reduce<Record<string, Prize[]>>((acc, prize) => {
    if (!acc[prize.type]) acc[prize.type] = [];
    acc[prize.type].push(prize);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedPrizes).map(([type, prizeList]) => (
        <div key={type}>
          <h2 className="font-sans text-pink-transition text-lg font-bold mb-3">
            {type}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            {prizeList.map(({ category, prizes }, index) => (
              <div key={index} className="p-4 rounded-lg bg-white">
                <h3 className="font-medium">{category}</h3>
                <p className="text-brown">{prizes}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
