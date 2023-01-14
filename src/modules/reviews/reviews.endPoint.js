import { roles } from '../../middleWare/authentication.js';

export const endPoint = {
    addReview: [roles.User , roles.Admin]
}