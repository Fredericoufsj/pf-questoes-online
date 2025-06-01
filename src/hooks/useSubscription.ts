
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
}

interface DailyUsage {
  questions_answered: number;
  date: string;
}

export const useSubscription = (user: User | null) => {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null
  });
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    questions_answered: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      if (data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      toast({
        title: "Erro ao verificar assinatura",
        description: "Não foi possível verificar o status da sua assinatura.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyUsage = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_usage')
        .select('questions_answered, date')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar uso diário:', error);
        return;
      }

      if (data) {
        setDailyUsage(data);
      } else {
        setDailyUsage({ questions_answered: 0, date: today });
      }
    } catch (error) {
      console.error('Erro ao buscar uso diário:', error);
    }
  };

  const canAccessQuestion = () => {
    if (!user) return false;
    if (subscription.subscribed && subscription.subscription_tier === 'premium') return true;
    return dailyUsage.questions_answered < 10;
  };

  const getRemainingQuestions = () => {
    if (subscription.subscribed && subscription.subscription_tier === 'premium') return -1; // Ilimitado
    return Math.max(0, 10 - dailyUsage.questions_answered);
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
      fetchDailyUsage();
    }
  }, [user]);

  return {
    subscription,
    dailyUsage,
    loading,
    checkSubscription,
    fetchDailyUsage,
    canAccessQuestion,
    getRemainingQuestions
  };
};
