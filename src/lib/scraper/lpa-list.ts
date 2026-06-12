// ============================================================
// PlanningIntel AI — LPA Directory
// Contains real URLs for known LPA planning pages
// ============================================================

import { LpaInfo } from './types';

export const LPA_DIRECTORY: LpaInfo[] = [
  {
    id: 'leeds',
    name: 'Leeds City Council',
    region: 'Yorkshire and the Humber',
    websiteUrl: 'https://www.leeds.gov.uk',
    planPageUrl: 'https://www.leeds.gov.uk/planning/planning-policy',
    monitoringPageUrl: 'https://www.leeds.gov.uk/planning/planning-policy/local-plan-monitoring',
    callForSitesUrl: 'https://www.leeds.gov.uk/planning/planning-policy/local-plan/site-allocations-plan',
  },
  {
    id: 'birmingham',
    name: 'Birmingham City Council',
    region: 'West Midlands',
    websiteUrl: 'https://www.birmingham.gov.uk',
    planPageUrl: 'https://www.birmingham.gov.uk/planning',
    monitoringPageUrl: 'https://www.birmingham.gov.uk/localplanreview',
    callForSitesUrl: 'https://www.birmingham.gov.uk/callforsites',
  },
  {
    id: 'bristol',
    name: 'Bristol City Council',
    region: 'South West',
    websiteUrl: 'https://www.bristol.gov.uk',
    planPageUrl: 'https://www.bristol.gov.uk/planning-and-building-regulations/planning-policy',
    monitoringPageUrl: 'https://www.bristol.gov.uk/planning-and-building-regulations/local-plan-monitoring',
    callForSitesUrl: 'https://www.bristol.gov.uk/planning-and-building-regulations/call-for-sites',
  },
  {
    id: 'greater-manchester',
    name: 'Greater Manchester Combined Authority',
    region: 'North West',
    websiteUrl: 'https://www.greatermanchester-ca.gov.uk',
    planPageUrl: 'https://www.greatermanchester-ca.gov.uk/what-we-do/planning-and-housing/places-for-everyone',
    callForSitesUrl: undefined,
  },
  {
    id: 'cornwall',
    name: 'Cornwall Council',
    region: 'South West',
    websiteUrl: 'https://www.cornwall.gov.uk',
    planPageUrl: 'https://www.cornwall.gov.uk/planning-and-building-control/planning-policy',
    monitoringPageUrl: 'https://www.cornwall.gov.uk/planning-and-building-control/planning-policy/adopted-local-plan',
    callForSitesUrl: 'https://www.cornwall.gov.uk/planning-and-building-control/planning-policy/call-for-sites',
  },
  {
    id: 'essex',
    name: 'Essex County Council',
    region: 'East of England',
    websiteUrl: 'https://www.essex.gov.uk',
    planPageUrl: 'https://www.essex.gov.uk/planning',
    callForSitesUrl: 'https://www.essex.gov.uk/planning/minerals-and-waste-planning/call-for-sites',
  },
  {
    id: 'cambridgeshire',
    name: 'Cambridgeshire County Council',
    region: 'East of England',
    websiteUrl: 'https://www.cambridgeshire.gov.uk',
    planPageUrl: 'https://www.cambridgeshire.gov.uk/business/planning-and-development',
    callForSitesUrl: 'https://www.cambridgeshire.gov.uk/business/planning-and-development/call-for-sites',
  },
  // Additional LPAs for mock/simulated data
  ...generateMockLpas(),
];

function generateMockLpas(): LpaInfo[] {
  const regions = [
    'London', 'South East', 'North West', 'West Midlands',
    'East of England', 'South West', 'Yorkshire and the Humber',
    'East Midlands', 'North East',
  ];

  const lpaNames = [
    'Camden London Borough Council', 'Manchester City Council', 'Liverpool City Council',
    'Sheffield City Council', 'Nottingham City Council', 'Newcastle City Council',
    'Southwark Council', 'Tower Hamlets Council', 'Hackney Council',
    'Brighton & Hove City Council', 'Oxford City Council', 'Cambridge City Council',
    'Southampton City Council', 'Portsmouth City Council', 'Plymouth City Council',
    'Derby City Council', 'Leicester City Council', 'Stoke-on-Trent City Council',
    'Wolverhampton City Council', 'Coventry City Council', 'Sandwell Metropolitan Borough Council',
    'Dudley Metropolitan Borough Council', 'Walsall Council', 'Solihull Metropolitan Borough Council',
    'Wirral Council', 'Knowsley Metropolitan Borough Council', 'Sefton Council',
    'St Helens Council', 'Bolton Council', 'Bury Council',
    'Oldham Council', 'Rochdale Borough Council', 'Salford City Council',
    'Stockport Metropolitan Borough Council', 'Tameside Metropolitan Borough Council',
    'Trafford Council', 'Wigan Council', 'Barnsley Metropolitan Borough Council',
    'Doncaster Council', 'Rotherham Metropolitan Borough Council',
    'Bradford Metropolitan District Council', 'Calderdale Council', 'Kirklees Council',
    'Wakefield Council', 'York City Council', 'North Yorkshire Council',
    'East Riding of Yorkshire Council', 'Kingston upon Hull City Council',
    'Lincolnshire County Council', 'Norfolk County Council', 'Suffolk County Council',
  ];

  return lpaNames.map((name, i) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
    name,
    region: regions[i % regions.length],
    websiteUrl: `https://www.${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.gov.uk`,
  }));
}

export function getLpaById(id: string): LpaInfo | undefined {
  return LPA_DIRECTORY.find((l) => l.id === id);
}

export function getLpaByName(name: string): LpaInfo | undefined {
  return LPA_DIRECTORY.find((l) => l.name.toLowerCase() === name.toLowerCase());
}

export function getLpasByRegion(region: string): LpaInfo[] {
  return LPA_DIRECTORY.filter((l) => l.region === region);
}

export function hasRealUrl(lpa: LpaInfo): boolean {
  return !!(lpa.planPageUrl || lpa.monitoringPageUrl || lpa.callForSitesUrl);
}