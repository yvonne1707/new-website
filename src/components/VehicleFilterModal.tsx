import React, { useState } from 'react';
import { POPULAR_VEHICLES } from '../data/initialData';
import { VehicleSelection } from '../types';
import { X, Car, Check, RefreshCcw } from 'lucide-react';

interface VehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleSelection | null;
  onSelectVehicle: (vehicle: VehicleSelection | null) => void;
}

export const VehicleFilterModal: React.FC<VehicleFilterModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const [activeMake, setActiveMake] = useState<string>(
    selectedVehicle ? selectedVehicle.make : POPULAR_VEHICLES[0].make
  );

  if (!isOpen) return null;

  const currentVehicleGroup = POPULAR_VEHICLES.find((v) => v.make === activeMake) || POPULAR_VEHICLES[0];

  const handleSelectModel = (model: string) => {
    onSelectVehicle({
      make: activeMake,
      model: model,
    });
    onClose();
  };

  const handleClear = () => {
    onSelectVehicle(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        id="vehicle-filter-modal"
        className="relative bg-[#111111] text-white w-full max-w-2xl border border-zinc-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <span className="text-orange-500 font-black uppercase text-xs tracking-widest block">
              Vehicle Match Tool
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-white mt-1">
              Select Your Car Make &amp; Model
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-900 hover:bg-orange-500 hover:text-black text-zinc-400 flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 my-4 uppercase tracking-wider font-bold">
          Filter our catalog to show only parts guaranteed to fit your vehicle:
        </p>

        {/* Step 1: Makes Horizontal Chips */}
        <div className="mb-6">
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
            1. Select Manufacturer:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {POPULAR_VEHICLES.map((item) => (
              <button
                key={item.make}
                onClick={() => setActiveMake(item.make)}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeMake === item.make
                    ? 'bg-orange-500 text-black shadow-md'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {item.make}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Models Grid */}
        <div className="mb-6">
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
            2. Choose {activeMake} Model:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {currentVehicleGroup.models.map((model) => {
              const isSelected =
                selectedVehicle?.make === activeMake && selectedVehicle?.model === model;

              return (
                <button
                  key={model}
                  onClick={() => handleSelectModel(model)}
                  className={`p-3 text-left text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-black border-orange-500'
                      : 'bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="truncate">{model}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            onClick={handleClear}
            className="text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Clear Filter (Show All Spares)</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-orange-500 text-black font-black uppercase tracking-tighter text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
