import { Roles } from 'src/users/users.entity';
import { SetMetadata } from '@nestjs/common';
export const KEY_ROLES = 'roles';
// Декоратор @HashRoles

export const HashRoles = (...roles: Roles[]) => SetMetadata(KEY_ROLES, roles);



