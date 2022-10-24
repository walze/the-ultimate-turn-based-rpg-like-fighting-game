type Props = {
  label: string;
  placeholder?: string;
  name?: string;
};

export default ({ label, placeholder, name }: Props) => {
  const id = label.toLowerCase().replace(' ', '-');

  return (
    <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-900"
      >
        {label}
      </label>

      <input
        type="text"
        name={name || id}
        id={id}
        className="mt-1 block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};
