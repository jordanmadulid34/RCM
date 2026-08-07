import { SubmittedApplication } from '../data/rcmMemberData';
import { formatReadableDate, formatReadableTime } from './dateUtils';

/**
 * Generates and triggers download/print of the official Rotary Club of Makati Interview Invitation
 */
export function downloadInterviewInvitationPDF(app: SubmittedApplication): void {
  const printableWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printableWindow) {
    alert('Please allow popups for this site to download/print the Interview Invitation.');
    return;
  }

  const interviewDateFormatted = formatReadableDate(app.interviewDate);
  const interviewTimeFormatted = formatReadableTime(app.interviewTime);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Official Interview Invitation — ${app.fullName} (${app.id})</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Open Sans', sans-serif;
          background-color: #f4f6f8;
          color: #1e293b;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
        }

        .invitation-card {
          width: 100%;
          max-width: 720px;
          background: #ffffff;
          border-radius: 16px;
          border: 2px solid #011E41;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .header-banner {
          background: linear-gradient(135deg, #01142E 0%, #011E41 50%, #0A2540 100%);
          color: #F8FAFC;
          padding: 32px;
          border-bottom: 5px solid #F7A81B;
          text-align: center;
        }

        .header-banner .rotary-badge {
          display: inline-block;
          background: #F7A81B;
          color: #01142E;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .header-banner h1 {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .header-banner p {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #cbd5e1;
        }

        .content-body {
          padding: 32px;
        }

        .candidate-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 5px solid #F7A81B;
          border-radius: 10px;
          padding: 18px 24px;
          margin-bottom: 24px;
        }

        .candidate-box .ref-id {
          font-family: monospace;
          color: #011E41;
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .candidate-box h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #011E41;
          margin-bottom: 4px;
        }

        .candidate-box p {
          font-size: 13px;
          color: #64748b;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .detail-item {
          background: #f1f5f9;
          border-radius: 10px;
          padding: 14px 18px;
        }

        .detail-item .label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #011E41;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .detail-item .value {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .instructions-box {
          background: #fffbe0;
          border: 1px solid #fde047;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 24px;
        }

        .instructions-box h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #854d0e;
          margin-bottom: 6px;
        }

        .instructions-box p {
          font-size: 12px;
          color: #713f12;
          line-height: 1.5;
        }

        .footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
        }

        .qr-placeholder {
          text-align: center;
          padding: 10px;
          border: 1px dashed #011E41;
          border-radius: 8px;
          background: #f8fafc;
          font-family: monospace;
          font-size: 10px;
          color: #011E41;
        }

        .no-print {
          margin-top: 20px;
          text-align: center;
        }

        .no-print button {
          background: #011E41;
          color: #F7A81B;
          border: none;
          padding: 12px 24px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          border-radius: 8px;
          cursor: pointer;
        }

        @media print {
          body {
            background: #ffffff;
            padding: 0;
          }
          .invitation-card {
            box-shadow: none;
            border: 1px solid #011E41;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div style="width: 100%; max-width: 720px;">
        <div class="invitation-card">
          <div class="header-banner">
            <div class="rotary-badge">Rotary Club of Makati — District 3830</div>
            <h1>Official Membership Interview Invitation</h1>
            <p>The Mother Club of Makati • Founded March 12, 1966 • Service Above Self</p>
          </div>

          <div class="content-body">
            <div class="candidate-box">
              <div class="ref-id">APPLICATION REF: ${app.id}</div>
              <h2>${app.fullName}</h2>
              <p>${app.classification || 'Business & Professional Classification'} • ${app.company || 'Organization'}</p>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="label">Interview Status</div>
                <div class="value" style="color: #0284c7;">${app.status}</div>
              </div>

              <div class="detail-item">
                <div class="label">Interview Week</div>
                <div class="value">${app.interviewWeek || 'Current Interview Week'}</div>
              </div>

              <div class="detail-item">
                <div class="label">Assigned Date</div>
                <div class="value">${interviewDateFormatted}</div>
              </div>

              <div class="detail-item">
                <div class="label">Assigned Time</div>
                <div class="value">${interviewTimeFormatted}</div>
              </div>

              <div class="detail-item">
                <div class="label">Interview Type</div>
                <div class="value">${app.interviewType || 'Face-to-Face'}</div>
              </div>

              <div class="detail-item">
                <div class="label">Attendance Status</div>
                <div class="value" style="color: #16a34a;">${app.attendanceStatus || 'Pending Confirmation'}</div>
              </div>

              ${
                app.venue
                  ? `
                <div class="detail-item full-width">
                  <div class="label">Venue / Meeting Location</div>
                  <div class="value">${app.venue}</div>
                </div>
              `
                  : ''
              }

              ${
                app.meetingLink
                  ? `
                <div class="detail-item full-width">
                  <div class="label">Virtual Meeting Link</div>
                  <div class="value" style="font-family: monospace; font-size: 12px; color: #2563eb; word-break: break-all;">
                    ${app.meetingLink}
                  </div>
                </div>
              `
                  : ''
              }

              ${
                app.meetingId
                  ? `
                <div class="detail-item">
                  <div class="label">Meeting ID</div>
                  <div class="value" style="font-family: monospace;">${app.meetingId}</div>
                </div>
              `
                  : ''
              }

              ${
                app.meetingPasscode
                  ? `
                <div class="detail-item">
                  <div class="label">Meeting Passcode</div>
                  <div class="value" style="font-family: monospace;">${app.meetingPasscode}</div>
                </div>
              `
                  : ''
              }
            </div>

            ${
              app.instructions || app.adminRemarks
                ? `
              <div class="instructions-box">
                <h3>Committee Instructions & Remarks</h3>
                <p>${app.instructions || app.adminRemarks}</p>
              </div>
            `
                : ''
            }

            <div class="footer">
              <div>
                <strong>Rotary Club of Makati Secretariat</strong><br />
                MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City<br />
                Email: secretariat@rotaryclubmakati.org • Phone: (632) 8997863
              </div>

              <div class="qr-placeholder">
                <div style="font-weight: bold;">RCM VERIFIED</div>
                <div>ID: ${app.id}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="no-print">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printableWindow.document.write(htmlContent);
  printableWindow.document.close();
}
