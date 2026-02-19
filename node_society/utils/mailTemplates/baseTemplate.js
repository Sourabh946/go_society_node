module.exports = ({ title, content, footerNote = '' }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 30px 0;
      background-color: #f3f4f6;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }

    .header {
      background: #2563eb;
      padding: 20px;
      color: #ffffff;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }

    .content {
      padding: 30px;
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
    }

    .content p {
      margin: 0 0 15px;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
    }

    .footer {
      background: #f9fafb;
      padding: 15px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Society Management System</h1>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        ${footerNote || '© ' + new Date().getFullYear() + ' Society App. All rights reserved.'}
      </div>
    </div>
  </div>
</body>
</html>
`