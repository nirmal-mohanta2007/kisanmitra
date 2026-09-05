// Complete Administrative Data of India: All 28 States, 8 Union Territories, and all Districts

export const ALL_INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const ALL_INDIA_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
    'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
    'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam',
    'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati',
    'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Itanagar Capital Complex',
    'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley',
    'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi',
    'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang',
    'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat',
    'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong',
    'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
    'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
    'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
    'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani',
    'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
    'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
    'Vaishali', 'West Champaran'
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
    'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
    'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh', 'Kondagaon', 'Korba', 'Koriya',
    'Mahasamund', 'Manendragarh', 'Mohla-Manpur', 'Mungeli', 'Narayanpur', 'Raigarh',
    'Raipur', 'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 'Sukma', 'Surajpur', 'Surguja'
  ],
  'Goa': [
    'North Goa', 'South Goa'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar',
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
    'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
    'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh',
    'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa',
    'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma',
    'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj',
    'Saraikela Kharsawan', 'Simdega', 'West Singhbhum'
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
    'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
    'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu',
    'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
    'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
    'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia',
    'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)',
    'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Maihar', 'Mandla',
    'Mandsaur', 'Mauganj', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Pandhurna',
    'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore',
    'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli',
    'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur',
    'Chhatrapati Sambhaji Nagar', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon',
    'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani', 'Pune',
    'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane',
    'Wardha', 'Washim', 'Yavatmal'
  ],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
    'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
    'Tengnoupal', 'Thoubal', 'Ukhrul'
  ],
  'Meghalaya': [
    'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
    'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
    'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
  ],
  'Mizoram': [
    'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei',
    'Mamit', 'Saiha', 'Saitual', 'Serchhip'
  ],
  'Nagaland': [
    'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon',
    'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha', 'Koraput', 'Malkangiri',
    'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
    'Subarnapur (Sonepur)', 'Sundargarh'
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
    'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
    'Malerkotla', 'Mansa', 'Moga', 'Mohali (SAS Nagar)', 'Muktsar', 'Nawanshahr (SBS Nagar)',
    'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Tarn Taran'
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar',
    'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
    'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Dungarpur', 'Gangapur City',
    'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar',
    'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara',
    'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh',
    'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi',
    'Sri Ganganagar', 'Tonk', 'Udaipur'
  ],
  'Sikkim': [
    'Gangtok', 'Geyzing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
    'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
    'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
    'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
    'Viluppuram', 'Virudhunagar'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam',
    'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
    'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
    'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
    'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
  ],
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
    'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
    'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
    'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau',
    'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
    'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
    'Sultanpur', 'Unnao', 'Varanasi'
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
  ],
  // Union Territories
  'Andaman and Nicobar Islands': [
    'Nicobars', 'North and Middle Andaman', 'South Andaman'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli', 'Daman', 'Diu'
  ],
  'Delhi (NCT)': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu',
    'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri',
    'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
  ],
  'Ladakh': [
    'Kargil', 'Leh'
  ],
  'Lakshadweep': [
    'Lakshadweep'
  ],
  'Puducherry': [
    'Karaikal', 'Mahe', 'Puducherry', 'Yanam'
  ]
};

