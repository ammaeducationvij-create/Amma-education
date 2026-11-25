/**
 * AMMA EDUCATION - DDU-GKY Training Institute
 * Main JavaScript Engine: Reactive Storage, Validation, Status Tracker & Interactions
 */

// Initial Seed Data if storage is empty
const INITIAL_STUDENTS = [
  {
    id: "AMMA-2026-10021",
    fullName: "Kalyan Kumar Reddy",
    fatherName: "Venkata Ramana Reddy",
    motherName: "Lakshmi Devi",
    dob: "2003-05-14",
    gender: "Male",
    mobile: "9848022338",
    whatsapp: "9848022338",
    email: "kalyan.reddy@gmail.com",
    address: "H.No 4-52, Near Ramalayam Temple",
    village: "Guntupalli",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521241",
    qualification: "Degree / Graduation",
    computerKnowledge: "Basic",
    course: "Computer Knowledge and MS Office Training",
    experience: "None (Fresher)",
    accommodation: "Yes",
    food: "Yes",
    registeredAt: "2026-11-20T10:30:00.000Z",
    status: "Approved",
    remarks: "Documents verified by center staff. Hostel Bed Allotted."
  },
  {
    id: "AMMA-2026-10022",
    fullName: "Praveena Annam",
    fatherName: "Srinivasa Rao",
    motherName: "Satyavathi",
    dob: "2004-08-22",
    gender: "Female",
    mobile: "9490123456",
    whatsapp: "9490123456",
    email: "praveena.annam@gmail.com",
    address: "Main Bazar, Ibrahimpatnam",
    village: "Ibrahimpatnam",
    district: "Krishna",
    state: "Andhra Pradesh",
    pincode: "521456",
    qualification: "Intermediate (12th)",
    computerKnowledge: "Intermediate",
    course: "Communication Skills Training",
    experience: "Fresher",
    accommodation: "Yes",
    food: "Yes",
    registeredAt: "2026-11-22T14:15:00.000Z",
    status: "Pending Verification",
    remarks: "Application under initial review."
  },
  {
    id: "AMMA-2026-10023",
    fullName: "Ravi Teja Bandi",
    fatherName: "Narasimha Rao",
    motherName: "Subhashini",
    dob: "2002-11-09",
    gender: "Male",
    mobile: "8331987654",
    whatsapp: "8331987654",
    email: "raviteja.bandi@gmail.com",
    address: "Plot 12, Auto Nagar",
    village: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520007",
    qualification: "Diploma / ITI",
    computerKnowledge: "None",
    course: "IT Training",
    experience: "6 months shop assistant",
    accommodation: "No",
    food: "Yes",
    registeredAt: "2026-11-23T09:45:00.000Z",
    status: "In-Review",
    remarks: "Contacted student for counseling session."
  }
];

// Local Storage Repository
const StorageManager = {
  KEY: "AMMA_EDUCATION_REGISTRATIONS_V1",
  
  init() {
    if (!localStorage.getItem(this.KEY)) {
      localStorage.setItem(this.KEY, JSON.stringify(INITIAL_STUDENTS));
    }
  },

  getAll() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch (e) {
      console.error("Storage parse error", e);
      return [];
    }
  },

  save(registrationData) {
    const list = this.getAll();
    list.unshift(registrationData);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    return registrationData;
  },

  updateStatus(id, newStatus, remarks = "") {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index].status = newStatus;
      if (remarks) list[index].remarks = remarks;
      list[index].updatedAt = new Date().toISOString();
      localStorage.setItem(this.KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  delete(id) {
    let list = this.getAll();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    return true;
  },

  findById(id) {
    const list = this.getAll();
    return list.find(item => item.id.toUpperCase() === id.trim().toUpperCase());
  },

  findByMobile(mobile) {
    const list = this.getAll();
    const cleanMobile = mobile.trim().replace(/\D/g, '');
    return list.find(item => item.mobile.replace(/\D/g, '') === cleanMobile);
  },

  generateReferenceNumber() {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `AMMA-2026-${randomDigits}`;
  }
};

// Initialize Storage
StorageManager.init();

// DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initRegistrationForm();
  initStatusTracker();
  initCourseModals();
  initScrollEffects();
});

