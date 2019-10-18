import { useState } from 'react';

const useToggle = (initialValue = false) => {
  const [active, setActive] = useState(initialValue);

  const toggle = () => setActive(!active);

  return [active, toggle] as [boolean, () => boolean];
};

export default useToggle;
