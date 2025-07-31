export const showSuccess = (setSuccessMessage, message) => {
  setSuccessMessage(message);
  setTimeout(() => {
    setSuccessMessage('');
  }, 3000); // 3 seconds
};

export const showError = (setError, message) => {
  setError(message);
  setTimeout(() => {
    setError('');
  }, 4000);
};
