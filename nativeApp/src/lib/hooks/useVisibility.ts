import { useState } from 'react';

const useVisibility = (initialValue: boolean) => {
  const [isVisible, setIsVisible] = useState(initialValue);

  const flipVisibility = () => setIsVisible(!isVisible);

  return {
    isVisible,
    setIsVisible,
    flipVisibility,
  };
};

export default useVisibility;
