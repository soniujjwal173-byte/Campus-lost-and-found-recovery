
// (function () {
//   "use strict";


//   const STORAGE_KEY = "campusLostFound.items.v1";

//   const CATEGORIES = {
//     electronics: "Electronics",
//     documents: "Documents & ID",
//     books: "Books",
//     bags: "Bags & Accessories",
//     clothing: "Clothing",
//     others: "Keys & Others"
//   };

  
//   const STATUS_KEYS = ["reported", "review", "matched", "returned"];
//   const STATUS_LABELS = { reported: "Reported", review: "Under Review", matched: "Matched", returned: "Returned" };
//   const STEP_LABELS = { reported: "Reported", review: "Review", matched: "Matched", returned: "Returned" };

//   const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 
//   const SEED_ITEMS = [
//     { id: "LF-1001", type: "lost",  name: "Blue Laptop Backpack",     category: "bags",        location: "Library",            date: "2026-10-02", status: "review",   description: "Navy blue backpack with a laptop inside and a small panda keychain." },
//     { id: "LF-1002", type: "found", name: "Student ID Card",          category: "documents",   location: "Main Gate",          date: "2026-10-03", status: "matched",  description: "College ID card of a second-year B.Tech student, found near the security desk." },
//     { id: "LF-1003", type: "lost",  name: "Wireless Earbuds",         category: "electronics", location: "Cafeteria",          date: "2026-10-04", status: "reported", description: "White earbuds in a black charging case with a scratch on the lid." },
//     { id: "LF-1004", type: "found", name: "Scientific Calculator",    category: "electronics", location: "Block B, Exam Hall", date: "2026-10-05", status: "returned", description: "Black scientific calculator left on a desk after the internal exam." },
//     { id: "LF-1005", type: "found", name: "Bunch of Keys",            category: "others",      location: "Parking Area",       date: "2026-10-06", status: "review",   description: "Three keys on a ring with a red tag, found near the two-wheeler parking." },
//     { id: "LF-1006", type: "lost",  name: "Data Structures Textbook", category: "books",       location: "Block C, Room 204",  date: "2026-10-07", status: "reported", description: "Green hardcover textbook with the owner's name written on the first page." },
//     { id: "LF-1007", type: "found", name: "Grey Hoodie",              category: "clothing",    location: "Sports Ground",      date: "2026-10-08", status: "returned", description: "Grey zip-up hoodie, size M, left on the bleachers after practice." },
//     { id: "LF-1008", type: "lost",  name: "Silver Wrist Watch",       category: "bags",        location: "Gym",                date: "2026-10-09", status: "reported", description: "Silver analog watch with a metal strap and a cracked corner on the dial." }
//   ];


//   const $ = function (id) { return document.getElementById(id); };

//   const grid = $("item-grid");
//   const searchInput = $("search");
//   const reportForm = $("report-form");
//   const reportAlert = $("report-alert");
//   const updateForm = $("update-form");
//   const updateAlert = $("update-alert");

  
//   let items = loadItems();
//   if (!items) {
//     items = SEED_ITEMS.map(function (item) { return Object.assign({}, item); });
//     saveItems();
//   }

//   function loadItems() {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const data = JSON.parse(raw);
//         if (Array.isArray(data)) return data;
//       }
//     } catch (error) {
    
//     }
//     return null;
//   }

//   function saveItems() {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
//     } catch (error) {
      
//     }
//   }


//   function esc(text) {
//     return String(text).replace(/[&<>"']/g, function (ch) {
//       return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
//     });
//   }

//   function idNumber(id) {
//     return parseInt(String(id).slice(3), 10) || 0;
//   }

//   function nextId() {
//     const highest = Math.max.apply(null, [1000].concat(items.map(function (i) { return idNumber(i.id); })));
//     return "LF-" + String(highest + 1).padStart(4, "0");
//   }

//   function todayISO() {
//     const d = new Date();
//     return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
//   }

//   function formatDate(iso) {
//     const parts = String(iso).split("-");
//     if (parts.length !== 3) return iso;
//     return parts[2] + " " + MONTHS[Number(parts[1]) - 1] + " " + parts[0];
//   }

