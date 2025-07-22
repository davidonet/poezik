<script>
  import { enhance } from '$app/forms'

  let { data, form } = $props()

  // Convert date to datetime-local format
  function formatDateForInput(date) {
    const d = new Date(date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }
</script>

<div class="mx-auto max-w-2xl p-6">
  <h1 class="mb-8 text-3xl font-bold">Modifier l'événement</h1>

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
        value={form?.title ?? data.event.title}
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
        value={form?.description ?? data.event.description}
        class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none">
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
        value={form?.date ?? formatDateForInput(data.event.date)}
        class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none" />
    </div>

    {#if form?.error}
      <div class="bg--terracotta--50 rounded-md p-4">
        <p class="text--terracotta--800 text-sm">{form.error}</p>
      </div>
    {/if}

    {#if form?.success}
      <div class="rounded-md bg-green-50 p-4">
        <p class="text-sm text-green-800">Événement mis à jour avec succès !</p>
      </div>
    {/if}

    <div class="flex gap-4">
      <button
        type="submit"
        class="bg-terracotta-600 hover:bg-terracotta-700 focus:ring-terracotta-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none">
        Mettre à jour l'événement
      </button>
      <a
        href="/events/{data.event._id}"
        class="focus:ring-terracotta-500 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none">
        Annuler
      </a>
    </div>
  </form>
</div>
