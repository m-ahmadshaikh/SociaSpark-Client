import React, { useState } from 'react';

export default function useForm(initialState, callback) {
  const [values, setValues] = useState(initialState);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  function onSubmit(e) {
    e.preventDefault();
    callback();
  }
  return { onSubmit, values, changeHandler };
}
