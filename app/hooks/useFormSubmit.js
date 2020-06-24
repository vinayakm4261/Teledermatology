import { useCallback } from 'react';

import translate from '../locales/translate';

const parseError = ({ type }) => {
  throw translate(`error.${type}`);
};

const useFormSubmit = ({
  values,
  formatValues = (v) => v,
  setSubmitting,
  onSubmit,
  onSubmitSuccess,
  onSubmitFail,
}) => {
  return useCallback(() => {
    setSubmitting && setSubmitting(true);
    onSubmit(formatValues(values))
      .then(onSubmitSuccess)
      .catch(parseError)
      .catch(onSubmitFail)
      .finally(() => setSubmitting && setSubmitting(false));
  }, [
    values,
    formatValues,
    setSubmitting,
    onSubmit,
    onSubmitSuccess,
    onSubmitFail,
  ]);
};

export default useFormSubmit;
