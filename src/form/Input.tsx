type Props = {
  label: string;
  placeholder?: string;
  name?: string;
};

export default ({ label, placeholder, name }: Props) => {
  const id = label.toLowerCase().replace(' ', '-');

  return (
    <div className="relative rounded-md border border-gray-300 px-3 py-2 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
      <label
        htmlFor={id}
        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >
        {label}
      </label>

      <input
        type="text"
        name={name || id}
        id={id}
        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};
