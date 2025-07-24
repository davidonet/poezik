<script>
  import { enhance } from '$app/forms'
  import {
    downloadAppleCalendarFile,
    generateGoogleCalendarUrl,
  } from '$lib/calendar.js'
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
  <div class="bg-cream-500 rounded-lg p-8 shadow-lg">
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="font-title text-terracotta-900 mb-2 text-3xl font-bold">
          {data.event.title}
        </h1>
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
                      'Êtes-vous sûr de vouloir supprimer cet Laboratoire ?'
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

    <p class="mb-4 whitespace-pre-wrap text-gray-700">
      {data.event.description}
    </p>

    <div class="grid gap-8 md:grid-cols-2">
      <div>
        <h2 class="text-terracotta-800 mb-4 text-xl font-semibold">
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
        <h2 class="text-terracotta-800 mb-4 text-xl font-semibold">
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
    <!-- Calendar links -->
    <div class="bg-cream-100 mt-4 rounded-lg p-6">
      <h3 class="mb-4 text-lg font-medium text-gray-900">
        Ajouter à votre calendrier
      </h3>
      <div class="flex flex-wrap gap-3">
        <a
          href={generateGoogleCalendarUrl(data.event)}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4" />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853" />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05" />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335" />
          </svg>
          Google Calendar
        </a>
        <button
          onclick={() => downloadAppleCalendarFile(data.event)}
          class="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
          </svg>
          Apple Calendar / Outlook
        </button>
      </div>
      <p class="mt-3 text-sm text-gray-600">
        Cliquez sur Google Calendar pour l'ajouter directement, ou téléchargez
        le fichier .ics pour Apple Calendar, Outlook, ou d'autres applications.
      </p>
    </div>
  </div>

  <div class="mt-4">
    <a href="/events" class="text-terracotta-600 hover:text-terracotta-800">
      ← Retour aux Laboratoires
    </a>
  </div>
</div>
