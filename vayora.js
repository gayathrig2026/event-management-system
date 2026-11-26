/* Shared catalogue and Local Storage for the college demo. */
(function () {
  var REQUESTS_KEY = "vayoraEventRequests";
  var REGISTRATIONS_KEY = "vayoraRegistrations";

  var events = [
    {
      id: "music-festival",
      name: "Music Festival",
      date: "2026-12-14",
      time: "4:00 PM",
      location: "Vagator Beach, Goa",
      description: "An open-air evening of live music organised by VAYORA, with performances across the night.",
      fee: "Paid",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "college-cultural-fest",
      name: "College Cultural Fest",
      date: "2026-11-28",
      time: "10:00 AM",
      location: "VAYORA Grounds, Hyderabad",
      description: "A day of performances, stalls and student showcases. Open to anyone who wants to take part.",
      fee: "Free",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "art-exhibition",
      name: "Art Exhibition",
      date: "2026-12-05",
      time: "11:00 AM",
      location: "Gallery Hall, Bengaluru",
      description: "Walk through a curated exhibition of contemporary work, hosted by VAYORA.",
      fee: "Free",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "standup-comedy",
      name: "Stand-up Comedy",
      date: "2026-12-20",
      time: "7:30 PM",
      location: "Auditorium, Mumbai",
      description: "An evening of stand-up organised by VAYORA. Seats are limited.",
      fee: "Paid",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "photography-workshop",
      name: "Photography Workshop",
      date: "2027-01-10",
      time: "9:30 AM",
      location: "Studio 4, Pune",
      description: "A hands-on workshop on light, composition and editing, open for registration.",
      fee: "Free",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80"
    }
  ];

  function readList(key) {
    try {
      var stored = localStorage.getItem(key);
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  function nextId(prefix) {
    return prefix + Date.now().toString().slice(-6);
  }

  window.Vayora = {
    events: events,

    getEvent: function (id) {
      for (var i = 0; i < events.length; i++) {
        if (events[i].id === id) return events[i];
      }
      return null;
    },

    getRequests: function () {
      return readList(REQUESTS_KEY);
    },

    saveRequest: function (request) {
      var list = readList(REQUESTS_KEY);
      request.id = nextId("REQ");
      request.status = "pending";
      request.createdAt = new Date().toISOString();
      list.unshift(request);
      writeList(REQUESTS_KEY, list);
      return request;
    },

    updateRequestStatus: function (id, status) {
      var list = readList(REQUESTS_KEY);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list[i].status = status;
          writeList(REQUESTS_KEY, list);
          return list[i];
        }
      }
      return null;
    },

    getRegistrations: function () {
      return readList(REGISTRATIONS_KEY);
    },

    isRegistered: function (eventId) {
      var list = readList(REGISTRATIONS_KEY);
      for (var i = 0; i < list.length; i++) {
        if (list[i].eventId === eventId) return true;
      }
      return false;
    },

    saveRegistration: function (registration) {
      var list = readList(REGISTRATIONS_KEY);
      registration.id = nextId("REG");
      registration.status = "registered";
      registration.createdAt = new Date().toISOString();
      list.unshift(registration);
      writeList(REGISTRATIONS_KEY, list);
      return registration;
    },

    formatDate: function (dateString) {
      var date = new Date(dateString + "T00:00:00");
      if (isNaN(date.getTime())) {
        return { day: "—", month: "", year: "", label: dateString || "Date to be confirmed" };
      }
      return {
        day: date.getDate(),
        month: date.toLocaleDateString("en-IN", { month: "short" }),
        year: date.getFullYear(),
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      };
    },

    statusLabel: function (status) {
      if (status === "discussion") return "Under Discussion";
      if (status === "confirmed") return "Confirmed";
      if (status === "registered") return "Registered";
      return "Pending";
    }
  };
})();
