<script>
  import { enhance } from '$app/forms'
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  let { data } = $props()

  let userIsTeacher = $derived(data.event.teachers.includes(data.user?._id))
  let userIsParticipant = $derived(
    data.event.participants.includes(data.user?._id)
  )
  let userIsWaitlisted = $derived(
    data.event.waitingList.includes(data.user?._id)
  )
  let userIsRegistered = $derived(
    userIsTeacher || userIsParticipant || userIsWaitlisted
  )
  let canEdit = $derived(data.user?.isAdmin || userIsTeacher)
</script>

<div class="mx-auto max-w-4xl p-6">
  <div class="rounded-lg bg-white p-8 shadow-lg">
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="mb-2 text-3xl font-bold">{data.event.title}</h1>
        <p class="text-gray-600">
          {format(new Date(data.event.date), 'PPPp', { locale: fr })}
        </p>
      </div>
      {#if canEdit}
        <div class="flex gap-2">
          <a
            href="/events/{data.event._id}/edit"
            class="text-terracotta-600 hover:text-terracotta-800 px-4 py-2 text-sm font-medium">
            Modifier
          </a>
          {#if data.user?.isAdmin}
            <form method="POST" action="?/delete" use:enhance>
              <button
                type="submit"
                class="text--terracotta--600 hover:text--terracotta--800 px-4 py-2 text-sm font-medium"
                onclick={(e) => {
                  if (
                    !confirm(
                      'Êtes-vous sûr de vouloir supprimer cet événement ?'
                    )
                  ) {
                    e.preventDefault()
                  }
                }}>
                Supprimer
              </button>
            </form>
          {/if}
        </div>
      {/if}
    </div>

    <p class="mb-8 whitespace-pre-wrap text-gray-700">
      {data.event.description}
    </p>

    <div class="grid gap-8 md:grid-cols-2">
      <div>
        <h2 class="mb-4 text-xl font-semibold">
          Animateurs ({data.event.teachers.length}/2)
        </h2>
        {#if data.teachers.length === 0}
          <p class="mb-4 text-gray-500">
            Aucun animateur inscrit pour le moment
          </p>
        {:else}
          <ul class="mb-4 space-y-2">
            {#each data.teachers as teacher}
              <li class="flex items-center gap-2">
                {#if teacher.photo}
                  <img
                    src={teacher.photo}
                    alt=""
                    class="h-8 w-8 rounded-full" />
                {/if}
                <span>{teacher.name}</span>
              </li>
            {/each}
          </ul>
        {/if}

        {#if data.user && !userIsRegistered && data.event.teachers.length < 2}
          <form method="POST" action="?/registerTeacher" use:enhance>
            <button
              type="submit"
              class="text-terracotta-600 hover:text-terracotta-800 text-sm font-medium">
              S'inscrire comme animateur
            </button>
          </form>
        {/if}
      </div>

      <div>
        <h2 class="mb-4 text-xl font-semibold">
          Participants ({data.event.participants.length}/14)
        </h2>
        {#if data.participants.length === 0}
          <p class="mb-4 text-gray-500">
            Aucun participant inscrit pour le moment
          </p>
        {:else}
          <ul class="mb-4 space-y-2">
            {#each data.participants as participant}
              <li class="flex items-center gap-2">
                {#if participant.photo}
                  <img
                    src={participant.photo}
                    alt=""
                    class="h-8 w-8 rounded-full" />
                {/if}
                <span>{participant.name}</span>
              </li>
            {/each}
          </ul>
        {/if}

        {#if data.event.waitingList.length > 0}
          <p class="mb-4 text-sm text-orange-600">
            +{data.event.waitingList.length} sur la liste d'attente
          </p>
        {/if}

        {#if data.user && !userIsRegistered}
          <form method="POST" action="?/registerParticipant" use:enhance>
            <button
              type="submit"
              class="text-terracotta-600 hover:text-terracotta-800 text-sm font-medium">
              {data.event.participants.length >= 14
                ? "Rejoindre la liste d'attente"
                : "S'inscrire comme participant"}
            </button>
          </form>
        {/if}
      </div>
    </div>

    {#if userIsRegistered}
      <div class="mt-8 border-t pt-8">
        <p class="mb-4 text-sm text-gray-600">
          Vous êtes inscrit en tant que {userIsTeacher
            ? 'animateur'
            : userIsWaitlisted
              ? "participant en liste d'attente"
              : 'participant'}
        </p>
        <form method="POST" action="?/unregister" use:enhance>
          <button
            type="submit"
            class="text--terracotta--600 hover:text--terracotta--800 text-sm font-medium">
            Annuler l'inscription
          </button>
        </form>
      </div>
    {/if}
  </div>

  <div class="mt-4">
    <a href="/events" class="text-terracotta-600 hover:text-terracotta-800">
      ← Retour aux événements
    </a>
  </div>
</div>
