import Counter from "../Counter";

type TimerBarProps = {
  timeLeft: number;
  maxTime: number;
};

export const TimerBar = ({ timeLeft, maxTime }: TimerBarProps) => {
  const width = (timeLeft / maxTime) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span>Time left</span>
        <span className="flex items-center">
          <Counter
            value={timeLeft}
            places={[10, 1]}
            fontSize={14}
            textColor="white"
            fontWeight={400}
          />
          s
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full transition-all bg-linear-to-r from-[#FF6050] to-[#FF0E83]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
