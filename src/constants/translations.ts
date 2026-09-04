export type TranslationKey = 
  | 'app_name'
  | 'select_centre'
  | 'select_crop'
  | 'enter_quantity'
  | 'book_visit'
  | 'your_token'
  | 'queue_position'
  | 'farmers_ahead'
  | 'estimated_wait'
  | 'recommended_arrival'
  | 'check_in'
  | 'weight_recorded'
  | 'quality_check'
  | 'procurement_complete'
  | 'receipt'
  | 'payment_status'
  | 'my_bookings'
  | 'no_bookings'
  | 'book_new'
  | 'view_details'
  | 'minutes'
  | 'quintals'
  | 'token_number'
  | 'action_required'
  | 'next_step'
  | 'demo_mode';

type Translations = Record<TranslationKey, string>;

export const en: Translations = {
  app_name: 'Kisan Mitra',
  select_centre: 'Select Procurement Centre',
  select_crop: 'Select Crop',
  enter_quantity: 'Enter Expected Quantity',
  book_visit: 'Book Visit',
  your_token: 'Your Token',
  queue_position: 'Queue Position',
  farmers_ahead: 'Farmers Ahead',
  estimated_wait: 'Estimated Wait',
  recommended_arrival: 'Recommended Arrival',
  check_in: 'Check In',
  weight_recorded: 'Weight Recorded',
  quality_check: 'Quality Check',
  procurement_complete: 'Procurement Complete',
  receipt: 'Receipt',
  payment_status: 'Payment Status',
  my_bookings: 'My Bookings',
  no_bookings: 'No bookings yet',
  book_new: 'Book New Visit',
  view_details: 'View Details',
  minutes: 'minutes',
  quintals: 'quintals',
  token_number: 'Token Number',
  action_required: 'Action Required',
  next_step: 'Next Step',
  demo_mode: 'Demo Mode',
};

export const hi: Translations = {
  app_name: 'किसान मित्र',
  select_centre: 'खरीद केंद्र चुनें',
  select_crop: 'फसल चुनें',
  enter_quantity: 'अनुमानित मात्रा दर्ज करें',
  book_visit: 'विज़िट बुक करें',
  your_token: 'आपका टोकन',
  queue_position: 'कतार में स्थिति',
  farmers_ahead: 'आगे किसान',
  estimated_wait: 'अनुमानित प्रतीक्षा',
  recommended_arrival: 'पहुँचने का सुझाव',
  check_in: 'चेक इन',
  weight_recorded: 'वज़न दर्ज',
  quality_check: 'गुणवत्ता जाँच',
  procurement_complete: 'खरीद पूर्ण',
  receipt: 'रसीद',
  payment_status: 'भुगतान स्थिति',
  my_bookings: 'मेरी बुकिंग',
  no_bookings: 'अभी कोई बुकिंग नहीं',
  book_new: 'नई विज़िट बुक करें',
  view_details: 'विवरण देखें',
  minutes: 'मिनट',
  quintals: 'क्विंटल',
  token_number: 'टोकन नंबर',
  action_required: 'कार्रवाई आवश्यक',
  next_step: 'अगला कदम',
  demo_mode: 'डेमो मोड',
};

export const or: Translations = {
  app_name: 'କିଷାନ ମିତ୍ର',
  select_centre: 'କ୍ରୟ କେନ୍ଦ୍ର (ମଣ୍ଡି) ବାଛନ୍ତୁ',
  select_crop: 'ଫସଲ ବାଛନ୍ତୁ',
  enter_quantity: 'ଆନୁମାନିକ ପରିମାଣ ଲେଖନ୍ତୁ',
  book_visit: 'ସ୍ଲଟ୍ ବୁକ୍ କରନ୍ତୁ',
  your_token: 'ଆପଣଙ୍କ ଟୋକନ୍',
  queue_position: 'ଧାଡ଼ିରେ ସ୍ଥିତି',
  farmers_ahead: 'ଆଗରେ ଚାଷୀ',
  estimated_wait: 'ଆନୁମାନିକ ଅପେକ୍ଷା ସମୟ',
  recommended_arrival: 'ପହଞ୍ଚିବାର ସମୟ',
  check_in: 'ଚେକ୍ ଇନ୍',
  weight_recorded: 'ଓଜନ ଦର୍ଜ ହେଲା',
  quality_check: 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
  procurement_complete: 'କ୍ରୟ ସମ୍ପୂର୍ଣ୍ଣ',
  receipt: 'ରସିଦ',
  payment_status: 'ଦେୟ ସ୍ଥିତି',
  my_bookings: 'ମୋ ବୁକିଂ',
  no_bookings: 'କୌଣସି ବୁକିଂ ନାହିଁ',
  book_new: 'ନୂତନ ସ୍ଲଟ୍ ବୁକ୍ କରନ୍ତୁ',
  view_details: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
  minutes: 'ମିନିଟ୍',
  quintals: 'କ୍ୱିଣ୍ଟାଲ',
  token_number: 'ଟୋକନ୍ ନମ୍ବର',
  action_required: 'ପଦକ୍ଷେପ ଆବଶ୍ୟକ',
  next_step: 'ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ',
  demo_mode: 'ଡେମୋ ମୋଡ୍',
};

/** Simple translation helper */
export function t(key: TranslationKey, lang: 'en' | 'hi' | 'or' = 'en'): string {
  if (lang === 'or') return or[key] || en[key];
  return lang === 'hi' ? hi[key] : en[key];
}
