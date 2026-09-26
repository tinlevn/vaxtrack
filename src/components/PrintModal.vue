<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
    <div class="modal-container" role="dialog" aria-label="Official Immunization Log Modal">
      <!-- Modal Header (Screen Only) -->
      <div class="modal-header screen-only">
        <div class="mh-title">
          <span class="mh-icon">🖨️</span>
          <div>
            <h3>Official Immunization Record Report</h3>
            <p>CDC/ACIP Pediatric Immunization Log Summary</p>
          </div>
        </div>
        <div class="mh-actions">
          <button class="print-btn" @click="handlePrint">
            🖨️ PRINT RECORD
          </button>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">✕</button>
        </div>
      </div>

      <!-- Printable Document Content -->
      <div class="printable-document">
        <!-- Document Header / Hospital Letterhead -->
        <div class="doc-header">
          <div class="dh-left">
            <h1 class="dh-hospital">PEDIATRIC HEALTH SERVICES</h1>
            <p class="dh-dept">Division of Pediatric Infectious Diseases & Preventive Care</p>
            <p class="dh-addr">100 Clinical Way, Suite 400 · Medical Center Log #VX-2404</p>
          </div>
          <div class="dh-right">
            <div class="doc-badge">OFFICIAL EMR REPORT</div>
            <div class="doc-date">Generated: {{ reportDate }}</div>
          </div>
        </div>

        <div class="doc-divider"></div>

        <!-- Patient Demographics Section -->
        <div class="patient-grid">
          <div class="pg-cell">
            <span class="pg-label">PATIENT FULL NAME</span>
            <span class="pg-val">{{ BABY.name }}</span>
          </div>
          <div class="pg-cell">
            <span class="pg-label">DATE OF BIRTH</span>
            <span class="pg-val">{{ fmtDate(BABY.dob) }}</span>
          </div>
          <div class="pg-cell">
            <span class="pg-label">CURRENT AGE</span>
            <span class="pg-val">{{ babyAgeLabel(BABY.dob) }}</span>
          </div>
          <div class="pg-cell">
            <span class="pg-label">RECORD STATUS</span>
            <span class="pg-val highlight">{{ doneVisits }} / {{ totalVisits }} Visits Completed ({{ progressPct }}%)</span>
          </div>
        </div>

        <!-- Immunization Ledger Table -->
        <div class="ledger-section">
          <h2 class="ledger-title">OFFICIAL IMMUNIZATION LEDGER</h2>

          <table class="ledger-table">
            <thead>
              <tr>
                <th>AGE / VISIT MILESTONE</th>
                <th>TARGET DATE</th>
                <th>PRESCRIBED VACCINES & DOSES</th>
                <th>STATUS</th>
                <th>DATE ADMINISTERED</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visit in visits" :key="visit.id" :class="visit.status">
                <td class="cell-visit">
                  <strong>{{ visit.ageLabel }}</strong>
                  <span class="visit-cohort">({{ visit.ageGroup }})</span>
                </td>
                <td class="cell-date">{{ fmtDateShort(visit.targetDate) }}</td>
                <td class="cell-vax">
                  <div class="vax-pills">
                    <span
                      v-for="vx in visit.vaccines"
                      :key="vx.key"
                      class="vax-tag"
                      :class="{ given: vx.given }"
                    >
                      {{ vx.key }} {{ vx.given ? '✓' : '' }}
                    </span>
                  </div>
                </td>
                <td class="cell-status">
                  <span class="status-text" :class="visit.status">
                    {{ visit.status.toUpperCase() }}
                  </span>
                </td>
                <td class="cell-admin">
                  <template v-if="visit.status === 'done'">
                    {{ visit.vaccines[0]?.dateGiven ? fmtDateShort(visit.vaccines[0].dateGiven) : 'RECORDED' }}
                  </template>
                  <template v-else-if="visit.status === 'overdue'">
                    <span class="text-danger">OVERDUE</span>
                  </template>
                  <template v-else>
                    <span class="text-muted">PENDING</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Notes Summary -->
        <div v-if="hasCustomNotes" class="notes-section">
          <h2 class="ledger-title">CLINICIAN & PARENT NOTES RECORD</h2>
          <div class="notes-list">
            <template v-for="visit in visits" :key="'note-' + visit.id">
              <div v-if="visit.customNote" class="note-item">
                <strong>{{ visit.ageLabel }} Visit Note:</strong> {{ visit.customNote }}
              </div>
            </template>
          </div>
        </div>

        <!-- Document Sign-off Footer -->
        <div class="doc-footer">
          <div class="df-col">
            <div class="df-sig-line"></div>
            <p class="df-label">Attending Pediatric Physician / Healthcare Provider</p>
          </div>
          <div class="df-col">
            <div class="df-sig-line"></div>
            <p class="df-label">Date & Medical License / Stamp</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchedule } from '@/composables/useSchedule.js'
