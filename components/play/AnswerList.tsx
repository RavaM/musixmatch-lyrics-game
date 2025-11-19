import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

type Answer = {
  id: string;
  label: string;
};

type AnswerListProps = {
  answers: Answer[];
  correctAnswerId: string;
  selectedAnswerId: string | null;
  isLocked: boolean;
  onAnswerClick: (answerId: string) => void;
};

export const AnswerList = ({
  answers,
  correctAnswerId,
  selectedAnswerId,
  isLocked,
  onAnswerClick,
}: AnswerListProps) => {
  return (
    <div className="space-y-2">
      {answers.map((answer) => {
        const isSelected = selectedAnswerId === answer.id;
        const isCorrectAnswer = answer.id === correctAnswerId;

        let variant: "default" | "success" | "destructive" = "default";
        let Icon: React.ComponentType<{ className?: string }> | null = null;

        if (isLocked) {
          if (isSelected && isCorrectAnswer) {
            variant = "success";
            Icon = Check;
          } else if (isSelected && !isCorrectAnswer) {
            variant = "destructive";
            Icon = X;
          } else if (!isSelected && isCorrectAnswer) {
            variant = "success";
          }
        }

        const shouldShake = isLocked && isSelected && !isCorrectAnswer;
        const shouldPulse = isLocked && isSelected && isCorrectAnswer;

        return (
          <motion.div
            key={answer.id}
            animate={
              shouldShake
                ? { x: [0, -8, 8, -8, 0] }
                : shouldPulse
                ? { scale: [1, 1.05, 1] }
                : { x: 0, scale: 1 }
            }
            transition={{ duration: 0.4 }}
          >
            <Button
              className="w-full justify-start"
              variant={variant}
              disabled={isLocked}
              onClick={() => onAnswerClick(answer.id)}
            >
              {Icon && <Icon className="mr-2" />}
              <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                {answer.label}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};
