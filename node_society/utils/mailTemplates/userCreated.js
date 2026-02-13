exports.userCreatedTemplate = ({ name, email }) => {
    return `
    <div style="font-family:Arial,sans-serif">
      <h2>Welcome to Society Management System</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>Your account has been created successfully.</p>

      <p><b>Login Email:</b> ${email}</p>

      <p>Please login and change your password after first login.</p>

      <br/>
      <p>Regards,<br/>Society Admin</p>
    </div>
  `;
};
