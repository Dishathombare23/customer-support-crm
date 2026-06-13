function toggleForm() {
    const form = document.getElementById("ticketForm");
    if (form.style.display === "block") {
        form.style.display = "none";
    } else {
        form.style.display = "block";
    }
}

async function createTicket() {
    const name = document.getElementById("customer_name").value.trim();
    const email = document.getElementById("customer_email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name || !email || !subject || !description) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_name: name, customer_email: email, subject, description })
        });

        const data = await response.json();
        alert(`Ticket ${data.ticket_id} created!`);

        document.getElementById("customer_name").value = "";
        document.getElementById("customer_email").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("description").value = "";

        toggleForm();
        loadTickets();

    } catch (err) {
        alert("Error creating ticket.");
        console.error(err);
    }
}

async function loadTickets() {
    const search = document.getElementById("searchInput").value;
    const status = document.getElementById("statusFilter").value;

    let url = "/api/tickets?";
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status) url += `status=${encodeURIComponent(status)}`;

    try {
        const response = await fetch(url);
        const tickets = await response.json();
        renderTickets(tickets);
        updateStats(tickets);
    } catch (err) {
        document.getElementById("ticketList").innerHTML =
            `<p style="color:red;">Failed to load tickets.</p>`;
    }
}

function updateStats(tickets) {
    document.getElementById("statTotal").textContent = tickets.length;
    document.getElementById("statOpen").textContent = tickets.filter(t => t.status === "Open").length;
    document.getElementById("statProgress").textContent = tickets.filter(t => t.status === "In Progress").length;
}

function renderTickets(tickets) {
    const list = document.getElementById("ticketList");

    if (tickets.length === 0) {
        list.innerHTML = `<div class="empty">No tickets found.</div>`;
        return;
    }

    list.innerHTML = tickets.map(t => `
        <div class="ticket-card" onclick="window.location.href='/ticket/${t.ticket_id}'">
            <div class="ticket-left">
                <div class="ticket-icon">🎫</div>
                <div class="ticket-info">
                    <h3>${t.ticket_id} — ${t.subject}</h3>
                    <p>${t.customer_name} · ${t.customer_email}</p>
                </div>
            </div>
            <div class="ticket-right">
                <span class="ticket-date">${new Date(t.created_at).toLocaleDateString()}</span>
                <span class="badge ${t.status.replace(" ", "-")}">${t.status}</span>
            </div>
        </div>
    `).join("");
}

loadTickets();