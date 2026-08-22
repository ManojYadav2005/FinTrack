// Simple HTML email template generator replacing the JSX one
export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  const baseStyles = `
    body { font-family: -apple-system, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px; }
    .container { background-color: #ffffff; margin: 0 auto; max-width: 600px; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
    .title { color: #1f2937; font-size: 32px; font-weight: bold; text-align: center; margin: 0 0 20px; }
    .text { color: #4b5563; font-size: 16px; margin: 0 0 16px; }
    .heading { color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px; }
    .stats-container { margin: 32px 0; padding: 20px; background-color: #f9fafb; border-radius: 5px; }
    .stat { margin-bottom: 16px; padding: 12px; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
    .footer { color: #6b7280; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
  `;

  if (type === "monthly-report") {
    // Generate insights html if provided
    let insightsHtml = "";
    if (data?.insights?.length) {
      insightsHtml = `
        <div style="margin-top: 32px; padding: 20px; background-color: #f9fafb; border-radius: 5px; border: 1px solid #e5e7eb;">
          <h3 class="heading">Wealth Insights</h3>
          ${data.insights.map((insight) => `<p class="text">• ${insight}</p>`).join("")}
        </div>
      `;
    }

    // Generate categories html if provided
    let categoriesHtml = "";
    if (data?.stats?.byCategory) {
      categoriesHtml = `
        <div style="margin-top: 32px; padding: 20px; background-color: #f9fafb; border-radius: 5px; border: 1px solid #e5e7eb;">
          <h3 class="heading">Expenses by Category</h3>
          ${Object.entries(data.stats.byCategory)
            .map(
              ([category, amount]) => `
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span class="text">${category}</span>
                <span class="text">₹${amount}</span>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <h1 class="title">Monthly Financial Report</h1>
            <p class="text">Hello ${userName},</p>
            <p class="text">Here's your financial summary for ${data?.month}:</p>
            
            <div class="stats-container">
              <div class="stat">
                <p class="text">Total Income</p>
                <h2 class="heading">₹${data?.stats?.totalIncome || 0}</h2>
              </div>
              <div class="stat">
                <p class="text">Total Expenses</p>
                <h2 class="heading">₹${data?.stats?.totalExpenses || 0}</h2>
              </div>
              <div class="stat">
                <p class="text">Net</p>
                <h2 class="heading">₹${(data?.stats?.totalIncome || 0) - (data?.stats?.totalExpenses || 0)}</h2>
              </div>
            </div>

            ${categoriesHtml}
            ${insightsHtml}

            <p class="footer">Thank you for using FinTrack. Keep tracking your finances for better financial health!</p>
          </div>
        </body>
      </html>
    `;
  }

  if (type === "budget-alert") {
    return `
      <!DOCTYPE html>
      <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <h1 class="title">Budget Alert</h1>
            <p class="text">Hello ${userName},</p>
            <p class="text">You've used ${(data?.percentageUsed || 0).toFixed(1)}% of your monthly budget.</p>
            
            <div class="stats-container">
              <div class="stat">
                <p class="text">Budget Amount</p>
                <h2 class="heading">₹${data?.budgetAmount || 0}</h2>
              </div>
              <div class="stat">
                <p class="text">Spent So Far</p>
                <h2 class="heading">₹${data?.totalExpenses || 0}</h2>
              </div>
              <div class="stat">
                <p class="text">Remaining</p>
                <h2 class="heading">₹${(data?.budgetAmount || 0) - (data?.totalExpenses || 0)}</h2>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  return "";
}
