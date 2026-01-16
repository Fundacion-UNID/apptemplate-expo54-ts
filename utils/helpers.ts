// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export const authorizeAccess = (input, setList, clearInput) => {
  if (input) {
    setList((prev) => [...prev, input]);
    clearInput(''); // Reset input after adding
  }
};
