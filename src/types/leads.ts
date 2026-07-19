export interface QuoteLead {
  id: string;
  referenceCode: string;
  categories: string[];
  industry: string;
  quantity: string;
  timeline: string;
  contactName: string;
  organization: string;
  email: string;
  phone: string;
  location: string;
  details: string;
  status: string;
  emailStatus: string;
  createdAt: string;
}

export interface NotifyLead {
  id: string;
  referenceCode: string;
  productId: string | null;
  productTitle: string;
  email: string;
  phone: string;
  status: string;
  emailStatus: string;
  createdAt: string;
}
