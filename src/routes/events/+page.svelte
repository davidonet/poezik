<script>
  import {
    downloadAppleCalendarFile,
    generateGoogleCalendarUrl,
  } from '$lib/calendar.js'
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  let { data } = $props()
</script>

<div class="mx-auto max-w-6xl p-6">
  <div class="mb-8 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Laboratoires à venir</h1>
    <div class="flex gap-3">
      <a
        href="/calendar"
        class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        title="S'abonner au calendrier global">
        📅 S'abonner au calendrier
      </a>
      {#if data.user?.isAdmin}
        <a
          href="/events/new"
          class="bg-terracotta-600 hover:bg-terracotta-700 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white">
          Créer un Laboratoire
        </a>
      {/if}
    </div>
  </div>

  {#if data.events.length === 0}
    <p class="text-gray-500">Aucun Laboratoire à venir prévu.</p>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.events as event}
        <div
          class="border-terracotta-700 bg-cream-400 rounded-lg border-2 p-6 shadow-md">
          <h2 class="font-title text-terracotta-900 mb-2 text-xl font-semibold">
            {event.title}
          </h2>
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

          <div class="mt-4 flex items-center justify-between">
            <a
              href="/events/{event._id}"
              class="text-terracotta-600 hover:text-terracotta-800 font-medium">
              Voir les détails →
            </a>
            <div class="flex gap-2">
              <a
                href={generateGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-700"
                aria-label="Ajouter à Google Calendar"
                title="Ajouter à Google Calendar">
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
              </a>
              <button
                onclick={() => downloadAppleCalendarFile(event)}
                class="text-gray-600 hover:text-gray-700"
                aria-label="Télécharger pour Apple Calendar"
                title="Télécharger pour Apple Calendar">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
