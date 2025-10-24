import { useState } from 'react';

export default function AppHeader() {
  const [logoVisible, setLogoVisible] = useState(true);

  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in">
      {logoVisible ? (
        <img
          src="/escudo.png"
          alt="Escudo San Roque"
          width="80"
          height="80"
          className="mb-2"
          onError={() => setLogoVisible(false)}
          data-testid="img-logo"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-2 text-2xl font-bold"
          data-testid="logo-fallback"
        >
          SR
        </div>
      )}
      <h1 className="text-3xl font-extrabold text-foreground" data-testid="text-app-title">
        Filtro ATS
      </h1>
    </div>
  );
}
