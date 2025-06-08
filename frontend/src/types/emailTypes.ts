export interface PlanSummary {
  id: string;
  title: string;
  status: 'ACTIVE' | 'DRAFT';
}

export interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: () => void;
  patientId: number | string;
  patientName: string;
  patientEmail?: string;
  professionalName?: string;
  availablePlans: {
    dietPlans: PlanSummary[];
    workoutPlans: PlanSummary[];
  };
}

export interface PlanSelectorProps {
  availablePlans: {
    dietPlans: PlanSummary[];
    workoutPlans: PlanSummary[];
  };
  selectedDietPlans: string[];
  selectedWorkoutPlans: string[];
  onDietPlanChange: (planId: string, checked: boolean) => void;
  onWorkoutPlanChange: (planId: string, checked: boolean) => void;
} 