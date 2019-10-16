import { useState } from 'react';

const useToggle = (initialValue = false) => {
  const [active, setActive] = useState(initialValue);

  const toggle = () => setActive(!active);

  return {
    active,
    setActive,
    toggle,
  };
};

export default useToggle;
