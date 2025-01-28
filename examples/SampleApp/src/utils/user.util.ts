import { USER_ROLE } from '../model';

export function isVendor(user?: null | any) {
  return user ? user.vendor !== null : false;
}

export function isPm(user?: null | any) {
  return user ? user.pm !== null : false;
}

export const parseUserToUserTraits = (user: any) => {
  const { id, email, name, plan, profile_pic: avatar, role, verified } = user;

  const vendor = isVendor(user)
    ? {
        id: user.vendor.id,
        address: user.vendor.address,
        company: user.vendor.company,
        country: user.vendor.country,
        phone: user.vendor.phone,
        plan: plan,
      }
    : null;

  const pm = isPm(user)
    ? {
        id: user.pm.id,
        company: user.pm.company,
        enterprise: user.pm.leader
          ? {
              id: user.pm.enterprise_id,
            }
          : null,
        phone: user.pm.phone,
      }
    : null;

  return {
    id,
    avatar,
    email,
    name,
    pm,
    role: role === USER_ROLE.ENTERPRISE_LEADER ? 'enterprise' : role,
    vendor,
    verified,
  };
};
