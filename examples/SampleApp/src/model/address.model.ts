type AddressName = {
  long_name: string;
  short_name: string;
};

export type AddressComps = {
  administrative_area_level_1?: AddressName;
  administrative_area_level_2?: AddressName;
  country?: AddressName;
  locality?: AddressName;
  postal_code?: AddressName;
  route?: AddressName;
  street_number?: AddressName;
  sublocality_level_1?: AddressName;
};

export type Address = {
  address_comps?: AddressComps;
  display: string;
  formatted_display?: string;
  id: string;
  location: Location;
};

export type Location =
  | {
      x: number;
      y: number;
    }
  | string;