import { fmtDate, fmtDateShort, babyAgeLabel } from '@/composables/useFormatters.js'
import { BABY } from '@/data/schedule.js'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { visits, totalVisits, doneVisits, progressPct } = useSchedule()

const reportDate = computed(() => fmtDate(new Date()))

const hasCustomNotes = computed(() => visits.some(v => v.customNote))

function closeModal() {
  emit('close')
}

function handlePrint() {
  window.print()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 13, 22, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: var(--clr-surface);
  border: 2px solid var(--clr-border-strong);
  box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--clr-primary);
  color: #fff;
  border-bottom: 1px solid var(--clr-border);
}

.mh-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.mh-title h3 { font-size: 16px; font-weight: 800; margin: 0; }
.mh-title p  { font-size: 11px; opacity: 0.85; margin: 0; }
.mh-icon { font-size: 22px; }

.mh-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.print-btn {
  background: #ffffff;
  color: var(--clr-primary);
  border: 1px solid #ffffff;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all .12s;
}
.print-btn:hover {
  background: var(--clr-primary-light);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  font-size: 14px;
  cursor: pointer;
}

.printable-document {
  padding: 24px;
  overflow-y: auto;
  color: var(--clr-text);
  background: var(--clr-surface);
}

/* Document styling */
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.dh-hospital {
  font-size: 18px;
  font-weight: 900;
  color: var(--clr-primary);
  letter-spacing: 0.05em;
}
.dh-dept { font-size: 12px; font-weight: 700; color: var(--clr-text-muted); }
.dh-addr { font-size: 11px; color: var(--clr-text-subtle); margin-top: 2px; }

.doc-badge {
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary);
  color: var(--clr-primary);
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  text-align: right;
  letter-spacing: 0.08em;
}
.doc-date { font-size: 11px; color: var(--clr-text-muted); margin-top: 4px; text-align: right; font-family: var(--font-mono); }

.doc-divider {
  height: 2px;
  background: var(--clr-border-strong);
  margin: 16px 0;
}

.patient-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: var(--clr-surface-muted);
  border: 1px solid var(--clr-border);
  padding: 12px;
  margin-bottom: 20px;
}
.pg-cell { display: flex; flex-direction: column; }
.pg-label { font-size: 9px; font-weight: 800; letter-spacing: 0.08em; color: var(--clr-text-subtle); }
.pg-val { font-size: 13px; font-weight: 800; color: var(--clr-text); }
.pg-val.highlight { color: var(--clr-primary); }

.ledger-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--clr-text-muted);
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--clr-border);
}

.ledger-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 20px;
}
.ledger-table th, .ledger-table td {
  border: 1px solid var(--clr-border);
  padding: 8px 10px;
  text-align: left;
}
.ledger-table th {
  background: var(--clr-surface-muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--clr-text-subtle);
}

.vax-pills { display: flex; flex-wrap: wrap; gap: 4px; }
.vax-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  color: var(--clr-text-muted);
}
.vax-tag.given {
  background: var(--clr-success-light);
  border-color: var(--clr-success-border);
  color: var(--clr-success-text);
}

.status-text {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
}
.status-text.done { color: var(--clr-success-text); }
.status-text.overdue { color: var(--clr-danger-text); }
.status-text.due-soon { color: var(--clr-warning-text); }
.status-text.upcoming { color: var(--clr-upcoming-text); }

.notes-section { margin-top: 16px; }
.notes-list { display: flex; flex-direction: column; gap: 6px; }
.note-item { font-size: 11px; color: var(--clr-text-muted); background: var(--clr-surface-muted); border: 1px solid var(--clr-border); padding: 8px 10px; }

.doc-footer {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
.df-col { flex: 1; }
.df-sig-line { height: 1px; background: var(--clr-border-strong); margin-bottom: 6px; }
.df-label { font-size: 10px; font-weight: 700; color: var(--clr-text-subtle); text-transform: uppercase; }

/* Media Print Overrides */
@media print {
  body * {
    visibility: hidden;
  }
  .modal-backdrop, .modal-backdrop * {
    visibility: visible;
  }
  .modal-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #fff !important;
    padding: 0;
  }
  .modal-container {
    border: none !important;
    box-shadow: none !important;
    max-width: 100% !important;
    max-height: none !important;
  }
  .screen-only {
    display: none !important;
  }
  .printable-document {
    padding: 0 !important;
    background: #fff !important;
    color: #000 !important;
  }
}
</style>
