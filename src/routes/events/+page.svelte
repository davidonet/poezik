<script>
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  let { data } = $props()
</script>

<div class="mx-auto max-w-6xl p-6">
  <div class="mb-8 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Laboratoires à venir</h1>
    {#if data.user?.isAdmin}
      <a
        href="/events/new"
        class="bg-terracotta-600 hover:bg-terracotta-700 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white">
        Créer un Laboratoire
      </a>
    {/if}
  </div>

  {#if data.events.length === 0}
    <p class="text-gray-500">Aucun Laboratoire à venir prévu.</p>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.events as event}
        <div
          class="border-terracotta-700 bg-cream-400 rounded-lg border-2 p-6 shadow-md">
          <h2 class="mb-2 text-xl font-semibold">{event.title}</h2>
          <p class="mb-4 text-gray-600">{event.description}</p>
          <p class="mb-4 text-sm text-gray-500">
            {format(new Date(event.date), 'PPP', { locale: fr })}
          </p>

          <div class="space-y-2 text-sm">
            <div>
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
            </div>
            <div>
              <span class="font-medium">Participants :</span>
              {event.participants.length}/{14}
              {#if event.waitingList.length > 0}
                <span class="ml-2 text-orange-600">
                  (+{event.waitingList.length} en attente)
                </span>
              {/if}
            </div>
          </div>

          <a
            href="/events/{event._id}"
            class="text-terracotta-600 hover:text-terracotta-800 mt-4 inline-block font-medium">
            Voir les détails →
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>
