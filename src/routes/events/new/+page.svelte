<script>
  import { enhance } from '$app/forms'

  let { form } = $props()
</script>

<div class="mx-auto max-w-2xl p-6">
  <h1 class="mb-8 text-3xl font-bold">Créer un nouvel événement</h1>

  <form method="POST" use:enhance class="space-y-6">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">
        Titre
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        value={form?.title ?? ''}
        class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none" />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows="4"
        required
        class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none">
        {form?.description ?? ''}
      </textarea>
    </div>

    <div>
      <label for="date" class="block text-sm font-medium text-gray-700">
        Date
      </label>
      <input
        id="date"
        name="date"
        type="datetime-local"
        required
        value={form?.date ?? ''}
        class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none" />
    </div>

    {#if form?.error}
      <div class="bg--terracotta--50 rounded-md p-4">
        <p class="text--terracotta--800 text-sm">{form.error}</p>
      </div>
    {/if}

    <div class="flex gap-4">
      <button
        type="submit"
        class="bg-terracotta-600 hover:bg-terracotta-700 focus:ring-terracotta-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none">
        Créer l'événement
      </button>
      <a
        href="/events"
        class="focus:ring-terracotta-500 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none">
        Annuler
      </a>
    </div>
  </form>
</div>
