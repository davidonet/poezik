<script>
  let { data } = $props()

  let copied = $state(false)

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    })
  }
</script>

<div class="mx-auto max-w-4xl p-6">
  <div class="mb-8">
    <h1 class="mb-4 text-3xl font-bold">S'abonner au calendrier Poezik</h1>
    <p class="text-lg text-gray-600">
      Synchronisez automatiquement tous les laboratoires Poezik avec votre
      application de calendrier préférée.
    </p>
  </div>

  <!-- Quick download button -->
  <div class="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
    <h2 class="mb-3 text-xl font-semibold text-blue-900">
      Téléchargement direct
    </h2>
    <p class="mb-4 text-blue-800">
      Téléchargez le fichier calendrier pour l'importer une seule fois dans
      votre application, les détails des lab seront ceux au moment du
      téléchargement, il n'y aura pas de mise à jour automatique.
    </p>
    <a
      href="/calendar"
      download="poezik-laboratoires.ics"
      class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      📥 Télécharger le calendrier (.ics)
    </a>
  </div>

  <!-- Subscription URL -->
  <div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
    <h2 class="mb-3 text-xl font-semibold text-green-900">
      URL d'abonnement (Recommandé)
    </h2>
    <p class="mb-4 text-green-800">
      Utilisez cette URL pour vous abonner au calendrier. Les nouveaux
      événements apparaîtront automatiquement.
    </p>

    <div class="mb-4 rounded border border-green-300 bg-white p-3">
      <code class="text-sm break-all text-gray-800">
        {data.subscriptionUrl}
      </code>
    </div>

    <button
      onclick={() => copyToClipboard(data.subscriptionUrl)}
      class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
      {copied ? '✓ Copié !' : "📋 Copier l'URL"}
    </button>
  </div>

  <!-- Instructions for different apps -->
  <div class="grid gap-6 md:grid-cols-2">
    <!-- Google Calendar -->
    <div class="rounded-lg border border-gray-200 p-6">
      <h3 class="mb-3 flex items-center text-lg font-semibold">
        <svg class="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
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
      </h3>
      <ol class="space-y-2 text-sm text-gray-600">
        <li>1. Ouvrez Google Calendar</li>
        <li>2. Cliquez sur le "+" à côté de "Autres agendas"</li>
        <li>3. Sélectionnez "À partir de l'URL"</li>
        <li>4. Collez l'URL d'abonnement</li>
        <li>5. Cliquez sur "Ajouter un agenda"</li>
      </ol>
    </div>

    <!-- Apple Calendar -->
    <div class="rounded-lg border border-gray-200 p-6">
      <h3 class="mb-3 flex items-center text-lg font-semibold">
        <svg class="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
        </svg>
        Apple Calendar
      </h3>
      <ol class="space-y-2 text-sm text-gray-600">
        <li>1. Ouvrez l'app Calendrier</li>
        <li>2. Allez dans Calendrier → Nouvel abonnement</li>
        <li>3. Collez l'URL d'abonnement</li>
        <li>4. Configurez les options de mise à jour</li>
        <li>5. Cliquez sur "OK"</li>
      </ol>
    </div>

    <!-- Outlook -->
    <div class="rounded-lg border border-gray-200 p-6">
      <h3 class="mb-3 flex items-center text-lg font-semibold">
        <svg class="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="#0078D4">
          <path
            d="M7,6V18H17A1,1 0 0,0 18,17V7A1,1 0 0,0 17,6H7M12,8.5A2.5,2.5 0 0,1 14.5,11A2.5,2.5 0 0,1 12,13.5A2.5,2.5 0 0,1 9.5,11A2.5,2.5 0 0,1 12,8.5Z" />
        </svg>
        Outlook
      </h3>
      <ol class="space-y-2 text-sm text-gray-600">
        <li>1. Ouvrez Outlook</li>
        <li>2. Cliquez sur "Ajouter un calendrier"</li>
        <li>3. Sélectionnez "S'abonner depuis le web"</li>
        <li>4. Collez l'URL d'abonnement</li>
        <li>5. Nommez le calendrier et cliquez sur "Importer"</li>
      </ol>
    </div>

    <!-- Thunderbird -->
    <div class="rounded-lg border border-gray-200 p-6">
      <h3 class="mb-3 flex items-center text-lg font-semibold">
        <svg class="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="#0A84FF">
          <path
            d="M24,12A12,12 0 0,1 12,24C5.37,24 0,18.63 0,12C0,5.37 5.37,0 12,0C18.63,0 24,5.37 24,12M8.03,9.17C8.03,7.97 8.74,7.03 9.87,7.03C11,7.03 11.71,7.97 11.71,9.17C11.71,10.37 11,11.31 9.87,11.31C8.74,11.31 8.03,10.37 8.03,9.17M15.97,9.17C15.97,7.97 16.68,7.03 17.81,7.03C18.94,7.03 19.65,7.97 19.65,9.17C19.65,10.37 18.94,11.31 17.81,11.31C16.68,11.31 15.97,10.37 15.97,9.17M13.8,13.18H10.2C10.2,13.18 10.65,15.79 12,15.79C13.35,15.79 13.8,13.18 13.8,13.18Z" />
        </svg>
        Thunderbird
      </h3>
      <ol class="space-y-2 text-sm text-gray-600">
        <li>1. Clic droit sur "Calendriers"</li>
        <li>2. Sélectionnez "Nouveau calendrier"</li>
        <li>3. Choisissez "Sur le réseau"</li>
        <li>4. Collez l'URL d'abonnement</li>
        <li>5. Configurez et sauvegardez</li>
      </ol>
    </div>
  </div>

  <div class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
    <h3 class="mb-3 text-lg font-semibold">💡 Conseils</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li>
        • Le calendrier se met à jour automatiquement avec les nouveaux
        événements
      </li>
      <li>• Les événements incluent l'adresse du Clap Lodève</li>
      <li>• Chaque événement est programmé de 20h00 à 22h00</li>
      <li>
        • Vous pouvez vous désabonner à tout moment depuis votre application de
        calendrier
      </li>
    </ul>
  </div>

  <div class="mt-8 text-center">
    <a
      href="/events"
      class="text-terracotta-600 hover:text-terracotta-800 font-medium">
      ← Retour aux laboratoires
    </a>
  </div>
</div>
