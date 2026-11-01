export const TRAVEL_SMS_NUMBER = '14632813454';
const photo = (file, author, license, licenseUrl) => ({
  file, author, license, licenseUrl,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`,
  image: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replaceAll(' ', '_'))}?width=960`,
});

// Durations are supplied by Roger's brief, not independently verified package entitlements.
export const DESTINATIONS = [
  { id: 'las-vegas', name: 'Las Vegas', region: 'Nevada', days: 4, alt: 'The Las Vegas Strip viewed from the STRAT', ...photo('Vegas Strip viewed from the STRAT.jpg', 'Julian Lupyan', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/') },
  { id: 'cancun', name: 'Cancún', region: 'Mexico', days: 6, alt: 'White sand and blue sea at Cancún beach', ...photo('Cancun Beach.jpg', 'Keith Pomakis', 'CC BY-SA 2.5', 'https://creativecommons.org/licenses/by-sa/2.5/') },
  { id: 'bali', name: 'Bali', region: 'Indonesia', days: 8, alt: 'Ulun Danu Beratan temple on Lake Bratan in Bali', ...photo('Ulun Danu Beratan Temple.jpg', 'Yessykharisma', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/') },
  { id: 'dubai', name: 'Dubai', region: 'UAE', days: 5, alt: 'Golden desert dunes in Dubai', ...photo('Dubai Desert Dunes.jpg', 'Kamyana', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/') },
  { id: 'phuket', name: 'Phuket', region: 'Thailand', days: 8, alt: 'A beach on Phuket, Thailand', ...photo('Thailand phuket beach.jpg', 'Public-domain-image.com', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Thailand_phuket_beach.jpg') },
  { id: 'puerto-vallarta', name: 'Puerto Vallarta', region: 'Mexico', days: 6, alt: 'Puerto Vallarta and the Bay of Banderas', ...photo('View of Puerto Vallarta.jpg', 'Feedmepaperr', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/') },
];

export function travelMessage(destination) {
  return `Hi Roger! I'm interested in the ${destination.name}, ${destination.region} ${destination.days}-day promotional vacation.\n\nMy Name:\nMy Phone Number:\nMy Email:`;
}

export function travelSmsUrl(destination) {
  return `sms:${TRAVEL_SMS_NUMBER}?body=${encodeURIComponent(travelMessage(destination))}`;
}
