/// <reference types="google.maps" />
import React, { useRef, useEffect } from 'react';

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelected: (address: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ onPlaceSelected, onChange, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'name'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.formatted_address) {
        onPlaceSelected(place.formatted_address);
        // Also trigger regular onChange simulation if possible, but onPlaceSelected is safer
      } else if (place && place.name) {
        onPlaceSelected(place.name);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelected]);

  return (
    <input 
      ref={inputRef} 
      onChange={(e) => {
        if (onChange) onChange(e);
        // We still call onPlaceSelected on manual type so it updates state
        onPlaceSelected(e.target.value); 
      }}
      {...props} 
    />
  );
};

export default AutocompleteInput;
