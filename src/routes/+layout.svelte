<script>
  import '../app.css'

  let { children, data } = $props()
</script>

<nav class="bg-white shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between">
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold text-gray-900">Poezik</a>
        <div class="ml-10 flex items-baseline space-x-4">
          <a
            href="/events"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Événements
          </a>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        {#if data.user}
          <a
            href="/profile"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            {data.user.name}
          </a>
          {#if data.user.isAdmin}
            <a
              href="/admin"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Admin
            </a>
          {/if}
          <form method="POST" action="/auth/logout" class="inline">
            <button
              type="submit"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Se déconnecter
            </button>
          </form>
        {:else}
          <a
            href="/auth/login"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Se connecter
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>

<main>
  {@render children()}
</main>