/* ==========================================================================
   NAVBAR & SCROLL HANDLING
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector(".site-header");
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  const mobileOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileClose = document.querySelector(".mobile-drawer-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");
  const topBtn = document.querySelector(".float-top-btn");

  // Sticky header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
      topBtn?.classList.add("visible");
    } else {
      header?.classList.remove("scrolled");
      topBtn?.classList.remove("visible");
    }
  });

  // Top button click
  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Mobile Drawer Toggle
  function openMobileNav() {
    mobileDrawer?.classList.add("open");
    mobileOverlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileDrawer?.classList.remove("open");
    mobileOverlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  mobileToggle?.addEventListener("click", openMobileNav);
  mobileClose?.addEventListener("click", closeMobileNav);
  mobileOverlay?.addEventListener("click", closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener("click", closeMobileNav));

  // Smooth scroll spy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   REGISTRATION FORM & VALIDATION
   ========================================================================== */
let uploadedPhotoBase64 = null;

function initRegistrationForm() {
  const form = document.getElementById("studentRegistrationForm");
  if (!form) return;

  const photoInput = document.getElementById("studentPhoto");
  const photoPreview = document.getElementById("photoPreview");
  const photoImg = document.getElementById("photoPreviewImg");

  // Handle Photo Preview
  photoInput?.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast("Photo must be less than 3MB", "error");
        photoInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = function(event) {
        uploadedPhotoBase64 = event.target.result;
        if (photoImg) photoImg.src = uploadedPhotoBase64;
        if (photoPreview) photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Form submission handler
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Validation
    const isValid = validateRegistrationForm(form);
    if (!isValid) {
      showToast("Please fill all mandatory fields correctly", "error");
      return;
    }

    // Collect Data
    const formData = new FormData(form);
    const refNumber = StorageManager.generateReferenceNumber();

    const registrationRecord = {
      id: refNumber,
      fullName: formData.get("fullName").trim(),
      fatherName: formData.get("fatherName").trim(),
      motherName: formData.get("motherName").trim(),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      mobile: formData.get("mobile").trim(),
      whatsapp: formData.get("whatsapp") ? formData.get("whatsapp").trim() : formData.get("mobile").trim(),
      email: formData.get("email").trim(),
      address: formData.get("address").trim(),
      village: formData.get("village").trim(),
      district: formData.get("district"),
      state: formData.get("state") || "Andhra Pradesh",
      pincode: formData.get("pincode").trim(),
      qualification: formData.get("qualification"),
      computerKnowledge: formData.get("computerKnowledge"),
      course: formData.get("course"),
      experience: formData.get("experience") || "Fresher",
      accommodation: formData.get("accommodation") || "Yes",
      food: formData.get("food") || "Yes",
      photo: uploadedPhotoBase64 || null,
      registeredAt: new Date().toISOString(),
      status: "Pending Verification",
      remarks: "Application received successfully. Awaiting center review."
    };

    // Save to LocalStorage
    StorageManager.save(registrationRecord);

    // Show Printable Acknowledgment Modal
    showAcknowledgmentSlip(registrationRecord);

    // Reset Form
    form.reset();
    uploadedPhotoBase64 = null;
    if (photoPreview) photoPreview.style.display = "none";
    showToast(`Registration Successful! Ref No: ${refNumber}`, "success");
  });
}

function validateRegistrationForm(form) {
  let valid = true;
  const requiredInputs = form.querySelectorAll("[required]");

  requiredInputs.forEach(input => {
    const errorEl = input.parentElement.querySelector(".field-error");
    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      if (errorEl) errorEl.classList.add("show");
      valid = false;
    } else {
      input.classList.remove("is-invalid");
      if (errorEl) errorEl.classList.remove("show");
    }

    // Mobile Validation
    if (input.name === "mobile" || input.name === "whatsapp") {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanPhone = input.value.trim().replace(/\D/g, '');
      if (input.value.trim() && !phoneRegex.test(cleanPhone)) {
        input.classList.add("is-invalid");
        if (errorEl) {
          errorEl.textContent = "Please enter a valid 10-digit mobile number";
          errorEl.classList.add("show");
        }
        valid = false;
      }
    }

    // Pincode validation
    if (input.name === "pincode") {
      const pinRegex = /^\d{6}$/;
      if (input.value.trim() && !pinRegex.test(input.value.trim())) {
        input.classList.add("is-invalid");
        if (errorEl) {
          errorEl.textContent = "Please enter a valid 6-digit PIN code";
          errorEl.classList.add("show");
        }
        valid = false;
      }
    }
  });

  // Check consent checkbox
  const consent = document.getElementById("consentCheckbox");
  if (consent && !consent.checked) {
    showToast("Please accept the declaration to proceed", "error");
    valid = false;
  }

  return valid;
}

