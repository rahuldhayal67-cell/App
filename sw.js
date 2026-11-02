
self.addEventListener("push", function(event) {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || "💕 New Match on ConnectN";

  const options = {
    body: data.body || "You have a new match!",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: {
      url: data.url || "/App/#/matches"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  const url = event.notification.data?.url || "/App/#/matches";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(function(windowClients) {
      for (const client of windowClients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
