import { useRef, useEffect } from 'react';

type Object = { [key: string]: unknown };

// Hook
const useWhyChanged = (props: Object) => {
  const previousProps = useRef<Object>(props);

  const merged = {
    ...previousProps.current,
    ...props,
  };

  useEffect(() => {
    const keys = Object.keys(merged).filter(
      (key) => previousProps.current[key] !== props[key],
    );

    if (!keys.length) return;

    const changes = keys.reduce(
      (arr, key) => ({
        ...arr,
        [key]: [previousProps.current[key], props[key]],
      }),
      {},
    );

    console.table(changes);
    console.log(changes);
    previousProps.current = merged;
  });
};

export default useWhyChanged;
