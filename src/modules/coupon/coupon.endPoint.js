import { roles } from '../../middleWare/authentication.js';

export const endPoint = {
    create: [roles.Admin],
    update: [roles.Admin],
    delete: [roles.Admin]
}