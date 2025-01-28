export type Properties = {
  address: {
    city: null | string;
    display: string;
    location: { x: number; y: number } | null;
  };
  id: number;
  name: string;
};

export type VendorRfqRes = {
  attachments: string[];
  cancelled: null | string; // Date string
  cancelMessage: null | string;
  contactDetails: null | string;
  deadline: string;
  distanceToVendorByPropertyId: Record<string, { unit: string; value: number } | null>;
  endDate: null | string;
  enterprise?: {
    company: string;
    complianceEnabled: boolean;
    id: number;
    logo: {
      url: string;
    };
    pricingRate?: number;
    vmsConfigured: boolean;
    vmsEnabled: boolean;
  };
  enterpriseCompliance?: {
    isCurrentVersion: boolean;
    requiredItem: {
      coinsurance: boolean;
      healthAndSafetyManual: boolean;
    };
  };
  estimatedAwardDate: null | string;
  estimatedAwardDateSeen: null | string;
  id: number;
  lineItems: Array<{
    created: string;
    description: null | string;
    id: number;
    interval?: null | number;
    interval_unit?: null | string;
    pricing_unit?: null | string;
    quantity?: null | number;
    title?: null | string;
  }>;
  lineItemsUpdated: null | string;
  locale: {
    countryCode: string;
    currencyCode: string;
  };
  message?: string;
  notes: null | string;
  pm: {
    company: string;
    id: number;
    name: string;
  };
  pricingDocuments?: string[];
  properties: Properties[];
  public: boolean;
  serviceType: string;
  siteVisitDetails: null | string;
  siteVisitIsRequired: boolean;
  startDate: string;
  status?: 'planning_and_budgeting' | 'ready_to_hire';
  title: string;
  vmsEnabled: boolean;
};
