<script>
  import { enhance } from '$app/forms'

  let { form } = $props()
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-md space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Se connecter à Poezik
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Nous vous enverrons un lien magique pour vous connecter
      </p>
    </div>

    <form method="POST" use:enhance class="mt-8 space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="focus:border-terracotta-500 focus:ring-terracotta-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
          placeholder="vous@exemple.com" />
      </div>

      {#if form?.error}
        <div class="bg--terracotta--50 rounded-md p-4">
          <p class="text--terracotta--800 text-sm">{form.error}</p>
        </div>
      {/if}

      {#if form?.success}
        <div class="rounded-md bg-green-50 p-4">
          <p class="text-sm text-green-800">
            Vérifiez votre e-mail pour le lien magique !
          </p>
        </div>
      {/if}

      <button
        type="submit"
        class="bg-terracotta-600 hover:bg-terracotta-700 focus:ring-terracotta-500 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none">
        Envoyer le lien magique
      </button>
    </form>
  </div>
</div>
