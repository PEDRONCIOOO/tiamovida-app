// Loading component for love letter page
export default function Loading() {

    // Este é um componente de carregamento que será exibido enquanto a página da carta de amor está carregando.
    return (
      <div className="max-w-md mx-auto bg-slate-800 rounded-lg overflow-hidden shadow-xl p-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-64 bg-slate-700 rounded-lg mb-6"></div>
        <div className="bg-slate-700 p-4 rounded-lg mb-6">
          <div className="h-4 bg-slate-600 rounded mb-3"></div>
          <div className="h-4 bg-slate-600 rounded mb-3"></div>
          <div className="h-4 bg-slate-600 rounded"></div>
        </div>
        <div className="h-12 bg-slate-700 rounded-lg mb-6"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }