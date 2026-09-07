// Institutions verified via public sources (official sites, hospital pages, and established
// Pakistani doctor directories) as of 2026. Contact details, staff, and services can change -
// confirm directly with the provider before relying on this list. This is not exhaustive and
// does not constitute an endorsement.
export type Provider = {
  name: string;
  city: string;
  type: "Public hospital" | "Private hospital" | "NGO / community clinic";
  note: string;
  link: string;
};

export const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", "Multan", "Faisalabad", "Quetta", "Hyderabad"] as const;
export type City = (typeof CITIES)[number];

export const providers: Provider[] = [
  { name: "Karwan-e-Hayat, Institute for Mental Health Care", city: "Karachi", type: "NGO / community clinic", note: "Psychiatric treatment, psychological services, and rehabilitation care.", link: "https://keh.org.pk/" },
  { name: "Civil Hospital Karachi - Department of Psychiatry", city: "Karachi", type: "Public hospital", note: "Psychiatric inpatient, outpatient, and acute care for adults, adolescents, and children.", link: "https://chk.gov.pk/departments/psychiatry.php" },
  { name: "Karachi Psychiatric Hospital, Quaidabad", city: "Karachi", type: "Private hospital", note: "General psychiatric hospital with outpatient consultation.", link: "https://instacare.pk/hospitals/karachi/quaidabad/karachi-psychiatric-hospital-quaidabad" },
  { name: "Fountain House Lahore (Lahore Mental Health Association)", city: "Lahore", type: "NGO / community clinic", note: "Community-based psychosocial rehabilitation and a free outpatient department with psychiatric/psychological consultation, particularly for low-income patients.", link: "https://www.fountainhouse.com.pk/" },
  { name: "Institute of Psychiatry, Rawalpindi Medical University (Benazir Bhutto Hospital)", city: "Rawalpindi", type: "Public hospital", note: "One of Pakistan's largest psychiatric institutes and a WHO Collaborating Centre for Mental Health Research & Training.", link: "https://rmur.edu.pk/institute-of-psychiatry/" },
  { name: "Pakistan Institute of Mental Health (PIMH)", city: "Rawalpindi", type: "Private hospital", note: "Psychiatry, addiction rehabilitation, and related mental-health services.", link: "https://pimh.pk/" },
  { name: "PIMS - Department of Psychiatry", city: "Islamabad", type: "Public hospital", note: "Psychiatry department at a major public tertiary-care hospital.", link: "https://pims.gov.pk/Psychiatry.php" },
  { name: "Peshawar General Hospital - Department of Psychiatry", city: "Peshawar", type: "Public hospital", note: "Public hospital psychiatry department.", link: "https://pgh.com.pk/department/psychiatry/" },
  { name: "National Psychiatric Hospital & Drug Rehab Center", city: "Multan", type: "Private hospital", note: "Psychiatric care and drug rehabilitation.", link: "https://healthwire.pk/hospitals/multan/national-psychiatric-hospital" },
];

export function getProvidersForCity(city: string): Provider[] {
  return providers.filter((provider) => provider.city === city);
}

const DIRECTORY_BASE = {
  oladoc: (city: string, specialty: "psychiatrist" | "psychologist") => `https://oladoc.com/pakistan/${city.toLowerCase()}/${specialty}`,
  marham: (city: string, specialty: "psychiatrist" | "psychologist") => `https://www.marham.pk/doctors/${city.toLowerCase()}/${specialty}`,
};

export function getDirectoryLinks(city: string) {
  return [
    { name: "oladoc.com", psychiatristUrl: DIRECTORY_BASE.oladoc(city, "psychiatrist"), psychologistUrl: DIRECTORY_BASE.oladoc(city, "psychologist") },
    { name: "Marham.pk", psychiatristUrl: DIRECTORY_BASE.marham(city, "psychiatrist"), psychologistUrl: DIRECTORY_BASE.marham(city, "psychologist") },
  ];
}
