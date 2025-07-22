<script>
  import { format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  let { data } = $props()
</script>

<div class="mx-auto max-w-7xl p-6">
  <h1 class="mb-8 text-3xl font-bold">Panneau d'administration</h1>

  <div class="grid gap-8 lg:grid-cols-2">
    <div>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Utilisateurs</h2>
        <p class="text-gray-600">Total : {data.users.length}</p>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  E-mail
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Admin
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {#each data.users as user}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      {#if user.photo}
                        <img
                          src={user.photo}
                          alt=""
                          class="mr-3 h-8 w-8 rounded-full" />
                      {/if}
                      <div class="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {user.isAdmin
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'}">
                      {user.isAdmin ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <form method="POST" action="?/toggleAdmin" class="inline">
                      <input type="hidden" name="userId" value={user._id} />
                      <input
                        type="hidden"
                        name="isAdmin"
                        value={!user.isAdmin} />
                      <button
                        type="submit"
                        class="text-terracotta-600 hover:text-terracotta-900">
                        {user.isAdmin
                          ? 'Retirer les droits admin'
                          : 'Rendre admin'}
                      </button>
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-semibold">Laboratoires</h2>
        <div class="flex items-center gap-4">
          <p class="text-gray-600">Total: {data.events.length}</p>
          <a
            href="/events/new"
            class="bg-terracotta-600 hover:bg-terracotta-700 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white">
            Nouvel Laboratoire
          </a>
        </div>
      </div>

      <div class="space-y-4">
        {#each data.events as event}
          <div class="rounded-lg bg-white p-6 shadow">
            <div class="mb-2 flex items-start justify-between">
              <h3 class="text-lg font-semibold">{event.title}</h3>
              <div class="flex items-center gap-2">
                <a
                  href="/events/{event._id}/edit"
                  class="text-terracotta-600 hover:text-terracotta-800 text-sm">
                  Modifier
                </a>
                <form
                  method="POST"
                  action="/events/{event._id}?/delete"
                  class="inline">
                  <button
                    type="submit"
                    class="text--terracotta--600 hover:text--terracotta--800 text-sm"
                    onclick={(e) => {
                      if (!confirm('Supprimer cet Laboratoire ?'))
                        e.preventDefault()
                    }}>
                    Supprimer
                  </button>
                </form>
              </div>
            </div>

            <p class="mb-2 text-sm text-gray-600">
              {format(new Date(event.date), 'PPP', { locale: fr })}
            </p>

            <div class="flex items-center gap-4 text-sm">
              <span class="text-gray-500">
                Animateurs : <span class="font-medium">
                  {event.teachers.length}/2
                </span>
              </span>
              <span class="text-gray-500">
                Participants : <span
                  class="font-medium {event.participants.length >= 14
                    ? 'text-orange-600'
                    : ''}">
                  {event.participants.length}/14
                </span>
              </span>
              {#if event.waitingList.length > 0}
                <span class="text-sm text-orange-600">
                  +{event.waitingList.length} en attente
                </span>
              {/if}
            </div>
          </div>
        {/each}

        {#if data.events.length === 0}
          <p class="text-gray-500">Aucun Laboratoire créé pour le moment.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