/* ==========================================================================
   ACKNOWLEDGMENT SLIP MODAL
   ========================================================================== */
function showAcknowledgmentSlip(data) {
  const modal = document.getElementById("acknowledgmentModal");
  if (!modal) return;

  const content = document.getElementById("slipModalBody");
  if (content) {
    content.innerHTML = `
      <div class="slip-container" id="printableSlip">
        <div class="slip-header">
          <div class="slip-logos">
            <img src="assets/images/ddu-gky-logo.png" alt="DDU-GKY">
            <img src="assets/images/govt-logo.png" alt="Government Emblem">
          </div>
          <h2 class="slip-title">AMMA EDUCATION</h2>
          <p class="slip-sub">Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)</p>
          <p style="font-size: 0.8rem; font-weight: 700; color: #f97316;">STUDENT REGISTRATION ACKNOWLEDGMENT SLIP (2026)</p>
        </div>

        <div class="slip-ref-box">
          <p>Application Reference Number</p>
          <div class="slip-ref-id">${data.id}</div>
          <small style="color: #15803d; font-size: 0.75rem;">Status: <strong>${data.status}</strong> | Date: ${new Date(data.registeredAt).toLocaleDateString()}</small>
        </div>

        <div style="display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 1.25rem;">
          <table class="slip-details-table" style="flex: 1;">
            <tr>
              <td class="label">Student Full Name:</td>
              <td class="value"><strong>${data.fullName}</strong></td>
            </tr>
            <tr>
              <td class="label">Father's Name:</td>
              <td class="value">${data.fatherName}</td>
            </tr>
            <tr>
              <td class="label">Mother's Name:</td>
              <td class="value">${data.motherName}</td>
            </tr>
            <tr>
              <td class="label">Gender / DOB:</td>
              <td class="value">${data.gender} | ${data.dob}</td>
            </tr>
            <tr>
              <td class="label">Mobile Number:</td>
              <td class="value"><strong>${data.mobile}</strong></td>
            </tr>
            <tr>
              <td class="label">Selected Course:</td>
              <td class="value" style="color: #005691; font-weight: 700;">${data.course}</td>
            </tr>
            <tr>
              <td class="label">Highest Qualification:</td>
              <td class="value">${data.qualification}</td>
            </tr>
            <tr>
              <td class="label">Residential Address:</td>
              <td class="value">${data.village}, ${data.district}, ${data.state} - ${data.pincode}</td>
            </tr>
            <tr>
              <td class="label">Free Accommodation:</td>
              <td class="value"><span class="badge-facility ${data.accommodation === 'Yes' ? 'yes' : 'no'}">${data.accommodation}</span></td>
            </tr>
            <tr>
              <td class="label">Free Food Facility:</td>
              <td class="value"><span class="badge-facility ${data.food === 'Yes' ? 'yes' : 'no'}">${data.food}</span></td>
            </tr>
          </table>

          ${data.photo ? `
            <div style="width: 100px; text-align: center; border: 1px solid #cbd5e1; padding: 4px; border-radius: 4px;">
              <img src="${data.photo}" alt="Student Photo" style="width: 100%; height: 110px; object-fit: cover;">
              <span style="font-size: 0.65rem; color: #64748b;">Applicant Photo</span>
            </div>
          ` : `
            <div style="width: 100px; height: 110px; border: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #94a3b8; text-align: center; border-radius: 4px;">
              Affix Passport Photo
            </div>
          `}
        </div>

        <div class="slip-instructions">
          <h5>Next Steps for Verification & Orientation:</h5>
          <ul>
            <li>Please preserve this Reference Number: <strong>${data.id}</strong> for all future communications.</li>
            <li>Our Center In-charge <strong>Manikanta (7396538004)</strong> will contact you within 24–48 hours for document verification.</li>
            <li>Please bring Original Aadhaar Card, 10th / Intermediate / Degree certificate, and 4 passport size photos when visiting the center.</li>
            <li>Center Address: Amma Education, DDU-GKY Training Center, Guntupalli, Near Vijayawada, Andhra Pradesh.</li>
          </ul>
        </div>

        <div class="slip-actions">
          <button type="button" class="btn-print-slip" onclick="window.print()">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Acknowledgment Slip
          </button>
          <button type="button" class="btn-admin-logout" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;" onclick="closeModal('acknowledgmentModal')">
            Close
          </button>
        </div>
      </div>
    `;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ==========================================================================
   APPLICATION STATUS TRACKER
   ========================================================================== */
function initStatusTracker() {
  const checkBtn = document.getElementById("btnCheckStatus");
  const modal = document.getElementById("statusModal");
  const searchInput = document.getElementById("statusSearchInput");
  const resultContainer = document.getElementById("statusSearchResult");

  window.openStatusModal = function() {
    modal?.classList.add("active");
    document.body.style.overflow = "hidden";
    if (resultContainer) resultContainer.innerHTML = "";
    if (searchInput) {
      searchInput.value = "";
      setTimeout(() => searchInput.focus(), 100);
    }
  };

  window.trackApplication = function() {
    const query = searchInput?.value.trim();
    if (!query) {
      showToast("Please enter Mobile Number or Application Reference Number", "error");
      return;
    }

    // Try finding by ID first, then mobile
    let student = StorageManager.findById(query);
    if (!student) {
      student = StorageManager.findByMobile(query);
    }

    if (!student) {
      resultContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">
          <p style="color: #e11d48; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">No Application Found</p>
          <p style="font-size: 0.85rem; color: #475569;">No registered application matches "${query}". Please check your 10-digit mobile number or Reference ID.</p>
          <p style="font-size: 0.8rem; margin-top: 0.75rem; color: #64748b;">Need help? Call Center In-charge Manikanta at <strong>7396538004</strong>.</p>
        </div>
      `;
      return;
    }

    // Render Status Timeline
    const isApproved = student.status === "Approved" || student.status === "Enrolled";
    const isInReview = student.status === "In-Review" || isApproved;
    const isEnrolled = student.status === "Enrolled";

    resultContainer.innerHTML = `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h4 style="font-size: 1.15rem; color: #002B49; margin-bottom: 2px;">${student.fullName}</h4>
            <span style="font-family: monospace; font-size: 0.82rem; color: #0284c7; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">Ref: ${student.id}</span>
          </div>
          <span class="badge-status ${student.status.toLowerCase().replace(/\s+/g, '-')}">${student.status}</span>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <p style="font-size: 0.88rem; color: #475569; margin-bottom: 0.25rem;"><strong>Course:</strong> ${student.course}</p>
          <p style="font-size: 0.88rem; color: #475569; margin-bottom: 0.25rem;"><strong>Registered Date:</strong> ${new Date(student.registeredAt).toLocaleDateString()}</p>
          <p style="font-size: 0.88rem; color: #475569; margin-bottom: 0.25rem;"><strong>Hostel / Food Required:</strong> ${student.accommodation} / ${student.food}</p>
          ${student.remarks ? `<div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 0.5rem 0.75rem; margin-top: 0.5rem; font-size: 0.82rem; color: #334155;"><strong>Center Update:</strong> ${student.remarks}</div>` : ''}
        </div>

        <!-- Timeline Steps -->
        <div style="position: relative; padding-left: 1.5rem; border-left: 2px solid #cbd5e1; margin-left: 0.5rem;">
          <div style="margin-bottom: 1.25rem; position: relative;">
            <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: #16a34a; border: 2px solid #fff;"></div>
            <strong style="font-size: 0.85rem; color: #16a34a;">1. Application Submitted</strong>
            <p style="font-size: 0.75rem; color: #64748b;">Registration received and queued in institute portal.</p>
          </div>

          <div style="margin-bottom: 1.25rem; position: relative;">
            <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${isInReview ? '#16a34a' : '#cbd5e1'}; border: 2px solid #fff;"></div>
            <strong style="font-size: 0.85rem; color: ${isInReview ? '#16a34a' : '#64748b'};">2. Document & Eligibility Verification</strong>
            <p style="font-size: 0.75rem; color: #64748b;">Qualification & Age verification by Center In-charge Manikanta.</p>
          </div>

          <div style="margin-bottom: 1.25rem; position: relative;">
            <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${isApproved ? '#16a34a' : '#cbd5e1'}; border: 2px solid #fff;"></div>
            <strong style="font-size: 0.85rem; color: ${isApproved ? '#16a34a' : '#64748b'};">3. Admission Approval & Kit Allocation</strong>
            <p style="font-size: 0.75rem; color: #64748b;">Uniform, Study Kit, Bag, Cap & Hostel Room allotment.</p>
          </div>

          <div style="position: relative;">
            <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${isEnrolled ? '#16a34a' : '#cbd5e1'}; border: 2px solid #fff;"></div>
            <strong style="font-size: 0.85rem; color: ${isEnrolled ? '#16a34a' : '#64748b'};">4. Class Batch Commencement</strong>
            <p style="font-size: 0.75rem; color: #64748b;">Attendance start at Guntupalli Training Center.</p>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: right;">
          <button type="button" class="topbar-btn" style="background: #002B49;" onclick="showAcknowledgmentSlip(${JSON.stringify(student).replace(/"/g, '&quot;')})">
            View / Print Acknowledgment Slip
          </button>
        </div>
      </div>
    `;
  };
}

/* ==========================================================================
   COURSE DETAILS MODAL
   ========================================================================== */
const COURSE_DETAILS_DATA = {
  comm: {
    title: "Communication Skills Training",
    badge: "Employability Core Track",
    duration: "90 Hours (Interactive Sessions)",
    tagline: "Build fluent English speaking, executive communication, and workplace confidence.",
    modules: [
      "Spoken English & Pronunciation Mastery: Phonetics, daily vocabulary, accents and situational conversations.",
      "English Communication at Work: Formal email writing, presentations, client interactions, meeting protocols.",
      "Public Speaking & Debate: Overcoming stage fear, extempore speaking, vocal modulation, storytelling.",
      "Interview Communication: Self-introduction pitching, answering HR & behavioral queries, situational responses.",
      "Professional Etiquette & Body Language: Eye contact, handshakes, posture, virtual conference conduct.",
      "Personality Development: Self-esteem building, active listening, emotional intelligence, attitude shaping."
    ],
    outcomes: "Students become articulate, confident speakers capable of clearing MNC & corporate interview screening rounds with ease."
  },
  soft: {
    title: "Soft Skills Training",
    badge: "Leadership & Work Culture",
    duration: "75 Hours (Workshop & Activity Based)",
    tagline: "Transform into a team leader with workplace agility, discipline, and emotional poise.",
    modules: [
      "Leadership Skills: Decision making, problem-solving simulations, motivating peers, taking initiatives.",
      "Teamwork & Synergy: Group activities, trust-building exercises, collaboration across diverse teams.",
      "Time Management & Productivity: Eisenhower matrix, daily prioritization, meeting tight project deadlines.",
      "Professional Workplace Behaviour: Ethics, integrity, POSH awareness, corporate culture adaptation.",
      "Mock Interviews & Grooming: Live camera recordings, constructive feedback, resume tailoring.",
      "Confidence & Stress Management: Resilience exercises, conflict resolution, mental composure."
    ],
    outcomes: "Prepares trainees to excel in fast-paced corporate environments, adapt swiftly, and retain employment."
  },
  msoffice: {
    title: "Computer Knowledge and MS Office Training",
    badge: "Digital Workplace Literacy",
    duration: "120 Hours (Hands-on Lab Practice)",
    tagline: "Comprehensive mastery of computer operations, Microsoft 365, spreadsheets, and internet tools.",
    modules: [
      "Basic Computer Fundamentals: OS navigation, typing speed drills (30+ WPM), file management, peripherals.",
      "Microsoft Word: Document creation, official letters, formatting, tables, mail merge, report drafting.",
      "Microsoft Excel: Data entry, formulas (SUM, AVERAGE, IF, VLOOKUP, XLOOKUP), pivot tables, charts, sorting.",
      "Microsoft PowerPoint: Professional slide decks, transitions, animation, corporate pitch decks.",
      "Internet & Email Usage: Gmail etiquette, Google Drive, cloud storage, calendar scheduling, web research.",
      "Office Operations & Printing: Scanning documents, PDF manipulation, cyber security best practices."
    ],
    outcomes: "Qualifies students for back-office, data entry, clerical, executive assistant, and documentation jobs."
  },
  it: {
    title: "IT Training (Information Technology)",
    badge: "Technical Foundation Track",
    duration: "150 Hours (Intensive Lab & Practical Projects)",
    tagline: "Practical IT skills, hardware fundamentals, networking basics, and software tools for technical roles.",
    modules: [
      "IT Fundamentals & Architecture: CPU, RAM, storage, operating systems (Windows & Linux basics).",
      "Computer Hardware & Troubleshooting: Assembling PCs, diagnosing hardware faults, driver installations.",
      "Networking & Internet Essentials: IP addresses, routers, LAN cabling, Wi-Fi security, basic switch setup.",
      "Practical Software Skills: Software installation, system recovery, antivirus deployment, command line.",
      "Introduction to IT Careers: IT Helpdesk, Technical Support, Hardware Maintenance, CRM tools.",
      "Practical Computer Training: Live lab simulations, ticketing systems, remote desktop assistance."
    ],
    outcomes: "Equips candidates for entry-level IT Support Engineer, Hardware Technician, and Desk Support roles."
  }
};

function initCourseModals() {
  window.openCourseModal = function(courseKey) {
    const modal = document.getElementById("courseDetailsModal");
    const container = document.getElementById("courseModalBody");
    const data = COURSE_DETAILS_DATA[courseKey];
    if (!modal || !data || !container) return;

    container.innerHTML = `
      <div style="padding: 2rem;">
        <span class="course-badge" style="background:#e0f2fe; color:#0284c7; margin-bottom: 0.5rem;">${data.badge}</span>
        <h3 style="font-size: 1.6rem; color: #002B49; margin-bottom: 0.35rem;">${data.title}</h3>
        <p style="font-size: 0.9rem; color: #f97316; font-weight: 700; margin-bottom: 1rem;">Duration: ${data.duration} | 100% Free</p>
        <p style="font-size: 0.95rem; color: #475569; margin-bottom: 1.5rem; line-height: 1.6;">${data.tagline}</p>

        <h4 style="font-size: 1.05rem; color: #002B49; margin-bottom: 0.75rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.4rem;">Course Syllabus & Modules Covered:</h4>
        <ul style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem;">
          ${data.modules.map(mod => `
            <li style="display: flex; gap: 0.65rem; align-items: flex-start; font-size: 0.88rem; color: #334155;">
              <span style="color: #10b981; font-weight: bold; flex-shrink: 0;">✓</span>
              <span>${mod}</span>
            </li>
          `).join('')}
        </ul>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <h5 style="color: #15803d; font-size: 0.88rem; margin-bottom: 0.25rem;">Expected Career Outcome:</h5>
          <p style="font-size: 0.82rem; color: #166534;">${data.outcomes}</p>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <a href="#registration" class="btn-nav-register" onclick="closeModal('courseDetailsModal'); selectCourseInForm('${data.title}')">
            Enroll in This Course (Free)
          </a>
          <button type="button" class="topbar-btn" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;" onclick="closeModal('courseDetailsModal')">
            Close
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };
}

function selectCourseInForm(courseName) {
  const select = document.getElementById("interestedCourse");
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(courseName) || select.options[i].value.includes(courseName)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
}

/* ==========================================================================
   MODAL UTILITIES & TOASTS
   ========================================================================== */
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

// Close modal if user clicks outside modal-content-card
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "";
  }
});

function showToast(message, type = "info") {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;

  toast.textContent = message;
  toast.style.background = type === "error" ? "#dc2626" : type === "success" ? "#16a34a" : "#0f172a";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
}

function initScrollEffects() {
  // Reveal elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated-visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".facility-card, .course-card, .placement-card, .stat-box").forEach(el => {
    observer.observe(el);
  });
}