//   function showAlert(box, type, title, message) {
//     box.className = "alert show alert-" + type;
//     box.replaceChildren();
//     const strong = document.createElement("strong");
//     strong.textContent = title;
//     box.append(strong, " " + message);
//     box.scrollIntoView({ behavior: "smooth", block: "center" });
//   }

//   function hideAlert(box) {
//     box.className = "alert";
//     box.replaceChildren();
//   }


//   function barRow(label, count, percent, green) {
//     return '<li><span class="bar-label">' + esc(label) + '</span>' +
//            '<span class="bar' + (green ? " bar-green" : "") + '"><span style="--w:' + percent + '%"></span></span>' +
//            '<span class="bar-count">' + count + '</span></li>';
//   }

//   function renderDashboard() {
//     const total = items.length;
//     const lost = items.filter(function (i) { return i.type === "lost"; }).length;
//     const found = total - lost;
//     const returned = items.filter(function (i) { return i.status === "returned"; }).length;

//     $("stat-total").textContent = total;
//     $("stat-lost").textContent = lost;
//     $("stat-found").textContent = found;
//     $("stat-pending").textContent = total - returned;
//     $("stat-returned").textContent = returned;

  
//     const categoryCounts = Object.keys(CATEGORIES).map(function (key) {
//       return { label: CATEGORIES[key], count: items.filter(function (i) { return i.category === key; }).length };
//     }).sort(function (a, b) { return b.count - a.count; });
//     const biggest = Math.max.apply(null, [1].concat(categoryCounts.map(function (c) { return c.count; })));
//     $("category-bars").innerHTML = categoryCounts.map(function (c) {
//       return barRow(c.label, c.count, (c.count / biggest) * 100, false);
//     }).join("");

  
//     $("status-bars").innerHTML = STATUS_KEYS.map(function (key) {
//       const count = items.filter(function (i) { return i.status === key; }).length;
//       return barRow(STATUS_LABELS[key], count, total ? (count / total) * 100 : 0, key === "returned");
//     }).join("");

//     const rate = total ? Math.round((returned / total) * 100) : 0;
//     $("recovery-rate").innerHTML = "Recovery rate: <strong>" + rate + "%</strong> (" + returned + " of " + total + " items returned)";
//   }


//   function cardHTML(item) {
//     const current = STATUS_KEYS.indexOf(item.status);
//     const steps = STATUS_KEYS.map(function (key, index) {
//       const classes = [];
//       if (index <= current) classes.push("done");
//       if (index === current) classes.push("current");
//       return "<li" + (classes.length ? ' class="' + classes.join(" ") + '"' : "") + ">" + STEP_LABELS[key] + "</li>";
//     }).join("");

//     const categoryLabel = CATEGORIES[item.category] || "Other";
//     const searchText = [item.id, item.name, item.location, categoryLabel, item.description].join(" ").toLowerCase();

//     return '' +
//       '<article class="item" data-type="' + esc(item.type) + '" data-cat="' + esc(item.category) + '" data-status="' + esc(item.status) + '" data-search="' + esc(searchText) + '">' +
//         '<div class="item-top"><span class="item-id">' + esc(item.id) + '</span>' +
//           '<span class="tag tag-' + esc(item.type) + '">' + (item.type === "lost" ? "Lost" : "Found") + '</span></div>' +
//         '<h3>' + esc(item.name) + '</h3>' +
//         '<ul class="meta">' +
//           '<li><b>Category:</b> ' + esc(categoryLabel) + '</li>' +
//           '<li><b>Location:</b> ' + esc(item.location) + '</li>' +
//           '<li><b>Date:</b> ' + esc(formatDate(item.date)) + '</li>' +
//         '</ul>' +
//         '<p class="desc">' + esc(item.description) + '</p>' +
//         '<span class="badge badge-' + esc(item.status) + '">' + esc(STATUS_LABELS[item.status] || item.status) + '</span>' +
//         '<ol class="steps" aria-label="Recovery progress">' + steps + '</ol>' +
//       '</article>';
//   }

//   function renderItems() {
//     // newest report first
//     const sorted = items.slice().sort(function (a, b) { return idNumber(b.id) - idNumber(a.id); });
//     grid.innerHTML = sorted.map(cardHTML).join("");
//   }

 
//   function applySearch() {
//     const query = searchInput.value.trim().toLowerCase();
//     grid.querySelectorAll(".item").forEach(function (card) {
//       const matches = query === "" || card.dataset.search.indexOf(query) !== -1;
//       card.classList.toggle("is-hidden", !matches);
//     });
//   }

