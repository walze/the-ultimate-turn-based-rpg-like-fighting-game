export default (...strs: string[]) =>
  strs?.map((s) => s?.trim())?.join(' ');
