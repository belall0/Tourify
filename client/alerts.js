const hideAlert = () => {
  const alterEl = document.querySelector('.alert');
  if (alterEl) alterEl.parentElement.removeChild(alterEl);
};

const showAlert = (type, message) => {
  hideAlert(); // Hide any existing alerts before showing new one
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  // Hide the newly created alert after 5 seconds
  window.setTimeout(hideAlert, 5000);
};

export default showAlert;
