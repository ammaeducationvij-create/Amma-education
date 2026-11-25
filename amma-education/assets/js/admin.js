/**
 * AMMA EDUCATION - DDU-GKY Training Institute
 * Admin Dashboard Engine: Full Application Management, Analytics, Filters & CSV Export
 */

const ADMIN_CREDENTIALS = {
  username: "manikanta",
  pin: "7396538004", // Manikanta's official mobile / center in-charge PIN
  role: "Center In-Charge"
};

const AdminDashboard = {
  currentFilter: {
    search: "",
    course: "all",
    status: "all",
    hostel: "all"
  },

  init() {
    this.checkAuth();
    this.bindEvents();
    this.refresh();
  },

  checkAuth() {
    const isAuth = sessionStorage.getItem("AMMA_ADMIN_AUTH") === "true";
    const loginSection = document.getElementById("adminLoginView");
    const dashboardSection = document.getElementById("adminMainDashboard");

    if (isAuth) {
      if (loginSection) loginSection.style.display = "none";
      if (dashboardSection) dashboardSection.style.display = "block";
    } else {
      if (loginSection) loginSection.style.display = "block";
      if (dashboardSection) dashboardSection.style.display = "none";
    }
  },

  login(username, pin) {
    if (
      (username.trim().toLowerCase() === ADMIN_CREDENTIALS.username && pin.trim() === ADMIN_CREDENTIALS.pin) ||
      (username.trim().toLowerCase() === "admin" && (pin.trim() === "admin123" || pin.trim() === "7396538004"))
    ) {
      sessionStorage.setItem("AMMA_ADMIN_AUTH", "true");
      sessionStorage.setItem("AMMA_ADMIN_USER", "Manikanta (Center In-Charge)");
      this.checkAuth();
      this.refresh();
      if (typeof showToast === "function") {
        showToast("Welcome Manikanta Sir! Logged in successfully.", "success");
      }
      return true;
    } else {
      alert("Invalid Username or PIN. Please enter Manikanta / 7396538004 or admin / admin123");
      return false;
    }
  },

  logout() {
    sessionStorage.removeItem("AMMA_ADMIN_AUTH");
    sessionStorage.removeItem("AMMA_ADMIN_USER");
    this.checkAuth();
  },

  bindEvents() {
    // Login form submit
    const loginForm = document.getElementById("adminLoginForm");
    loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("adminUser")?.value;
      const p = document.getElementById("adminPin")?.value;
      this.login(u, p);
    });

    // Logout button
    document.getElementById("btnAdminLogout")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        this.logout();
      }
    });

    // Search Box
    const searchInput = document.getElementById("adminTableSearch");
    searchInput?.addEventListener("input", (e) => {
      this.currentFilter.search = e.target.value.toLowerCase().trim();
      this.renderTable();
    });

    // Course Filter
    document.getElementById("adminCourseFilter")?.addEventListener("change", (e) => {
      this.currentFilter.course = e.target.value;
      this.renderTable();
    });

    // Status Filter
    document.getElementById("adminStatusFilter")?.addEventListener("change", (e) => {
      this.currentFilter.status = e.target.value;
      this.renderTable();
    });

    // Hostel Filter
    document.getElementById("adminHostelFilter")?.addEventListener("change", (e) => {
      this.currentFilter.hostel = e.target.value;
      this.renderTable();
    });

    // Export CSV
    document.getElementById("btnExportCSV")?.addEventListener("click", () => {
      this.exportToCSV();
    });

    // Refresh
    document.getElementById("btnRefreshData")?.addEventListener("click", () => {
      this.refresh();
      if (typeof showToast === "function") showToast("Dashboard data updated", "info");
    });
  },

  refresh() {
    this.updateStats();
    this.renderTable();
  },

  updateStats() {
    const list = StorageManager.getAll();

    const total = list.length;
    const pending = list.filter(i => i.status === "Pending Verification").length;
    const approved = list.filter(i => i.status === "Approved" || i.status === "Enrolled").length;
    const hostelReq = list.filter(i => i.accommodation === "Yes").length;
    const foodReq = list.filter(i => i.food === "Yes").length;

    const elTotal = document.getElementById("statTotalRegistrations");
    const elPending = document.getElementById("statPendingVerification");
    const elApproved = document.getElementById("statApprovedEnrolled");
    const elHostel = document.getElementById("statHostelRequests");
    const elFood = document.getElementById("statFoodRequests");

    if (elTotal) elTotal.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elApproved) elApproved.textContent = approved;
    if (elHostel) elHostel.textContent = hostelReq;
    if (elFood) elFood.textContent = foodReq;
  },

  getFilteredData() {
    let list = StorageManager.getAll();

    // Text search
    if (this.currentFilter.search) {
      const q = this.currentFilter.search;
      list = list.filter(item => 
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.mobile && item.mobile.includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.village && item.village.toLowerCase().includes(q))
      );
    }

    // Course filter
    if (this.currentFilter.course !== "all") {
      list = list.filter(item => item.course === this.currentFilter.course);
    }

    // Status filter
    if (this.currentFilter.status !== "all") {
      list = list.filter(item => item.status === this.currentFilter.status);
    }

    // Hostel filter
    if (this.currentFilter.hostel !== "all") {
      list = list.filter(item => item.accommodation === this.currentFilter.hostel);
    }

    return list;
  },

  renderTable() {
    const tbody = document.getElementById("adminTableBody");
    const countBadge = document.getElementById("tableCountBadge");
    if (!tbody) return;

    const items = this.getFilteredData();
    if (countBadge) countBadge.textContent = `${items.length} Records`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem; color: #64748b;">
            <p style="font-size: 1rem; font-weight: 600;">No registrations match your search filter.</p>
            <small>Try clearing or modifying the search terms.</small>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
      const photoHtml = item.photo ? 
        `<div class="student-avatar"><img src="${item.photo}" alt="${item.fullName}"></div>` :
        `<div class="student-avatar">${item.fullName.charAt(0)}</div>`;

      return `
        <tr>
          <td><span class="ref-code">${item.id}</span></td>
          <td>
            <div class="student-col">
              ${photoHtml}
              <div class="student-meta">
                <strong>${item.fullName}</strong>
                <span>S/O, D/O: ${item.fatherName}</span>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #002B49;">${item.mobile}</div>
            <div style="display: flex; gap: 0.4rem; margin-top: 2px;">
              <a href="tel:${item.mobile}" title="Call Student" style="font-size: 0.72rem; color: #16a34a; font-weight: 700;">📞 Call</a>
              <span style="color:#cbd5e1;">|</span>
              <a href="https://wa.me/91${item.whatsapp}?text=Hello%20${encodeURIComponent(item.fullName)},%20greeting%20from%20Amma%20Education%20DDU-GKY%20Center." target="_blank" title="WhatsApp Student" style="font-size: 0.72rem; color: #0284c7; font-weight: 700;">💬 WA</a>
            </div>
          </td>
          <td>
            <div style="font-size: 0.82rem; font-weight: 700; color: #005691; max-width: 170px;">${item.course}</div>
            <small style="color: #64748b;">${item.qualification}</small>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">${item.district}</div>
            <small style="color: #64748b;">${item.village}</small>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span class="badge-facility ${item.accommodation === 'Yes' ? 'yes' : 'no'}">Hostel: ${item.accommodation}</span>
              <span class="badge-facility ${item.food === 'Yes' ? 'yes' : 'no'}">Food: ${item.food}</span>
            </div>
          </td>
          <td>
            <span class="badge-status ${statusClass}">${item.status}</span>
          </td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn-tbl-action" title="View Full Details" onclick="AdminDashboard.viewDetails('${item.id}')">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
              <button type="button" class="btn-tbl-action" title="Update Status / Add Note" onclick="AdminDashboard.openStatusModal('${item.id}')">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button type="button" class="btn-tbl-action" title="Print Slip" onclick="AdminDashboard.printSlip('${item.id}')">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              </button>
              <button type="button" class="btn-tbl-action delete" title="Delete Application" onclick="AdminDashboard.deleteItem('${item.id}')">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  viewDetails(id) {
    const item = StorageManager.findById(id);
    if (!item) return;

    const modal = document.getElementById("adminDetailModal");
    const body = document.getElementById("adminDetailBody");
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="padding: 1.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h3 style="color: #002B49; font-size: 1.35rem; margin-bottom: 2px;">${item.fullName}</h3>
            <span class="ref-code">${item.id}</span>
          </div>
          <span class="badge-status ${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div class="admin-detail-block">
            <h5>Parent Details</h5>
            <p>Father: ${item.fatherName}</p>
            <p>Mother: ${item.motherName}</p>
          </div>
          <div class="admin-detail-block">
            <h5>Personal Details</h5>
            <p>DOB: ${item.dob} (${item.gender})</p>
            <p>Email: ${item.email || 'N/A'}</p>
          </div>
          <div class="admin-detail-block">
            <h5>Contact Details</h5>
            <p>Mobile: <a href="tel:${item.mobile}">${item.mobile}</a></p>
            <p>WhatsApp: <a href="https://wa.me/91${item.whatsapp}" target="_blank">${item.whatsapp}</a></p>
          </div>
          <div class="admin-detail-block">
            <h5>Course & Qualifications</h5>
            <p>Course: <strong>${item.course}</strong></p>
            <p>Edu: ${item.qualification} (Comp: ${item.computerKnowledge})</p>
          </div>
          <div class="admin-detail-block" style="grid-column: span 2;">
            <h5>Residential Address</h5>
            <p>${item.address}, Village/Town: ${item.village}, Dist: ${item.district}, State: ${item.state} - ${item.pincode}</p>
          </div>
          <div class="admin-detail-block">
            <h5>Hostel & Food Requirements</h5>
            <p>Accommodation: <strong>${item.accommodation}</strong> | Food: <strong>${item.food}</strong></p>
          </div>
          <div class="admin-detail-block">
            <h5>Application Status & Remarks</h5>
            <p>Status: ${item.status}</p>
            <p style="font-size: 0.82rem; color: #475569;">${item.remarks || 'No notes added yet.'}</p>
          </div>
        </div>

        ${item.photo ? `
          <div style="margin-bottom: 1.25rem; text-align: center;">
            <p style="font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.4rem;">Uploaded Student Photo:</p>
            <img src="${item.photo}" alt="Student Photo" style="max-height: 140px; border-radius: 8px; border: 1px solid #cbd5e1;">
          </div>
        ` : ''}

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
          <button type="button" class="btn-print-slip" onclick="AdminDashboard.printSlip('${item.id}')">Print Slip</button>
          <button type="button" class="btn-admin-logout" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;" onclick="closeModal('adminDetailModal')">Close</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  openStatusModal(id) {
    const item = StorageManager.findById(id);
    if (!item) return;

    const newStatus = prompt(`Update status for ${item.fullName} (${item.id}):\n1. Pending Verification\n2. In-Review\n3. Approved\n4. Enrolled\n5. Rejected\n\nEnter Status:`, item.status);

    if (newStatus && newStatus.trim() !== "") {
      const remarks = prompt("Add center note / remarks for student:", item.remarks || "Updated by Manikanta");
      StorageManager.updateStatus(id, newStatus.trim(), remarks || "");
      this.refresh();
      if (typeof showToast === "function") showToast(`Status updated to: ${newStatus}`, "success");
    }
  },

  printSlip(id) {
    const item = StorageManager.findById(id);
    if (item && typeof showAcknowledgmentSlip === "function") {
      showAcknowledgmentSlip(item);
    }
  },

  deleteItem(id) {
    if (confirm(`Are you sure you want to delete application ${id}? This action cannot be undone.`)) {
      StorageManager.delete(id);
      this.refresh();
      if (typeof showToast === "function") showToast(`Application ${id} deleted`, "info");
    }
  },

  exportToCSV() {
    const data = StorageManager.getAll();
    if (data.length === 0) {
      alert("No student registration records available to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Full Name",
      "Father's Name",
      "Mother's Name",
      "Date of Birth",
      "Gender",
      "Mobile",
      "WhatsApp",
      "Email",
      "Address",
      "Village",
      "District",
      "State",
      "PIN Code",
      "Qualification",
      "Computer Knowledge",
      "Course Selected",
      "Experience",
      "Free Accommodation",
      "Free Food",
      "Registration Date",
      "Status",
      "Center Remarks"
    ];

    const csvRows = [headers.join(",")];

    data.forEach(item => {
      const row = [
        `"${item.id || ''}"`,
        `"${(item.fullName || '').replace(/"/g, '""')}"`,
        `"${(item.fatherName || '').replace(/"/g, '""')}"`,
        `"${(item.motherName || '').replace(/"/g, '""')}"`,
        `"${item.dob || ''}"`,
        `"${item.gender || ''}"`,
        `"${item.mobile || ''}"`,
        `"${item.whatsapp || ''}"`,
        `"${item.email || ''}"`,
        `"${(item.address || '').replace(/"/g, '""')}"`,
        `"${(item.village || '').replace(/"/g, '""')}"`,
        `"${(item.district || '').replace(/"/g, '""')}"`,
        `"${(item.state || '').replace(/"/g, '""')}"`,
        `"${item.pincode || ''}"`,
        `"${(item.qualification || '').replace(/"/g, '""')}"`,
        `"${(item.computerKnowledge || '').replace(/"/g, '""')}"`,
        `"${(item.course || '').replace(/"/g, '""')}"`,
        `"${(item.experience || '').replace(/"/g, '""')}"`,
        `"${item.accommodation || ''}"`,
        `"${item.food || ''}"`,
        `"${item.registeredAt || ''}"`,
        `"${item.status || ''}"`,
        `"${(item.remarks || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `AMMA_Education_DDUGKY_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    if (typeof showToast === "function") showToast("CSV file exported successfully!", "success");
  }
};

// Initialize Admin Dashboard if on admin page or section
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("adminTableBody")) {
    AdminDashboard.init();
  }
});
