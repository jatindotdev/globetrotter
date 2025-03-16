import { db, sql } from "@/lib/db";
import * as schema from "./schema";

const initialData = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art.",
    ],
    funFacts: [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules.",
    ],
    trivia: [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia.",
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming.",
    ],
    funFacts: [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world.",
    ],
    trivia: [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies.",
    ],
  },
  {
    city: "New York",
    country: "USA",
    clues: [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters.",
    ],
    funFacts: [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904.",
    ],
    trivia: [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118.",
    ],
  },
  {
    city: "Rome",
    country: "Italy",
    clues: [
      "This city is built on seven hills and was once the center of a vast empire.",
      "Home to an ancient amphitheater where gladiators once fought.",
    ],
    funFacts: [
      "People throw approximately €1.5 million into the Trevi Fountain each year, which is collected and donated to charity.",
      "The Vatican City, located within this city, is the smallest independent state in the world.",
    ],
    trivia: [
      "There are more than 2,000 fountains throughout this city.",
      "The Pantheon in this city has the world's largest unreinforced concrete dome.",
    ],
  },
  {
    city: "Sydney",
    country: "Australia",
    clues: [
      "This city is famous for its iconic opera house with sail-shaped roofs.",
      "Home to one of the world's most famous harbors and a large steel arch bridge nicknamed 'The Coathanger'.",
    ],
    funFacts: [
      "The Sydney Opera House has over one million roof tiles covering approximately 1.62 hectares.",
      "Sydney's Bondi Beach is one of the most famous beaches in the world and can attract up to 40,000 visitors on a hot day.",
    ],
    trivia: [
      "Sydney is the oldest and largest city in Australia.",
      "The Sydney Harbour Bridge is the world's largest (but not the longest) steel arch bridge.",
    ],
  },
  {
    city: "Kathmandu",
    country: "Nepal",
    clues: [
      "Known for its ancient temples and vibrant culture.",
      "Located in a valley surrounded by the Himalayas.",
    ],
    funFacts: [
      "This city is home to many UNESCO World Heritage Sites.",
      "The Pashupatinath Temple is one of the most sacred Hindu temples in the world.",
    ],
    trivia: [
      "This city is known for its momos and dal bhat.",
      "The Boudhanath Stupa is one of the largest spherical stupas in Nepal.",
    ],
  },
  {
    city: "Mumbai",
    country: "India",
    clues: [
      "The financial capital of India.",
      "Known for its Bollywood film industry and street food.",
    ],
    funFacts: [
      "This city is home to the Gateway of India.",
      "The Chhatrapati Shivaji Maharaj Terminus is a UNESCO World Heritage Site.",
    ],
    trivia: [
      "This city is known for its vada pav and pav bhaji.",
      "The Elephanta Caves are a series of cave temples located on an island near the city.",
    ],
  },
  {
    city: "Nairobi",
    country: "Kenya",
    clues: [
      "The safari capital of Africa.",
      "Known for its wildlife and national parks.",
    ],
    funFacts: [
      "This city is home to the Nairobi National Park.",
      "The David Sheldrick Wildlife Trust is a sanctuary for orphaned elephants.",
    ],
    trivia: [
      "This city is known for its nyama choma and ugali.",
      "The Giraffe Centre is a sanctuary for Rothschild's giraffes.",
    ],
  },
  {
    city: "Accra",
    country: "Ghana",
    clues: [
      "The capital and largest city of Ghana.",
      "Known for its beaches and vibrant culture.",
    ],
    funFacts: [
      "This city is home to the National Museum of Ghana.",
      "The Kwame Nkrumah Mausoleum is dedicated to Ghana's first president.",
    ],
    trivia: [
      "This city is known for its jollof rice and banku.",
      "The Makola Market is one of the largest markets in West Africa.",
    ],
  },
  {
    city: "Lagos",
    country: "Nigeria",
    clues: [
      "The largest city in Nigeria.",
      "Known for its music scene and nightlife.",
    ],
    funFacts: [
      "This city is home to the National Theatre of Nigeria.",
      "The Lekki Conservation Centre is a nature reserve with a canopy walkway.",
    ],
    trivia: [
      "This city is known for its suya and egusi soup.",
      "The Nike Art Gallery showcases contemporary Nigerian art.",
    ],
  },
  {
    city: "Addis Ababa",
    country: "Ethiopia",
    clues: [
      "The capital and largest city of Ethiopia.",
      "Known for its historical sites and coffee culture.",
    ],
    funFacts: [
      "This city is home to the African Union headquarters.",
      "The National Museum of Ethiopia houses Lucy, one of the oldest hominid fossils.",
    ],
    trivia: [
      "This city is known for its injera and doro wat.",
      "The Merkato is one of the largest open-air markets in Africa.",
    ],
  },
  {
    city: "Casablanca",
    country: "Morocco",
    clues: [
      "The largest city in Morocco.",
      "Known for its Art Deco architecture and the Hassan II Mosque.",
    ],
    funFacts: [
      "This city is home to the Hassan II Mosque, one of the largest mosques in the world.",
      "The Rick's Cafe from the movie Casablanca is a popular tourist attraction.",
    ],
    trivia: [
      "This city is known for its tagine and couscous.",
      "The Medina of Casablanca is a UNESCO World Heritage Site.",
    ],
  },
  {
    city: "Algiers",
    country: "Algeria",
    clues: [
      "The capital and largest city of Algeria.",
      "Known for its white buildings and Mediterranean coastline.",
    ],
    funFacts: [
      "This city is home to the Kasbah of Algiers, a UNESCO World Heritage Site.",
      "The Notre-Dame d'Afrique is a basilica overlooking the city.",
    ],
    trivia: [
      "This city is known for its couscous and chorba.",
      "The Jardin d'Essai du Hamma is a botanical garden with a variety of plants.",
    ],
  },
  {
    city: "Tunis",
    country: "Tunisia",
    clues: [
      "The capital and largest city of Tunisia.",
      "Known for its Medina and Bardo Museum.",
    ],
    funFacts: [
      "This city is home to the Medina of Tunis, a UNESCO World Heritage Site.",
      "The Bardo Museum houses a collection of Roman mosaics.",
    ],
    trivia: [
      "This city is known for its couscous and brik.",
      "The Sidi Bou Said is a picturesque village with blue and white buildings.",
    ],
  },
  {
    city: "Tripoli",
    country: "Libya",
    clues: [
      "The capital and largest city of Libya.",
      "Known for its historical sites and Mediterranean coastline.",
    ],
    funFacts: [
      "This city is home to the Tripoli Zoo.",
      "The Arch of Marcus Aurelius is a Roman arch located in the city center.",
    ],
    trivia: [
      "This city is known for its couscous and tagine.",
      "The Leptis Magna is an ancient Roman city located near the city.",
    ],
  },
  {
    city: "Khartoum",
    country: "Sudan",
    clues: [
      "The capital and largest city of Sudan.",
      "Located at the confluence of the White Nile and Blue Nile.",
    ],
    funFacts: [
      "This city is home to the National Museum of Sudan.",
      "The Tuti Island is located at the confluence of the two Niles.",
    ],
    trivia: [
      "This city is known for its ful medames and asida.",
      "The Souq Arabi is a large market in the city center.",
    ],
  },
  {
    city: "Kinshasa",
    country: "Democratic Republic of the Congo",
    clues: [
      "The capital and largest city of the Democratic Republic of the Congo.",
      "Known for its music scene and vibrant culture.",
    ],
    funFacts: [
      "This city is home to the Lola ya Bonobo sanctuary for bonobos.",
      "The Académie des Beaux-Arts is an art school in the city.",
    ],
    trivia: [
      "This city is known for its fufu and moambe chicken.",
      "The Marché Central is a large market in the city center.",
    ],
  },
  {
    city: "Luanda",
    country: "Angola",
    clues: [
      "The capital and largest city of Angola.",
      "Known for its beaches and Portuguese colonial architecture.",
    ],
    funFacts: [
      "This city is home to the Fortress of São Miguel.",
      "The Museu de Antropologia is a museum of Angolan anthropology.",
    ],
    trivia: [
      "This city is known for its moqueca and funge.",
      "The Ilha do Cabo is a peninsula with beaches and restaurants.",
    ],
  },
  {
    city: "Lusaka",
    country: "Zambia",
    clues: [
      "The capital and largest city of Zambia.",
      "Known for its markets and wildlife.",
    ],
    funFacts: [
      "This city is home to the Lusaka National Museum.",
      "The Munda Wanga Environmental Park is a wildlife sanctuary and botanical garden.",
    ],
    trivia: [
      "This city is known for its nshima and relish.",
      "The Kabwata Cultural Village showcases traditional Zambian crafts.",
    ],
  },
  {
    city: "Harare",
    country: "Zimbabwe",
    clues: [
      "The capital and largest city of Zimbabwe.",
      "Known for its parks and gardens.",
    ],
    funFacts: [
      "This city is home to the National Gallery of Zimbabwe.",
      "The Harare Gardens is a large park in the city center.",
    ],
    trivia: [
      "This city is known for its sadza and stew.",
      "The Balancing Rocks are geological formations located near the city.",
    ],
  },
  {
    city: "Gaborone",
    country: "Botswana",
    clues: [
      "The capital and largest city of Botswana.",
      "Known for its wildlife and diamond industry.",
    ],
    funFacts: [
      "This city is home to the Botswana National Museum.",
      "The Gaborone Game Reserve is a wildlife sanctuary near the city.",
    ],
    trivia: [
      "This city is known for its seswaa and morogo.",
      "The Three Dikgosi Monument commemorates Botswana's independence.",
    ],
  },
  {
    city: "Windhoek",
    country: "Namibia",
    clues: [
      "The capital and largest city of Namibia.",
      "Known for its German colonial architecture and wildlife.",
    ],
    funFacts: [
      "This city is home to the National Museum of Namibia.",
      "The Christuskirche is a Lutheran church with German architecture.",
    ],
    trivia: [
      "This city is known for its biltong and braaivleis.",
      "The Daan Viljoen Game Park is a wildlife sanctuary near the city.",
    ],
  },
  {
    city: "Mogadishu",
    country: "Somalia",
    clues: [
      "The capital and largest city of Somalia.",
      "Known for its beaches and historical sites.",
    ],
    funFacts: [
      "This city is home to the National Museum of Somalia.",
      "The Arba Rucun Mosque is one of the oldest mosques in the city.",
    ],
    trivia: [
      "This city is known for its bariis iskukaris and hilib ari.",
      "The Bakara Market is one of the largest markets in the city.",
    ],
  },
  {
    city: "Dakar",
    country: "Senegal",
    clues: [
      "The capital and largest city of Senegal.",
      "Known for its music scene and beaches.",
    ],
    funFacts: [
      "This city is home to the African Renaissance Monument.",
      "The Île de Gorée is a UNESCO World Heritage Site that commemorates the slave trade.",
    ],
    trivia: [
      "This city is known for its thieboudienne and yassa.",
      "The Marché Sandaga is a large market in the city center.",
    ],
  },
  {
    city: "Bamako",
    country: "Mali",
    clues: [
      "The capital and largest city of Mali.",
      "Located on the Niger River.",
    ],
    funFacts: [
      "This city is home to the National Museum of Mali.",
      "The Grand Mosque of Bamako is a prominent landmark in the city.",
    ],
    trivia: [
      "This city is known for its to and tigadèguèna.",
      "The Marché Rose is a large market in the city center.",
    ],
  },
  {
    city: "Apia",
    country: "Samoa",
    clues: [
      "The capital and largest city of Samoa.",
      "Known for its beaches and Samoan culture.",
    ],
    funFacts: [
      "This city is located on the island of Upolu.",
      "The Robert Louis Stevenson Museum is located in the city.",
    ],
    trivia: [
      "This city is known for its oka and palusami.",
      "The Papaseea Sliding Rocks are a popular tourist attraction.",
    ],
  },
  {
    city: "Nuku'alofa",
    country: "Tonga",
    clues: [
      "The capital and largest city of Tonga.",
      "Known for its royal palace and Tongan culture.",
    ],
    funFacts: [
      "This city is located on the island of Tongatapu.",
      "The Royal Palace is the official residence of the King of Tonga.",
    ],
    trivia: [
      "This city is known for its lu pulu and otai.",
      "The Haʻamonga ʻa Maui is a megalithic trilithon located near the city.",
    ],
  },
  {
    city: "Yaren",
    country: "Nauru",
    clues: [
      "The de facto capital of Nauru.",
      "Known for its phosphate mining and small size.",
    ],
    funFacts: [
      "This city is not the official capital, but it houses the parliament.",
      "Nauru is one of the smallest countries in the world.",
    ],
    trivia: [
      "This city is known for its seafood and coconut.",
      "The Japanese guns are remnants of World War II.",
    ],
  },
  {
    city: "South Tarawa",
    country: "Kiribati",
    clues: [
      "The capital and largest city of Kiribati.",
      "Known for its atolls and beaches.",
    ],
    funFacts: [
      "This city is located on the atoll of Tarawa.",
      "Kiribati is one of the first countries to be affected by climate change.",
    ],
    trivia: [
      "This city is known for its seafood and coconut.",
      "The World War II relics are remnants of the Battle of Tarawa.",
    ],
  },
  {
    city: "Funafuti",
    country: "Tuvalu",
    clues: [
      "The capital and largest city of Tuvalu.",
      "Known for its atolls and small size.",
    ],
    funFacts: [
      "This city is located on the atoll of Funafuti.",
      "Tuvalu is one of the smallest countries in the world.",
    ],
    trivia: [
      "This city is known for its seafood and coconut.",
      "The Funafuti Conservation Area is a marine protected area.",
    ],
  },
  {
    city: "Majuro",
    country: "Marshall Islands",
    clues: [
      "The capital and largest city of the Marshall Islands.",
      "Known for its atolls and beaches.",
    ],
    funFacts: [
      "This city is located on the atoll of Majuro.",
      "The Marshall Islands were a former US trust territory.",
    ],
    trivia: [
      "This city is known for its seafood and coconut.",
      "The Alele Museum is located in the city.",
    ],
  },
  {
    city: "Palikir",
    country: "Federated States of Micronesia",
    clues: [
      "The capital of the Federated States of Micronesia.",
      "Known for its lush landscapes and waterfalls.",
    ],
    funFacts: [
      "This city is located on the island of Pohnpei.",
      "The Nan Madol is an ancient city located near the city.",
    ],
    trivia: [
      "This city is known for its seafood and breadfruit.",
      "The Kepirohi Waterfall is a popular tourist attraction.",
    ],
  },
  {
    city: "Yamoussoukro",
    country: "Ivory Coast",
    clues: [
      "The political capital of Ivory Coast.",
      "Known for its basilica and modern architecture.",
    ],
    funFacts: [
      "This city is home to the Basilica of Our Lady of Peace, one of the largest churches in the world.",
      "The city was the birthplace of Félix Houphouët-Boigny, the first president of Ivory Coast.",
    ],
    trivia: [
      "This city is known for its attiéké and kedjenou.",
      "The Presidential Palace is located in the city.",
    ],
  },
  {
    city: "Abuja",
    country: "Nigeria",
    clues: [
      "The capital of Nigeria.",
      "Known for its modern architecture and parks.",
    ],
    funFacts: [
      "This city is a planned city.",
      "The Aso Rock is a large monolith located near the city.",
    ],
    trivia: [
      "This city is known for its suya and jollof rice.",
      "The National Mosque of Nigeria is located in the city.",
    ],
  },
  {
    city: "Dodoma",
    country: "Tanzania",
    clues: [
      "The capital of Tanzania.",
      "Known for its wine region and historical sites.",
    ],
    funFacts: [
      "This city is located in the center of Tanzania.",
      "The Bunge is the National Assembly of Tanzania.",
    ],
    trivia: [
      "This city is known for its ugali and nyama choma.",
      "The Kondoa Irangi Rock Paintings are located near the city.",
    ],
  },
  {
    city: "Pretoria",
    country: "South Africa",
    clues: [
      "The administrative capital of South Africa.",
      "Known for its jacaranda trees and historical buildings.",
    ],
    funFacts: [
      "This city is known as the 'Jacaranda City' due to the thousands of jacaranda trees.",
      "The Union Buildings are the official seat of the South African government.",
    ],
    trivia: [
      "This city is known for its biltong and boerewors.",
      "The Voortrekker Monument is a historical monument located in the city.",
    ],
  },
  {
    city: "Bern",
    country: "Switzerland",
    clues: [
      "The de facto capital of Switzerland.",
      "Known for its medieval architecture and Zytglogge astronomical clock.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "The Zytglogge is a medieval clock tower with an astronomical clock.",
    ],
    trivia: [
      "This city is known for its rösti and fondue.",
      "The Bear Park is a park with bears, the symbol of the city.",
    ],
  },
  {
    city: "Vaduz",
    country: "Liechtenstein",
    clues: [
      "The capital of Liechtenstein.",
      "Known for its castle and alpine scenery.",
    ],
    funFacts: [
      "This city is home to the Vaduz Castle, the residence of the Prince of Liechtenstein.",
      "Liechtenstein is one of the smallest countries in the world.",
    ],
    trivia: [
      "This city is known for its käsknöpfle and ribel.",
      "The Kunstmuseum Liechtenstein is a museum of modern and contemporary art.",
    ],
  },
  {
    city: "Luxembourg City",
    country: "Luxembourg",
    clues: [
      "The capital of Luxembourg.",
      "Known for its medieval architecture and fortifications.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "The Bock Casemates are a network of underground tunnels.",
    ],
    trivia: [
      "This city is known for its judd mat gaardebounen and bouneschlupp.",
      "The Grand Ducal Palace is the official residence of the Grand Duke of Luxembourg.",
    ],
  },
  {
    city: "Monaco",
    country: "Monaco",
    clues: [
      "The capital of Monaco.",
      "Known for its luxury and Monte Carlo Casino.",
    ],
    funFacts: [
      "This city is a city-state.",
      "The Monte Carlo Casino is a famous casino.",
    ],
    trivia: [
      "This city is known for its barbagiuan and socca.",
      "The Prince's Palace is the official residence of the Prince of Monaco.",
    ],
  },
  {
    city: "San Marino",
    country: "San Marino",
    clues: [
      "The capital of San Marino.",
      "Known for its medieval architecture and Mount Titano.",
    ],
    funFacts: [
      "This city is one of the oldest republics in the world.",
      "Mount Titano is a UNESCO World Heritage Site.",
    ],
    trivia: [
      "This city is known for its pasta e ceci and torta tre monti.",
      "The Three Towers of San Marino are a symbol of the city.",
    ],
  },
  {
    city: "City of Victoria",
    country: "Seychelles",
    clues: [
      "The capital of Seychelles.",
      "Known for its beaches and Creole culture.",
    ],
    funFacts: [
      "This city is located on the island of Mahé.",
      "The Victoria Clocktower is a prominent landmark in the city.",
    ],
    trivia: [
      "This city is known for its fish curry and ladob.",
      "The Sir Selwyn Selwyn-Clarke Market is a local market in the city.",
    ],
  },
  {
    city: "Port Louis",
    country: "Mauritius",
    clues: [
      "The capital of Mauritius.",
      "Known for its beaches and multicultural society.",
    ],
    funFacts: [
      "This city is a major port city.",
      "The Aapravasi Ghat is a UNESCO World Heritage Site.",
    ],
    trivia: [
      "This city is known for its dholl puri and gateau piment.",
      "The Central Market is a local market in the city.",
    ],
  },
  {
    city: "Saint-Denis",
    country: "Réunion",
    clues: [
      "The capital of Réunion.",
      "Known for its beaches and Creole culture.",
    ],
    funFacts: [
      "This city is a French territory.",
      "The Jardin de l'État is a botanical garden in the city.",
    ],
    trivia: [
      "This city is known for its rougail and cari.",
      "The Grand Marché is a local market in the city.",
    ],
  },
  {
    city: "Mamoudzou",
    country: "Mayotte",
    clues: [
      "The capital of Mayotte.",
      "Known for its beaches and coral reefs.",
    ],
    funFacts: [
      "This city is a French territory.",
      "The Lagoon of Mayotte is one of the largest lagoons in the world.",
    ],
    trivia: [
      "This city is known for its fish and coconut dishes.",
      "The Marché de Mamoudzou is a local market in the city.",
    ],
  },
  {
    city: "Castries",
    country: "Saint Lucia",
    clues: [
      "The capital of Saint Lucia.",
      "Known for its harbor and Creole culture.",
    ],
    funFacts: [
      "This city is located on the island of Saint Lucia.",
      "The Derek Walcott Square is a central square named after the Nobel laureate.",
    ],
    trivia: [
      "This city is known for its green figs and saltfish.",
      "The Castries Central Market is a local market in the city.",
    ],
  },
  {
    city: "Kingstown",
    country: "Saint Vincent and the Grenadines",
    clues: [
      "The capital of Saint Vincent and the Grenadines.",
      "Known for its botanical gardens and beaches.",
    ],
    funFacts: [
      "This city is located on the island of Saint Vincent.",
      "The Saint Vincent Botanical Gardens are one of the oldest botanical gardens in the Western Hemisphere.",
    ],
    trivia: [
      "This city is known for its callaloo soup and roasted breadfruit.",
      "The Kingstown Market is a local market in the city.",
    ],
  },
  {
    city: "Saint George's",
    country: "Grenada",
    clues: [
      "The capital of Grenada.",
      "Known for its spice production and beaches.",
    ],
    funFacts: [
      "This city is located on the island of Grenada.",
      "Grenada is known as the 'Spice Isle'.",
    ],
    trivia: [
      "This city is known for its oil down and callaloo soup.",
      "The Grand Etang National Park is located near the city.",
    ],
  },
  {
    city: "Bridgetown",
    country: "Barbados",
    clues: [
      "The capital of Barbados.",
      "Known for its beaches and rum distilleries.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "The Mount Gay Rum Distillery is one of the oldest rum distilleries in the world.",
    ],
    trivia: [
      "This city is known for its cou-cou and flying fish.",
      "The Garrison Savannah is a historic horse racing track.",
    ],
  },
  {
    city: "Roseau",
    country: "Dominica",
    clues: [
      "The capital of Dominica.",
      "Known for its natural hot springs and rainforests.",
    ],
    funFacts: [
      "This city is located on the island of Dominica.",
      "Dominica is known as the 'Nature Isle of the Caribbean'.",
    ],
    trivia: [
      "This city is known for its mountain chicken and callaloo soup.",
      "The Trafalgar Falls are a popular tourist attraction.",
    ],
  },
  {
    city: "Basseterre",
    country: "Saint Kitts and Nevis",
    clues: [
      "The capital of Saint Kitts and Nevis.",
      "Known for its beaches and historical sites.",
    ],
    funFacts: [
      "This city is located on the island of Saint Kitts.",
      "Brimstone Hill Fortress National Park is a UNESCO World Heritage Site.",
    ],
    trivia: [
      "This city is known for its goat water and conch fritters.",
      "The Independence Square is located in the city center.",
    ],
  },
  {
    city: "Saint John's",
    country: "Antigua and Barbuda",
    clues: [
      "The capital of Antigua and Barbuda.",
      "Known for its beaches and sailing.",
    ],
    funFacts: [
      "This city is located on the island of Antigua.",
      "Antigua is known for its many beaches.",
    ],
    trivia: [
      "This city is known for its fungee and pepperpot.",
      "The Nelson's Dockyard is a historic naval dockyard.",
    ],
  },
  {
    city: "The Valley",
    country: "Anguilla",
    clues: [
      "The capital of Anguilla.",
      "Known for its beaches and coral reefs.",
    ],
    funFacts: [
      "This city is located on the island of Anguilla.",
      "Anguilla is a British Overseas Territory.",
    ],
    trivia: [
      "This city is known for its seafood and goat stew.",
      "The Sandy Ground is a popular beach with restaurants and bars.",
    ],
  },
  {
    city: "Road Town",
    country: "British Virgin Islands",
    clues: [
      "The capital of the British Virgin Islands.",
      "Known for its sailing and beaches.",
    ],
    funFacts: [
      "This city is located on the island of Tortola.",
      "The British Virgin Islands are a British Overseas Territory.",
    ],
    trivia: [
      "This city is known for its seafood and roti.",
      "The Sage Mountain National Park is located on the island.",
    ],
  },
  {
    city: "Philipsburg",
    country: "Sint Maarten",
    clues: [
      "The capital of Sint Maarten.",
      "Known for its beaches and duty-free shopping.",
    ],
    funFacts: [
      "This city is located on the Dutch side of the island of Saint Martin.",
      "The island is divided between France and the Netherlands.",
    ],
    trivia: [
      "This city is known for its seafood and guavaberry liqueur.",
      "The Maho Beach is famous for planes landing close to the beach.",
    ],
  },
  {
    city: "Marigot",
    country: "Saint Martin",
    clues: [
      "The capital of Saint Martin.",
      "Known for its French culture and beaches.",
    ],
    funFacts: [
      "This city is located on the French side of the island of Saint Martin.",
      "The island is divided between France and the Netherlands.",
    ],
    trivia: [
      "This city is known for its French cuisine and seafood.",
      "The Fort Louis is a historic fort overlooking the city.",
    ],
  },
  {
    city: "Gustavia",
    country: "Saint Barthélemy",
    clues: [
      "The capital of Saint Barthélemy.",
      "Known for its luxury and beaches.",
    ],
    funFacts: [
      "This city is a French territory.",
      "Saint Barthélemy is a popular destination for celebrities.",
    ],
    trivia: [
      "This city is known for its French cuisine and seafood.",
      "The Shell Beach is a beach covered in shells.",
    ],
  },
  {
    city: "Oranjestad",
    country: "Aruba",
    clues: [
      "The capital of Aruba.",
      "Known for its beaches and Dutch colonial architecture.",
    ],
    funFacts: [
      "This city is located on the island of Aruba.",
      "Aruba is a constituent country of the Kingdom of the Netherlands.",
    ],
    trivia: [
      "This city is known for its seafood and keshi yena.",
      "The Renaissance Marketplace is a shopping and dining area.",
    ],
  },
  {
    city: "Willemstad",
    country: "Curaçao",
    clues: [
      "The capital of Curaçao.",
      "Known for its colorful Dutch colonial architecture and beaches.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "Curaçao is a constituent country of the Kingdom of the Netherlands.",
    ],
    trivia: [
      "This city is known for its seafood and keshi yena.",
      "The Queen Emma Pontoon Bridge is a floating bridge.",
    ],
  },
  {
    city: "Kralendijk",
    country: "Bonaire",
    clues: ["The capital of Bonaire.", "Known for its diving and beaches."],
    funFacts: [
      "This city is located on the island of Bonaire.",
      "Bonaire is a special municipality of the Netherlands.",
    ],
    trivia: [
      "This city is known for its seafood and goat stew.",
      "The Washington Slagbaai National Park is located on the island.",
    ],
  },
  {
    city: "Havana",
    country: "Cuba",
    clues: [
      "The capital of Cuba.",
      "Known for its vintage cars and Cuban culture.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "The Malecón is a waterfront promenade.",
    ],
    trivia: [
      "This city is known for its ropa vieja and Cuban sandwiches.",
      "The Old Havana is a historic district with colonial architecture.",
    ],
  },
  {
    city: "Nassau",
    country: "Bahamas",
    clues: [
      "The capital of the Bahamas.",
      "Known for its beaches and resorts.",
    ],
    funFacts: [
      "This city is located on the island of New Providence.",
      "The Atlantis Paradise Island is a famous resort.",
    ],
    trivia: [
      "This city is known for its conch salad and cracked conch.",
      "The Straw Market is a local market with souvenirs.",
    ],
  },
  {
    city: "Kingston",
    country: "Jamaica",
    clues: [
      "The capital of Jamaica.",
      "Known for its reggae music and beaches.",
    ],
    funFacts: [
      "This city is located on the island of Jamaica.",
      "The Bob Marley Museum is located in the city.",
    ],
    trivia: [
      "This city is known for its jerk chicken and ackee and saltfish.",
      "The Devon House is a historic mansion with gardens.",
    ],
  },
  {
    city: "Port-au-Prince",
    country: "Haiti",
    clues: ["The capital of Haiti.", "Known for its art and culture."],
    funFacts: [
      "This city is located on the island of Hispaniola.",
      "The Musée du Panthéon National Haïtien is located in the city.",
    ],
    trivia: [
      "This city is known for its griot and tassot.",
      "The Iron Market is a local market in the city.",
    ],
  },
  {
    city: "Santo Domingo",
    country: "Dominican Republic",
    clues: [
      "The capital of the Dominican Republic.",
      "Known for its colonial history and beaches.",
    ],
    funFacts: [
      "This city is a UNESCO World Heritage Site.",
      "The Zona Colonial is a historic district with colonial architecture.",
    ],
    trivia: [
      "This city is known for its la bandera and mangu.",
      "The Alcázar de Colón is a historic palace.",
    ],
  },
  {
    city: "San Juan",
    country: "Puerto Rico",
    clues: [
      "The capital of Puerto Rico.",
      "Known for its beaches and historical sites.",
    ],
    funFacts: [
      "This city is a US territory.",
      "The Castillo San Felipe del Morro is a historic fort.",
    ],
    trivia: [
      "This city is known for its mofongo and tostones.",
      "The Old San Juan is a historic district with colonial architecture.",
    ],
  },
  {
    city: "Charlotte Amalie",
    country: "United States Virgin Islands",
    clues: [
      "The capital of the United States Virgin Islands.",
      "Known for its beaches and duty-free shopping.",
    ],
    funFacts: [
      "This city is a US territory.",
      "The Blackbeard's Castle is a historic landmark.",
    ],
    trivia: [
      "This city is known for its seafood and callaloo soup.",
      "The Main Street is a shopping street with duty-free stores.",
    ],
  },
  {
    city: "Hamilton",
    country: "Bermuda",
    clues: [
      "The capital of Bermuda.",
      "Known for its pink sand beaches and British culture.",
    ],
    funFacts: [
      "This city is a British Overseas Territory.",
      "The Front Street is a waterfront street with shops and restaurants.",
    ],
    trivia: [
      "This city is known for its fish chowder and rum swizzle.",
      "The Bermuda Underwater Exploration Institute is a museum about the ocean.",
    ],
  },
  {
    city: "Ottawa",
    country: "Canada",
    clues: [
      "The capital of Canada.",
      "Known for its historical sites and Rideau Canal.",
    ],
    funFacts: [
      "This city is home to Parliament Hill.",
      "The Rideau Canal becomes the world's longest skating rink in winter.",
    ],
    trivia: [
      "This city is known for its beavertails and poutine.",
      "The ByWard Market is a historic market with shops and restaurants.",
    ],
  },
  {
    city: "Washington, D.C.",
    country: "USA",
    clues: [
      "The capital of the United States.",
      "Known for its monuments and museums.",
    ],
    funFacts: [
      "This city is home to the White House.",
      "The Smithsonian Institution is the world's largest museum and research complex.",
    ],
    trivia: [
      "This city is known for its half-smokes and cherry blossoms.",
      "The National Mall is a park with monuments and memorials.",
    ],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    clues: [
      "One of the largest and most populous cities in the world.",
      "Known for its rich history, culture, and cuisine.",
    ],
    funFacts: [
      "This city is built on the ruins of the ancient Aztec city of Tenochtitlan.",
      "The National Museum of Anthropology is one of the most comprehensive museums of Mexican history and culture.",
    ],
    trivia: [
      "This city is known for its street food, such as tacos and tamales.",
      "The Xochimilco canals are the last remnants of the Aztec canal system.",
    ],
  },
  {
    city: "Belmopan",
    country: "Belize",
    clues: [
      "The capital of Belize.",
      "Known for its Mayan ruins and rainforests.",
    ],
    funFacts: [
      "This city is a planned city.",
      "Belize is the only English-speaking country in Central America.",
    ],
    trivia: [
      "This city is known for its rice and beans and stew chicken.",
      "The Actun Tunichil Muknal cave is a Mayan archaeological site.",
    ],
  },
  {
    city: "Guatemala City",
    country: "Guatemala",
    clues: [
      "The capital of Guatemala.",
      "Known for its Mayan ruins and colonial architecture.",
    ],
    funFacts: [
      "This city is the largest city in Central America.",
      "The Tikal National Park is a UNESCO World Heritage Site.",
    ],
    trivia: [
      "This city is known for its pepian and tamales.",
      "The National Palace of Culture is located in the city.",
    ],
  },
  {
    city: "San Salvador",
    country: "El Salvador",
    clues: [
      "The capital of El Salvador.",
      "Known for its volcanoes and beaches.",
    ],
    funFacts: [
      "This city is located in a valley surrounded by volcanoes.",
      "El Salvador is the only country in Central America without a Caribbean coastline.",
    ],
    trivia: [
      "This city is known for its pupusas and yuca frita.",
      "The Joya de Cerén is a pre-Columbian archaeological site.",
    ],
  },
];

