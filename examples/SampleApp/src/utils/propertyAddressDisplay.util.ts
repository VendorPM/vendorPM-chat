import { AddressComps } from '../model';

interface VendorOrPmProperty {
  address: {
    address_comps?: AddressComps | unknown;
    city?: null | string;
    display: null | string;
  } | null;
}

export function getRfqHeaderPropertyTagProps(
  property: VendorOrPmProperty,
  restrictedAccess: boolean,
): [string | undefined] {
  const addressComps = property.address?.address_comps;

  const getPropertyAddressDisplay = () => {
    if (!restrictedAccess) {
      return property.address?.display;
    }

    if (addressComps && Object.keys(addressComps).length === 0) {
      return property.address?.display;
    }

    return undefined;
  };

  const addressDisplay = getPropertyAddressDisplay();
  const city = property.address?.city;

  const display = addressDisplay ?? city;

  return [display ?? ''];
}
