import API from '../config/API';
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

export default (route, request, payload) =>
  API({
    url: route,
    method: request,
    data: payload,
  })
    .then((response) => ({ response: response.data, error: null }))
    .catch((err) => {
      const { status = {} } = err.response || {};

      return {
        response: null,
        error: { type: responseCodeErrorMap[status], err },
      };
    });
