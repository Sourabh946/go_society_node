const baseTemplate = require('./baseTemplate')

module.exports = ({ name }) =>
  baseTemplate({
    title: 'Email Updated',
    content: `
      <p>Hello <strong>${name}</strong>,</p>

      <p>Your email address was updated successfully.</p>

      <p>If this was not you, please contact the administrator immediately.</p>
    `
  })
