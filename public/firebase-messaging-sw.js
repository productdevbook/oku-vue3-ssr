/* eslint-disable no-undef */
if ("function" === typeof importScripts) {
    importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js")
    importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js")
    importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js");
  

    const messaging = firebase.messaging();
  
    messaging.onBackgroundMessage((payload) => {
      if (payload.notification === undefined) { return; }
      const notificationData = JSON.parse(payload.notification.body)
  
      console.log("[firebase-messaging-sw.js] Received background message ", notificationData);
  
      const { title, body } = notificationData;
      const notificationTitle = title;
      const notificationOptions = {
        body: body,
        icon: "/apple-touch-icon.png"
      };
  
      return self.registration.showNotification(`[BG] ${notificationTitle}`, { data: notificationOptions, ...notificationOptions })
        .then(() => {
          console.log("[firebase-messaging-sw.js] Notification shown");
        }).catch((err) => {
          console.log("[firebase-messaging-sw.js] Notification not shown", err);
        });
    });
  
    // workbox.routing.registerRoute(
    //   ({ request }) => request.destination === "image",
    //   new workbox.strategies.CacheFirst(),
    // );
  }