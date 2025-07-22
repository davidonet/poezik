<script>
  import { enhance } from '$app/forms'

  let { data, form } = $props()
</script>

<div class="mx-auto max-w-2xl p-6">
  <h1 class="mb-8 text-3xl font-bold">Profil</h1>

  <form method="POST" use:enhance class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Nom
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={form?.name ?? data.user.name}
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none" />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        E-mail
      </label>
      <input
        id="email"
        type="email"
        value={data.user.email}
        disabled
        class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm" />
      <p class="mt-1 text-sm text-gray-500">
        L'e-mail ne peut pas être modifié
      </p>
    </div>

    <div class="invisible">
      <label for="photo" class="block text-sm font-medium text-gray-700">
        URL de la photo
      </label>
      <input
        id="photo"
        name="photo"
        type="url"
        value={form?.photo ?? data.user.photo ?? ''}
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
        placeholder="https://exemple.com/photo.jpg" />
    </div>

    {#if form?.error}
      <div class="bg-terracotta-50 rounded-md p-4">
        <p class="text-terracotta-800 text-sm">{form.error}</p>
      </div>
    {/if}

    {#if form?.success}
      <div class="rounded-md bg-green-50 p-4">
        <p class="text-sm text-green-800">Profil mis à jour avec succès !</p>
      </div>
    {/if}

    <button
      type="submit"
      class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
      Mettre à jour le profil
    </button>
  </form>

  <form
    method="POST"
    action="/auth/logout"
    use:enhance
    class="mt-8 border-t pt-8">
    <button
      type="submit"
      class="text-terracotta-600 hover:text-terracotta-800 font-medium">
      Se déconnecter
    </button>
  </form>
</div>
