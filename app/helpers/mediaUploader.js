import RNFetchBlob from 'rn-fetch-blob';

import errorTypes from '../constants/errorTypes';
import defaultDict from './defaultDict';

const responseCodeErrorMap = defaultDict(
  {
    404: errorTypes.COMMON.INTERNAL_ERROR,
    500: errorTypes.COMMON.SERVER_ERROR,
    422: errorTypes.COMMON.INVALID_REQUEST,
    400: errorTypes.COMMON.INTERNAL_ERROR,
  },
  errorTypes.COMMON.NETWORK_ERROR,
);

export default (request, uri, authToken, data) =>
  RNFetchBlob.fetch(
    request,
    uri,
    {
      'Content-Type': 'multipart/form-data',
      authToken,
    },
    data,
  )
    .then((res) => res.json())
    .then((response) => ({ response, error: null }))
    .catch((err) => {
      const { status = {} } = err.response || {};

      return {
        response: null,
        error: { type: responseCodeErrorMap[status], err },
      };
    });
