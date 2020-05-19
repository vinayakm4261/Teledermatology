import { useState, useCallback } from 'react';

const useForceUpdate = () => {
  const [, dispatch] = useState(Object.create(null));

  const change = useCallback(() => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return change;
};

export default useForceUpdate;
