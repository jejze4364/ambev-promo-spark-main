
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Store, Gift, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Promocoes = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const handleCouponClaim = () => {
    toast({
      title: "Cupom resgatado!",
      description: "O cupom foi adicionado à sua carteira",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Promoções</h1>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Histórico
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Promoção Destaque */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <Badge variant="secondary" className="mb-2">Promo Relâmpago</Badge>
                  <h2 className="text-2xl font-bold mb-2">30% OFF em Brahma!</h2>
                  <p className="text-blue-100">Válido somente hoje, aproveite!</p>
                </div>
                <Button variant="secondary" size="lg" onClick={handleCouponClaim}>
                  Resgatar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs de Categorias */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "exclusive", "cashback", "missions"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="whitespace-nowrap"
            >
              {tab === "all" && "Todas"}
              {tab === "exclusive" && "Exclusivas"}
              {tab === "cashback" && "Cashback"}
              {tab === "missions" && "Missões"}
            </Button>
          ))}
        </div>

        {/* Grade de Promoções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cartão de Promoção */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <Badge variant="secondary" className="w-fit">Brahma</Badge>
              <h3 className="text-lg font-bold mt-2">Leve 6, Pague 5</h3>
              <p className="text-sm text-gray-500">Válido até 20/04</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button variant="outline" className="w-full" onClick={handleCouponClaim}>
                Resgatar Cupom
              </Button>
            </CardContent>
          </Card>

          {/* Cartão de Missão */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <Badge variant="destructive" className="w-fit">Missão</Badge>
              <h3 className="text-lg font-bold mt-2">Desafio Stella</h3>
              <p className="text-sm text-gray-500">Compre 5 Stella Artois</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full w-3/5"></div>
              </div>
              <Button variant="outline" className="w-full">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>

          {/* Cartão de Cashback */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <Badge variant="default" className="w-fit">Cashback</Badge>
              <h3 className="text-lg font-bold mt-2">10% de volta</h3>
              <p className="text-sm text-gray-500">Em compras Budweiser</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button variant="outline" className="w-full" onClick={handleCouponClaim}>
                Ativar Cashback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Parceiros */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Nossos Parceiros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Store className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Zé Delivery</h3>
                    <p className="text-sm text-gray-500">R$15 OFF no primeiro pedido</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Gift className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Bees</h3>
                    <p className="text-sm text-gray-500">Descontos exclusivos para CNPJ</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Promocoes;
