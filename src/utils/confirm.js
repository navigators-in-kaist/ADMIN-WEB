import { createConfirmation } from 'react-confirm';
import Confirmation from "../common/confirmation/Confirmation";

const defaultConfirmation = createConfirmation(Confirmation);

// create syntax sugar for confrmation function.
// You can use `confirm('Are you sure?')` instead of `confirm({ confrmation: 'Are you sure? '})`
export function confirm(confirmation, options = {}) {
    return defaultConfirmation({ confirmation, ...options });
}