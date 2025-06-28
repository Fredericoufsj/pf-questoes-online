import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session);
        if (session?.user) {
          setUser(session.user);
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Handle URL hash parameters for email confirmation
  useEffect(() => {
    const handleHashParams = async () => {
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (accessToken && refreshToken && type === 'signup') {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Error setting session:', error);
              toast({
                title: "⚠️ Erro na ativação da nave",
                description: "Falha ao ativar sua conta. Tente fazer login.",
                variant: "destructive"
              });
            } else if (data.user) {
              toast({
                title: "🎉 Nave ativada com sucesso!",
                description: "Bem-vindo à Base Espacial Questonauta!",
              });
              // Clear the hash to clean up the URL
              window.history.replaceState(null, '', window.location.pathname);
              navigate('/');
            }
          } catch (error) {
            console.error('Session error:', error);
            toast({
              title: "⚠️ Erro na ativação",
              description: "Erro ao processar ativação da conta.",
              variant: "destructive"
            });
          }
        }
      }
    };

    handleHashParams();
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        title: "❌ Erro na comunicação",
        description: "Preencha todos os campos da nave",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/questoes-pf/auth`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "⚠️ Astronauta já cadastrado",
            description: "Esta nave já está registrada. Tente fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Falha no lançamento",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "🚀 Nave registrada com sucesso!",
          description: "Verifique seu email para ativar sua conta na base espacial.",
        });
      }
    } catch (error) {
      toast({
        title: "💥 Erro no sistema",
        description: "Falha crítica na base espacial",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "⚠️ Dados incompletos",
        description: "Insira as coordenadas de acesso (email e senha)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "🔐 Acesso negado",
            description: "Coordenadas de acesso incorretas",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Falha na conexão",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "🛸 Conexão estabelecida!",
          description: "Bem-vindo de volta, astronauta!",
        });
      }
    } catch (error) {
      toast({
        title: "💥 Erro no sistema",
        description: "Falha crítica na base espacial",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🚀 Questonauta
            </h1>
            <p className="text-cyan-200 text-lg">Portal de Acesso à Base Espacial</p>
            <p className="text-slate-400">Explorando o Universo do Conhecimento</p>
          </div>

          <Card className="shadow-xl border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-cyan-300">
                {isSignUp ? "🛸 Registrar Nova Nave" : "🔐 Acessar Base Espacial"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-cyan-300">Nome do Comandante</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Digite o nome do comandante"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-cyan-500/30 focus:border-cyan-400 bg-slate-700/50 text-white placeholder-slate-400"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cyan-300">Coordenadas de Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite suas coordenadas de email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-cyan-500/30 focus:border-cyan-400 bg-slate-700/50 text-white placeholder-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-cyan-300">Código de Acesso</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite seu código de acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-cyan-500/30 focus:border-cyan-400 bg-slate-700/50 text-white placeholder-slate-400"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                  disabled={loading}
                >
                  {loading ? "🛸 Conectando..." : (isSignUp ? "🚀 Registrar Nave" : "🔐 Acessar Base")}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {isSignUp 
                    ? "Já tem uma nave? Acesse a base espacial" 
                    : "Nova missão? Registre sua nave"
                  }
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-400/20 bg-transparent"
                >
                  🌌 Voltar ao espaço
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
