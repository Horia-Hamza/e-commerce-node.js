import { roles } from '../../middleWare/authentication.js';

export const endPoint = {
    add: [roles.User, roles.Admin]
}