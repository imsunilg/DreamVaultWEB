export type DreamPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type DreamStatus = 'Wishlist' | 'Planned' | 'Active' | 'OnTrack' | 'AtRisk' | 'Completed' | 'Cancelled';

export interface Dream {
  dreamId: number;
  name: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;
  priority: DreamPriority;
  status: DreamStatus;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  startDate: string;
  targetDate: string;
  completedDate: string | null;
  imageUrl: string | null;
  notes: string | null;
  progressPercent: number;
  inflationAdjustedTargetAmount: number;
  projectedAmount: number;
  requiredMonthlyContribution: number;
  computedStatus: string;
  remainingMonths: number;
}

export interface DreamCreateRequest {
  name: string;
  description?: string | null;
  categoryId?: number | null;
  priority: DreamPriority;
  status: DreamStatus;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  startDate: string;
  targetDate: string;
  imageUrl?: string | null;
  notes?: string | null;
}

export interface DreamUpdateRequest extends DreamCreateRequest {
  completedDate?: string | null;
}

export interface Contribution {
  contributionId: number;
  dreamId: number;
  contributionDate: string;
  amount: number;
  notes: string | null;
}

export interface ContributionCreateRequest {
  contributionDate: string;
  amount: number;
  notes?: string | null;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string | null;
  isActive: boolean;
}
