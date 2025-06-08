import { useState, useCallback } from 'react';
import type { PlanSummary } from '../types/emailTypes';

interface UsePlanSelectionProps {
  availablePlans: {
    dietPlans: PlanSummary[];
    workoutPlans: PlanSummary[];
  };
}

export const usePlanSelection = ({ availablePlans }: UsePlanSelectionProps) => {
  const [selectedDietPlans, setSelectedDietPlans] = useState<string[]>([]);
  const [selectedWorkoutPlans, setSelectedWorkoutPlans] = useState<string[]>([]);

  const handleDietPlanChange = useCallback((planId: string, checked: boolean) => {
    if (checked) {
      setSelectedDietPlans(prev => [...prev, planId]);
    } else {
      setSelectedDietPlans(prev => prev.filter(id => id !== planId));
    }
  }, []);

  const handleWorkoutPlanChange = useCallback((planId: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkoutPlans(prev => [...prev, planId]);
    } else {
      setSelectedWorkoutPlans(prev => prev.filter(id => id !== planId));
    }
  }, []);

  const initializeWithActivePlans = useCallback(() => {
    const firstActiveDietPlan = availablePlans.dietPlans.find(p => p.status === 'ACTIVE');
    const firstActiveWorkoutPlan = availablePlans.workoutPlans.find(p => p.status === 'ACTIVE');
    
    setSelectedDietPlans(prev => {
      if (firstActiveDietPlan && prev.length === 0) {
        return [firstActiveDietPlan.id];
      }
      return prev;
    });
    
    setSelectedWorkoutPlans(prev => {
      if (firstActiveWorkoutPlan && prev.length === 0) {
        return [firstActiveWorkoutPlan.id];
      }
      return prev;
    });
  }, [availablePlans.dietPlans, availablePlans.workoutPlans]);

  const resetSelection = useCallback(() => {
    setSelectedDietPlans([]);
    setSelectedWorkoutPlans([]);
  }, []);

  const hasSelectedPlans = selectedDietPlans.length > 0 || selectedWorkoutPlans.length > 0;

  return {
    selectedDietPlans,
    selectedWorkoutPlans,
    handleDietPlanChange,
    handleWorkoutPlanChange,
    initializeWithActivePlans,
    resetSelection,
    hasSelectedPlans
  };
}; 