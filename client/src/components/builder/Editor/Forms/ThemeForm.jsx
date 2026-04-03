import React from 'react';
import { useResume } from '../../../../context/ResumeContext';

const ThemeForm = () => {
  const { theme, setTheme } = useResume();

  const colors = [
    { name: 'Rust', hex: '#A4523D' },
    { name: 'Zinc', hex: '#18181A' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Violet', hex: '#7C3AED' },
  ];

  const fonts = ['Inter', 'Outfit', 'Roboto', 'Playfair Display'];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h3 className="block text-sm font-semibold text-gray-700 uppercase mb-3">Accent Color</h3>
        <div className="flex flex-wrap gap-4">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setTheme({ ...theme, accentColor: c.hex })}
              className={`w-12 h-12 rounded-full border-4 transition-transform ${theme.accentColor === c.hex ? 'border-gray-200 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="block text-sm font-semibold text-gray-700 uppercase mb-3">Typography Match</h3>
        <div className="grid grid-cols-2 gap-3">
          {fonts.map((f) => (
            <button
               key={f}
               onClick={() => setTheme({ ...theme, fontFamily: f })}
               className={`p-4 border-2 rounded-xl text-left transition-colors ${theme.fontFamily === f ? 'border-brand-rust bg-orange-50 text-brand-rust' : 'border-gray-200 hover:border-gray-300'}`}
            >
               <span style={{ fontFamily: f }} className="text-xl font-bold">Aa</span>
               <div className="text-xs text-gray-500 mt-1 font-sans">{f}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeForm;