// Popular agricultural blocks, tehsils and villages mapped by key districts
export const COMMON_VILLAGES_BY_DISTRICT: Record<string, string[]> = {
  // Madhya Pradesh
  'Bhopal': ['Berasia', 'Phanda Kalan', 'Phanda Khurd', 'Huzur', 'Bairagarh Kalan', 'Mugaliya Chhap', 'Islamnagar', 'Kolar Gram', 'Karond', 'Tara Sevania', 'Eithkhedi', 'Gunaga'],
  'Indore': ['Depalpur', 'Sanwer', 'Mhow', 'Hatod', 'Manpur', 'Betma', 'Rau Gram', 'Kshipra', 'Mangliya', 'Kanadia', 'Palda', 'Gautampura'],
  'Jabalpur': ['Sihora', 'Patan', 'Kundam', 'Barela', 'Shahpura', 'Panagar', 'Majholi', 'Katangi', 'Bargi Gram', 'Belkheda', 'Goshalpur'],
  'Gwalior': ['Bhitarwar', 'Dabra', 'Morar Gram', 'Ghatigaon', 'Chinor', 'Pichhore', 'Antari', 'Hastinapur', 'Mohna', 'Barai', 'Bilaua'],
  'Ujjain': ['Badnagar', 'Mahidpur', 'Tarana', 'Khachrod', 'Nagda Gram', 'Ghattia', 'Unhel', 'Tajpur', 'Kayatha', 'Rupeta', 'Bhatpachlana'],
  'Rewa': ['Mauganj Gram', 'Teonthar', 'Sirmour', 'Hanumana', 'Naigarhi', 'Mangawan', 'Semariya', 'Gurh', 'Govindgarh Gram', 'Jawa', 'Raipur Karchuliyan'],
  'Hoshangabad (Narmadapuram)': ['Itarsi Gram', 'Pipariya', 'Babai (Makhan Nagar)', 'Sohagpur', 'Seoni Malwa', 'Bankhedi', 'Dolariya', 'Kesla', 'Sukhtawa', 'Semri Harchand'],
  'Sehore': ['Ashta', 'Ichhawar', 'Budhni', 'Nasrullaganj (Bhairunda)', 'Jawar', 'Rehti', 'Shyampur', 'Doraha', 'Bilkisganj', 'Maina'],

  // Odisha
  'Cuttack': ['Banki', 'Athagarh', 'Baramba', 'Tigiria', 'Salepur', 'Nischintakoili', 'Mahanga', 'Choudwar Gram', 'Badamba', 'Kantapada', 'Niali'],
  'Khordha': ['Jatni Gram', 'Begunia', 'Bolagarh', 'Banapur', 'Tangi', 'Chilika', 'Balianta', 'Balipatna', 'Khordha Sadar', 'Pitapalli'],
  'Sambalpur': ['Rengali', 'Kuchinda', 'Redhakhol', 'Jujumura', 'Dhankauda', 'Maneswar', 'Bamra', 'Jamankira', 'Naktideul'],
  'Balasore': ['Soro', 'Jaleswar', 'Basta', 'Nilagiri', 'Bahanaga', 'Remuna', 'Simulia', 'Khaira', 'Baliapal', 'Bhograi'],
  'Bargarh': ['Attabira', 'Bheden', 'Barpali', 'Padampur', 'Sohela', 'Bijepur', 'Bhatli', 'Ambabhona', 'Paikmal', 'Jharbandh'],
  'Ganjam': ['Chhatrapur Gram', 'Aska', 'Bhanjanagar', 'Hinjilicut', 'Polasara', 'Kabisuryanagar', 'Purushottampur', 'Digapahandi', 'Surada', 'Khallikote'],

  // Uttar Pradesh
  'Lucknow': ['Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Kakori', 'Chinhat Gram', 'Gosainganj', 'Sarojini Nagar', 'Itaunja', 'Amethi Dingur'],
  'Varanasi': ['Pindra', 'Arajiline', 'Kashi Vidyapeeth', 'Sevapuri', 'Harahua', 'Cholapur', 'Badagaon', 'Chiraigaon', 'Rameshwar', 'Phulpur Gram'],
  'Prayagraj': ['Meja', 'Karchhana', 'Phulpur', 'Soraon', 'Handia', 'Koraon', 'Bara', 'Mauaima', 'Holagarh', 'Shankargarh'],
  'Gorakhpur': ['Sahjanwa', 'Campierganj', 'Bansgaon', 'Chauri Chaura', 'Khajni', 'Pipraich', 'Barhalganj', 'Gola', 'Brahmpur', 'Sardarnagar'],
  'Agra': ['Etmadpur', 'Kheragarh', 'Bah', 'Fatehabad', 'Akola', 'Barauli Ahir', 'Bichpuri', 'Fatehpur Sikri Gram', 'Jagner', 'Pinahat'],
  'Kanpur Nagar': ['Bilhaur', 'Ghatampur', 'Kalyanpur Gram', 'Bhitargaon', 'Sarsaul', 'Bidhnu', 'Choubepur', 'Shivrajpur', 'Patara'],

  // Maharashtra
  'Pune': ['Haveli', 'Maval', 'Khed', 'Junnar', 'Ambegaon', 'Shirur', 'Baramati', 'Indapur', 'Daund', 'Bhor', 'Purandar', 'Mulshi'],
  'Nashik': ['Niphad', 'Dindori', 'Igatpuri', 'Sinnar', 'Yeola', 'Kalwan', 'Baglan (Satana)', 'Malegaon Gram', 'Chandwad', 'Nandgaon', 'Deola'],
  'Nagpur': ['Kamptee', 'Hingna', 'Saoner', 'Katol', 'Narkhed', 'Kalameshwar', 'Ramtek', 'Parseoni', 'Mouda', 'Umred', 'Kuhi', 'Bhiwapur'],
  'Chhatrapati Sambhaji Nagar': ['Gangapur', 'Paithan', 'Sillod', 'Soegaon', 'Kannad', 'Khuldabad', 'Vaijapur', 'Phulambri', 'Waluj'],

  // Punjab
  'Ludhiana': ['Dehlon', 'Machhiwara', 'Raikot', 'Samrala', 'Jagraon', 'Khanna Gram', 'Doraha', 'Sahnewal', 'Payal', 'Mullanpur Dakha', 'Sidhwan Bet'],
  'Amritsar': ['Ajnala', 'Baba Bakala', 'Attari', 'Jandiala Guru', 'Majitha', 'Verka', 'Chogawan', 'Harsha Chhina', 'Tarsikka', 'Rayya'],
  'Bathinda': ['Rampura Phul', 'Maur', 'Talwandi Sabo', 'Sardulgarh', 'Nathana', 'Bhagta Bhaika', 'Goniana', 'Sangat', 'Balianwali'],

  // Rajasthan
  'Jaipur': ['Sambhar', 'Chaksu', 'Phulera', 'Kotputli', 'Viratnagar', 'Jamwa Ramgarh', 'Bassi', 'Sanganer Gram', 'Amer Gram', 'Govindgarh', 'Shahpura Gram'],
  'Jodhpur': ['Shergarh', 'Bilara', 'Pipar City', 'Bhopalgarh', 'Luni', 'Osian', 'Balesar', 'Baori', 'Tiwri', 'Mandore Gram'],
  'Kota': ['Sangod', 'Itawa', 'Ramganj Mandi', 'Pipalda', 'Digod', 'Ladpura', 'Chechat', 'Mandana', 'Sultanpur Gram', 'Modak'],

  // Bihar
  'Patna': ['Barh', 'Fatuha', 'Masaurhi', 'Bikram', 'Paliganj', 'Danapur Gram', 'Bakhtiarpur', 'Mokama', 'Maner', 'Phulwari Sharif', 'Naubatpur'],
  'Muzaffarpur': ['Aurai', 'Bandra', 'Gaighat', 'Katra', 'Muraul', 'Kanti', 'Motipur', 'Marwan', 'Paroo', 'Sahebganj', 'Sakra'],
  'Gaya': ['Sherghati', 'Imamganj', 'Belaganj', 'Atri', 'Wazirganj', 'Bodh Gaya Gram', 'Tekari', 'Barachatti', 'Fatehpur', 'Manpur Gram'],

  // Haryana
  'Karnal': ['Indri', 'Nissing', 'Nilokheri', 'Gharaunda', 'Assandh', 'Kunjpura', 'Taraori', 'Jundla', 'Munak', 'Biana'],
  'Hisar': ['Hansi', 'Uklana', 'Narnaund', 'Agroha', 'Barwala', 'Adampur', 'Bass', 'Satrod', 'Khedar', 'Mundhal'],

  // Gujarat
  'Ahmedabad': ['Dholka', 'Dhandhuka', 'Sanand', 'Bavla', 'Mandal', 'Detroj', 'Viramgam', 'Dascroi', 'Dholera', 'Bareja'],
  'Rajkot': ['Gondal', 'Jetpur', 'Dhoraji', 'Upleta', 'Jasdan', 'Kotda Sangani', 'Lodhika', 'Paddhari', 'Vinchhiya'],

  // West Bengal
  'Murshidabad': ['Berhampore Gram', 'Lalgola', 'Raghunathganj', 'Jangipur', 'Domkal', 'Kandi', 'Beldanga', 'Hariharpara', 'Nabagram', 'Jalangi'],
  'Bardhaman': ['Kalna', 'Katwa', 'Memari', 'Raina', 'Jamalpur', 'Bhatar', 'Ausgram', 'Galsi', 'Monteswar', 'Purbasthali']
};

export function getDistrictsForState(stateName: string): string[] {
  return ALL_INDIA_DISTRICTS[stateName] || [];
}

export function getVillagesForDistrict(districtName: string): string[] {
  if (COMMON_VILLAGES_BY_DISTRICT[districtName]) {
    return COMMON_VILLAGES_BY_DISTRICT[districtName];
  }
  // Generic tehsils and agricultural gram panchayats for any selected district
  return [
    `${districtName} Rural / देहात`,
    `${districtName} Block-1 / खंड १`,
    `${districtName} Block-2 / खंड २`,
    'Gram Panchayat North / उत्तर',
    'Gram Panchayat South / दक्षिण',
    'Gram Panchayat East / पूर्व',
    'Gram Panchayat West / पश्चिम',
    'Kisan Seva Kendra Gram',
    'Adarsh Gram'
  ];
}
