const validate = (value, rules) => {
  let isValid = true;
	
	if (rules.required) {
		isValid = value.trim() !== '' && isValid;
  }
  if (rules.notEqualList) {
    isValid = !rules.notEqualList.includes(value.toUpperCase()) && isValid;
  }

	if (rules.number) {
		isValid = !Number.isNaN(value) && isValid;
	}
	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}
	if (rules.min) {
		isValid = value >= rules.min && isValid;
	}
	if (rules.max) {
		isValid = value <= rules.max && isValid;
	}
	return isValid;
};

export default validate;