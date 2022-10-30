<script lang="ts">
  import Button from './form/Button.svelte';
  import Input from './form/Input.svelte';
  import Sheet from './Sheet.svelte';
</script>

<section
  class="p-4 container flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md"
>
  <h1
    class="mb-8 tracking-tight uppercase font-extrabold mt-6 text-center text-3xl text-gray-900"
  >
    The Ultimate Turn-Based RPG Like Fighting Game Deluxe Edition
  </h1>

  <section>
    <Input
      name="name"
      placeholder="Say your name"
      label="Username"
    />

    <Button>BEGIN!</Button>
  </section>

  <Sheet hp="10" weapon="mace" stance="nice" name="willicus" />
</section>
