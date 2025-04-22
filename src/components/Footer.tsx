
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-ambev-blue text-lg mb-3">Ambev</h3>
            <p className="text-gray-600 text-sm">
              Somos a maior cervejaria do Brasil e parte da AB InBev, maior grupo cervejeiro do mundo.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-ambev-blue text-lg mb-3">Links Importantes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 text-sm hover:text-ambev-blue transition-colors">Sobre a Promoção</a></li>
              <li><a href="#" className="text-gray-600 text-sm hover:text-ambev-blue transition-colors">Regulamento</a></li>
              <li><a href="#" className="text-gray-600 text-sm hover:text-ambev-blue transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-600 text-sm hover:text-ambev-blue transition-colors">Fale Conosco</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-ambev-blue text-lg mb-3">Nossas Redes</h3>
            <div className="flex space-x-4 items-center">
              <a href="#" className="hover:scale-110 transition-transform">
                <Facebook className="h-5 w-5 text-ambev-blue"/>
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Instagram className="h-5 w-5 text-ambev-blue"/>
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Twitter className="h-5 w-5 text-ambev-blue"/>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-6 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ambev S.A. Todos os direitos reservados.</p>
          <p className="mt-1">Beba com moderação. Não compartilhe este conteúdo com menores de idade.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
