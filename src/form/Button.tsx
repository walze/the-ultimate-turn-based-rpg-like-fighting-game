import {ButtonHTMLAttributes} from 'react';

type P = Props & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({children, ...props}: P) => (
  <button
    {...props}
    className={css(
      props.className || '',
      `flex justify-center rounded-md
      border border-transparent bg-gray-900
      py-2 px-4 text-sm font-medium text-white
      shadow-sm hover:bg-gray-700 focus:outline-none
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`,
    )}
  >
    {children}
  </button>
);

export default Button;
