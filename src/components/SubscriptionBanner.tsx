import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionBannerProps {
  subscription: {
    subscribed: boolean;
    subscription_tier: string;
    subscription_end: string | null;
  };
  remainingQuestions: number;
  onUpgrade: () => void;
}

export const SubscriptionBanner = ({ 
  subscription, 
  remainingQuestions, 
  onUpgrade 
}: SubscriptionBannerProps) => {
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao abrir portal do cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento.",
        variant: "destructive"
      });
    }
  };

  if (subscription.subscribed && subscription.subscription_tier === 'premium') {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-800">Plano Premium Ativo</h3>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Questões Ilimitadas
                  </Badge>
                </div>
                <p className="text-sm text-yellow-700">
                  {subscription.subscription_end && 
                    `Renovação em ${new Date(subscription.subscription_end).toLocaleDateString('pt-BR')}`
                  }
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleManageSubscription}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              Gerenciar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (remainingQuestions <= 3) {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-red-600" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-red-800">
                    {remainingQuestions === 0 ? "Limite Atingido" : "Limite Próximo"}
                  </h3>
                  <Badge variant="destructive">
                    {remainingQuestions} questões restantes hoje
                  </Badge>
                </div>
                <p className="text-sm text-red-700">
                  {remainingQuestions === 0 
                    ? "Você atingiu o limite de 10 questões gratuitas hoje. Faça upgrade para continuar!"
                    : "Você está próximo do limite diário. Considere fazer upgrade para acesso ilimitado!"
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-police-600 to-police-500 hover:from-police-700 hover:to-police-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-blue-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-blue-800">Plano Gratuito</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {remainingQuestions} questões restantes hoje
                </Badge>
              </div>
              <p className="text-sm text-blue-700">
                Aproveite o Premium por apenas R$ 6,49/mês e tenha acesso ilimitado!
              </p>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={onUpgrade}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Crown className="h-4 w-4 mr-2" />
            Conhecer Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
