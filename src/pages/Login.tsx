import Input from '../form/Input';

export default () => {
  return (
    <form
      className="py-8 sm:px-6 px-4 shadow-md sm:rounded-lg space-y-6"
      action="#"
      method="POST"
    >
      <Input
        label="Username"
        placeholder="A new challenger approaches..."
      />

      <button
        type="submit"
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign in
      </button>
    </form>
  );
};
