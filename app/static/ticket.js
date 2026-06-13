const ticketId = window.location.pathname.split("/").pop();

async function loadDetail() {
    const res = await fetch(`/api/tickets/${ticketId}`);
    const t = await res.json();

    const statusClass = t.status.replace(" ", "");

    const notesHTML = t.notes && t.notes.length > 0
        ? t.notes.map(n => `
            <div class="note-item">
                <p>${n.note_text}</p>
                <p class="note-time">${new Date(n.created_at).toLocaleString()}</p>
            </div>`).join("")
        : `<p style="font-size:13px; color:#9ca3af;">No notes yet.</p>`;

    document.getElementById("ticketDetail").innerHTML = `
        <div class="card-header">
            <div>
                <p class="ticket-title">${t.ticket_id} — ${t.subject}</p>
                <p class="ticket-meta">${t.customer_name} · ${t.customer_email}</p>
                <p class="ticket-meta">Created: ${new Date(t.created_at).toLocaleString()}</p>
            </div>
            <span class="badge ${statusClass}">${t.status}</span>
        </div>

        <hr class="divider">
        <p class="description">${t.description}</p>
        <hr class="divider">

        <p class="section-title">Update Ticket</p>
        <div class="update-row">
            <select id="newStatus">
                <option ${t.status === "Open" ? "selected" : ""}>Open</option>
                <option ${t.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option ${t.status === "Closed" ? "selected" : ""}>Closed</option>
            </select>
            <textarea id="noteText" placeholder="Add a note (optional)" rows="2"></textarea>
            <button class="btn-primary" onclick="updateTicket()">Update</button>
        </div>

        <hr class="divider">
        <p class="section-title">Notes</p>
        <div class="notes-list">${notesHTML}</div>
    `;
}

async function updateTicket() {
    const status = document.getElementById("newStatus").value;
    const note = document.getElementById("noteText").value;

    await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: note })
    });

    alert("Ticket updated!");
    loadDetail();
}

loadDetail();