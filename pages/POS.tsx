
import React, { useState } from 'react';
import { Empresa } from '../types';
import { Search, ShoppingCart, User, Plus, Minus, Trash2 } from 'lucide-react';

const POS: React.FC<{ empresa: Empresa }> = ({ empresa }) => {
  const [cart, setCart] = useState<any[]>([]);
  
  const products = [
    { id: 1, name: 'Computador HP G8', price: 350000 },
    { id: 2, name: 'Mouse Sem Fios', price: 12500 },
    { id: 3, name: 'Teclado Mecânico', price: 45000 },
    { id: 4, name: 'Monitor 24" Dell', price: 180000 },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Products Selection */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar produto ou código de barras..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select className="bg-gray-50 border border-gray-200 text-sm px-3 py-2 rounded-lg">
            <option>Todas Categorias</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
          {products.map((product) => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col h-fit"
            >
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-300">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1">{product.name}</h4>
              <p className="text-sm font-bold text-blue-600">{product.price.toLocaleString()} Kz</p>
            </button>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4 text-blue-600" />
            <span>Carrinho</span>
          </h3>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {cart.length} Itens
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
              <ShoppingCart className="w-12 h-12" />
              <p className="text-xs font-medium">Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{(item.price * item.qty).toLocaleString()} Kz</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-900 text-white space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Subtotal</span>
            <span>{total.toLocaleString()} Kz</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>IVA (14%)</span>
            <span>{(total * 0.14).toLocaleString()} Kz</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-sm font-bold">Total a Pagar</span>
            <span className="text-xl font-bold text-emerald-400">{(total * 1.14).toLocaleString()} Kz</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              Suspensão
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
