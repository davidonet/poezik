<script>
  import '../app.css'

  let { children, data } = $props()
  let mobileMenuOpen = $state(false)
</script>

<nav class="bg-terracotta-500 shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between">
      <div class="flex items-center">
        <a href="/" class="font-title text-xl font-bold text-gray-100">
          Poezik
        </a>
        <div class="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
          <a
            href="/events"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:text-gray-900">
            Laboratoires
          </a>
        </div>
      </div>
      <div class="hidden md:flex md:items-center md:space-x-4">
        {#if data.user}
          <a
            href="/profile"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:text-gray-900">
            {data.user.name}
          </a>
          {#if data.user.isAdmin}
            <a
              href="/admin"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:text-gray-900">
              Admin
            </a>
          {/if}
          <form method="POST" action="/auth/logout" class="inline">
            <button
              type="submit"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:text-gray-900">
              Se déconnecter
            </button>
          </form>
        {:else}
          <a
            href="/auth/login"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:text-gray-900">
            Se connecter
          </a>
        {/if}
      </div>
      <div class="flex items-center md:hidden">
        <button
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
          type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          aria-expanded="false">
          <span class="sr-only">Ouvrir le menu</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d={mobileMenuOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
          </svg>
        </button>
      </div>
    </div>
    {#if mobileMenuOpen}
      <div class="md:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3">
          <a
            href="/events"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            Laboratoires
          </a>
          {#if data.user}
            <a
              href="/profile"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              {data.user.name}
            </a>
            {#if data.user.isAdmin}
              <a
                href="/admin"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                Admin
              </a>
            {/if}
            <form method="POST" action="/auth/logout" class="block">
              <button
                type="submit"
                class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                Se déconnecter
              </button>
            </form>
          {:else}
            <a
              href="/auth/login"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              Se connecter
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>

<main>
  {@render children()}
</main>
