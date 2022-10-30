<script lang="ts">
  export let id = '';
  export let name = '';
  export let label = '';
  export let placeholder = '';
</script>

<div
  class="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
>
  <label
    for={id}
    class="block text-xs font-medium text-gray-900"
  >
    {label}
  </label>

  <input
    type="text"
    name={name || id}
    {id}
    class="mt-1 block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
    {placeholder}
  />
</div>
