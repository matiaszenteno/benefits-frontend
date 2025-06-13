import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 