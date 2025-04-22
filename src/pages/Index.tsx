
import PromoForm from "@/components/PromoForm";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Award, ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-ambev-blue/5 to-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-ambev-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-ambev-blue/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8 animate-fade-in">
              <div className="inline-block bg-ambev-blue text-white px-4 py-1 rounded-full text-sm mb-2">
                Promoção Exclusiva
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-ambev-blue mb-3">
                Promoção Ambev
              </h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Preencha o formulário abaixo e concorra a prêmios incríveis das marcas Ambev que você ama
              </p>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardHeader className="pb-2">
                  <Gift className="h-8 w-8 text-ambev-yellow mb-2" />
                  <CardTitle className="text-lg">Prêmios Exclusivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Ganhe produtos e experiências exclusivas com as principais marcas Ambev.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardHeader className="pb-2">
                  <Award className="h-8 w-8 text-ambev-yellow mb-2" />
                  <CardTitle className="text-lg">Fácil Participação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Processo simples e rápido. Apenas preencha seus dados e estará concorrendo.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardHeader className="pb-2">
                  <ShieldCheck className="h-8 w-8 text-ambev-yellow mb-2" />
                  <CardTitle className="text-lg">100% Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Seus dados estão protegidos e serão usados apenas para esta promoção.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-ambev-yellow/10 rounded-bl-full"></div>
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-ambev-blue mb-2">
                  Cadastre-se na Promoção
                </h2>
                <p className="text-gray-600">
                  Preencha o formulário abaixo com seus dados
                </p>
              </div>
              <PromoForm />
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Promoção válida para maiores de 18 anos. Consulte regulamento.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-ambev-blue mb-4">Nossas Principais Marcas</h2>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                <div className="text-center">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-ambev-blue">Brahma</span>
                  </div>
                  <p className="text-sm text-gray-600">Cerveja</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-ambev-blue">Skol</span>
                  </div>
                  <p className="text-sm text-gray-600">Cerveja</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-ambev-blue">Antarctica</span>
                  </div>
                  <p className="text-sm text-gray-600">Cerveja</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-ambev-blue">Guaraná</span>
                  </div>
                  <p className="text-sm text-gray-600">Refrigerante</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
