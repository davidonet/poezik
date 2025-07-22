<script>
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  let { data } = $props()

  console.log('Page data:', data)

  let scrollContainer = $state()
  let canScrollLeft = $state(false)
  let canScrollRight = $state(false)

  function updateScrollButtons() {
    if (!scrollContainer) return
    canScrollLeft = scrollContainer.scrollLeft > 0
    canScrollRight =
      scrollContainer.scrollLeft <
      scrollContainer.scrollWidth - scrollContainer.clientWidth
  }

  function scrollCarousel(direction) {
    if (!scrollContainer) return
    const cardWidth =
      scrollContainer.querySelector('.event-card')?.offsetWidth || 300
    const scrollAmount = cardWidth + 24 // card width + gap

    scrollContainer.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  $effect(() => {
    updateScrollButtons()
    scrollContainer?.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      scrollContainer?.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  })
</script>

<div class="min-h-screen">
  <div class="mx-auto max-w-7xl px-6 py-12">
    <div class="mb-12 text-center">
      <h1 class="text-terracotta-900 mb-4 text-8xl font-bold">Poezik</h1>
      <p class="mx-auto max-w-2xl text-xl text-gray-700">
        Un espace de Laboratoiree créatif autour de <br />
        l'ECRITURE, de la VOIX et du MOUVEMENT.
      </p>
    </div>

    {#if data.user}
      <div class="mb-12 text-center">
        <p class="text-gray-700">
          Bon retour, <span class="font-semibold">{data.user.name}</span>
           !
        </p>
        <div class="mt-4 space-x-4">
          <a
            href="/profile"
            class="text-terracotta-600 hover:text-terracotta-800">
            Modifier le profil
          </a>
          {#if data.user.isAdmin}
            <a
              href="/admin"
              class="text-terracotta-600 hover:text-terracotta-800">
              Panneau d'administration
            </a>
          {/if}
        </div>
      </div>
    {:else}
      <div class="mb-12 text-center">
        <a
          href="/auth/login"
          class="bg-terracotta-600 hover:bg-terracotta-700 inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm">
          Se connecter pour s'inscrire aux Laboratoires
        </a>
      </div>
    {/if}

    <div class="relative">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">
        Laboratoires à venir
      </h2>

      {#if data.events.length === 0}
        <p class="text-gray-500">Aucun Laboratoire à venir prévu.</p>
      {:else}
        <div class="relative">
          {#if canScrollLeft}
            <button
              onclick={() => scrollCarousel('left')}
              aria-label="Défiler vers la gauche"
              class="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur hover:bg-white">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          {/if}

          {#if canScrollRight}
            <button
              onclick={() => scrollCarousel('right')}
              aria-label="Défiler vers la droite"
              class="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur hover:bg-white">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg>
            </button>
          {/if}

          <div
            bind:this={scrollContainer}
            class="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
            style="scroll-snap-type: x mandatory">
            {#each data.events as event, i}
              <div
                class="event-card bg-cream-400 w-80 flex-none rounded-lg p-6 shadow-lg {i ===
                0
                  ? 'border-terracotta-600 border-2 '
                  : 'border border-gray-200'}"
                style="scroll-snap-align: start">
                <p class="mb-4 inline-block text-lg text-gray-500">
                  {format(new Date(event.date), 'PPP', { locale: fr })}
                  {#if i === 0}
                    <span
                      class="bg-terracotta-100 text-terracotta-600 mb-4 rounded-full px-3 py-1 text-xs font-semibold">
                      ★
                    </span>
                  {/if}
                </p>
                <h3 class="text-terracotta-900 mb-2 text-2xl font-semibold">
                  {event.title}
                </h3>
                <p class="mb-4 line-clamp-3 text-gray-600">
                  {event.description}
                </p>

                {#if event.teachers.length > 0}
                  <div class="text-terracotta-700 mb-2 text-sm">
                    <span class="font-medium">Animé par :</span>
                    {#each event.teachers as teacher, j}
                      <span>
                        {teacher}{j < event.teachers.length - 1 ? ', ' : ''}
                      </span>
                    {/each}
                  </div>
                {/if}

                <div class="mb-4 space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Participants :</span>
                    <span
                      class="font-medium {event.participants.length >= 14
                        ? 'text-orange-600'
                        : ''}">
                      {event.participants.length}/14
                      {#if event.waitingList.length > 0}
                        <span class="text-xs text-orange-600">
                          (+{event.waitingList.length})
                        </span>
                      {/if}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <a
                    href="/events/{event._id}"
                    class="border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50 flex-1 rounded-md border px-4 py-2 text-center transition-colors">
                    Voir les détails
                  </a>
                  {#if data.user}
                    {@const userIsRegistered =
                      event.teachers.includes(data.user._id) ||
                      event.participants.includes(data.user._id) ||
                      event.waitingList.includes(data.user._id)}
                    {#if !userIsRegistered}
                      <form
                        method="POST"
                        action="/events/{event._id}?/registerParticipant"
                        class="flex-1">
                        <button
                          type="submit"
                          class="bg-terracotta-600 hover:bg-terracotta-700 w-full rounded-md px-4 py-2 text-white transition-colors">
                          {event.participants.length >= 14
                            ? "Rejoindre la liste d'attente"
                            : "S'inscrire"}
                        </button>
                      </form>
                    {:else}
                      <span
                        class="flex-1 rounded-md bg-green-100 px-4 py-2 text-center text-green-800">
                        Inscrit
                      </span>
                    {/if}
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="mt-12 text-center">
      <a
        href="/events"
        class="text-terracotta-600 hover:text-terracotta-800 font-medium">
        Voir tous les Laboratoires →
      </a>
    </div>
  </div>
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
