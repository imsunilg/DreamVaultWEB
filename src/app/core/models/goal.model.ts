export interface Goal {
  goalId: number;
  dreamId: number;
  dreamName: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  targetDate: string;
  remainingMonths: number;
  requiredMonthlyContribution: number;
  projectedAmount: number;
  progressPercent: number;
  status: string;
}
