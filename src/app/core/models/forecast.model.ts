export interface SipRequest {
  initialInvestment: number;
  monthlyInvestment: number;
  expectedAnnualReturnRate: number;
  durationYears: number;
}

export interface SipResult {
  totalInvestment: number;
  estimatedGrowth: number;
  estimatedFutureValue: number;
}

export interface CagrRequest {
  initialInvestment: number;
  finalValue: number;
  periodYears: number;
}

export interface CagrResult {
  initialInvestment: number;
  finalValue: number;
  periodYears: number;
  cagrPercent: number;
}

export interface ForecastRequest {
  currentInvestment: number;
  monthlyInvestment: number;
  expectedAnnualReturnRate: number;
  targetAmount?: number | null;
}

export interface ForecastPeriod {
  years: number;
  invested: number;
  estimatedValue: number;
  gain: number;
  cagrPercent: number;
}

export interface ForecastGraphPoint {
  year: number;
  totalInvested: number;
  estimatedValue: number;
  targetAmount: number | null;
}

export interface ForecastResult {
  periods: ForecastPeriod[];
  graphPoints: ForecastGraphPoint[];
}

export interface GoalForecastRequest {
  currentAmount: number;
  targetAmount: number;
  monthlyContribution: number;
  expectedAnnualReturnRate: number;
  inflationRate: number;
  targetDate: string;
}

export interface GoalForecastResult {
  todayCost: number;
  inflationAdjustedTargetAmount: number;
  remainingAmount: number;
  remainingMonths: number;
  requiredMonthlyContribution: number;
  currentMonthlyContribution: number;
  monthlyShortfall: number;
  projectedAmount: number;
  progressPercent: number;
  status: string;
}