//   searchInput.addEventListener("input", applySearch);

//   function render() {
//     renderDashboard();
//     renderItems();
//     applySearch();
//   }


//   $("date").max = todayISO(); 

//   reportForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     const form = new FormData(reportForm);

//     const data = {
//       type: form.get("report_type"),
//       name: String(form.get("item_name")).trim(),
//       category: form.get("category"),
//       description: String(form.get("description")).trim(),
//       date: form.get("date"),
//       location: form.get("location"),
//       fullName: String(form.get("full_name")).trim(),
//       collegeId: String(form.get("college_id")).trim(),
//       email: String(form.get("email")).trim(),
//       phone: String(form.get("phone")).trim()
//     };

//     let problem = "";
//     if (data.name.length < 3) problem = "Please enter a valid item name (at least 3 characters).";
//     else if (data.description.length < 20) problem = "Please describe the item in at least 20 characters.";
//     else if (data.date > todayISO()) problem = "The date cannot be in the future.";
//     else if (data.fullName.length < 3) problem = "Please enter your full name (at least 3 letters).";

//     if (problem) {
//       showAlert(reportAlert, "error", "Report not submitted.", problem);
//       return;
//     }

//     const record = {
//       id: nextId(),
//       type: data.type,
//       name: data.name,
//       category: data.category,
//       location: data.location,
//       date: data.date,
//       description: data.description,
//       status: "reported",
//       reporter: { name: data.fullName, collegeId: data.collegeId, email: data.email, phone: data.phone },
//       history: [{ status: "reported", by: data.fullName, remarks: "Report submitted", at: new Date().toISOString() }]
//     };

//     items.push(record);
//     saveItems();
//     render();
//     reportForm.reset();
//     showAlert(reportAlert, "success", "Report submitted successfully!",
//       "Your reference ID is " + record.id + ". Keep it to follow the progress of this item.");
//   });

  
//   updateForm.addEventListener("submit", function (event) {
//     event.preventDefault();
//     const form = new FormData(updateForm);

//     const id = String(form.get("item_id")).trim().toUpperCase();
//     const newStatus = String(form.get("new_status"));
//     const updatedBy = String(form.get("updated_by")).trim();
//     const email = String(form.get("update_email")).trim();
//     const remarks = String(form.get("remarks")).trim();

//     function fail(message) {
//       showAlert(updateAlert, "error", "Status not updated.", message);
//     }

//     if (updatedBy.length < 3) return fail("Please enter the name of the staff member (at least 3 letters).");
//     if (remarks.length < 10) return fail("Please add remarks of at least 10 characters.");

//     const item = items.find(function (i) { return i.id === id; });
//     if (!item) return fail("No record found with Item ID " + id + ". Check the ID shown on the item card.");

//     const currentIndex = STATUS_KEYS.indexOf(item.status);
//     const newIndex = STATUS_KEYS.indexOf(newStatus);

//     if (newIndex === currentIndex) {
//       return fail("Item " + id + " is already marked as “" + STATUS_LABELS[item.status] + "”.");
//     }
//     if (newIndex < currentIndex) {
//       return fail("Item " + id + " is already at “" + STATUS_LABELS[item.status] + "”. A status cannot be moved back to “" + STATUS_LABELS[newStatus] + "”.");
//     }

//     const oldLabel = STATUS_LABELS[item.status];
//     item.status = newStatus;
//     item.history = item.history || [];
//     item.history.push({ status: newStatus, by: updatedBy, email: email, remarks: remarks, at: new Date().toISOString() });

//     saveItems();
//     render();
//     updateForm.reset();
//     showAlert(updateAlert, "success", "Status updated successfully!",
//       "Item " + id + " moved from “" + oldLabel + "” to “" + STATUS_LABELS[newStatus] + "”.");
//   });


//   reportForm.addEventListener("input", function () { hideAlert(reportAlert); });
//   updateForm.addEventListener("input", function () { hideAlert(updateAlert); });

//   render();
// })();