async function main() {
  console.log("Connecting to database...");
  try {
    console.log("Creating schema...");

    await sql`DROP TABLE IF EXISTS trivia CASCADE`;
    await sql`DROP TABLE IF EXISTS fun_facts CASCADE`;
    await sql`DROP TABLE IF EXISTS clues CASCADE`;
    await sql`DROP TABLE IF EXISTS destinations CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    await sql`CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS clues (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      clue TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS fun_facts (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      fact TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS trivia (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      fact TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      total_answers INTEGER NOT NULL DEFAULT 0,
      created_at VARCHAR NOT NULL DEFAULT current_timestamp
    )`;

    console.log("Schema created successfully");

    console.log("Seeding initial data...");

    for (const destination of initialData) {
      const [newDestination] = await db
        .insert(schema.destinations)
        .values({
          city: destination.city,
          country: destination.country,
        })
        .returning();

      for (const clueText of destination.clues) {
        await db.insert(schema.clues).values({
          destinationId: newDestination.id,
          clue: clueText,
        });
      }

      for (const factText of destination.funFacts) {
        await db.insert(schema.funFacts).values({
          destinationId: newDestination.id,
          fact: factText,
        });
      }

      for (const triviaText of destination.trivia) {
        await db.insert(schema.trivia).values({
          destinationId: newDestination.id,
          fact: triviaText,
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    console.log("Closing database connection...");
    await db.$client.end();
  }
}

main();
