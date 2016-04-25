import React from 'react';

const styles = {
  display: 'block',
  position: 'absolute',
  top: -9999,
};

const FormSubmit = () => (
  <input
    style={styles}
    type="submit"
    value="submit"
  />
);

export default FormSubmit;
