// lib/trails.js
// This is our seed trail data for the SLC surrounding area.
// Each "area" is a parent location (like Round Valley) that contains child trails.
// This is hardcoded to start — architecture is ready to swap in API data later.

export const trailAreas = [
  {
    id: 'corner-canyon',
    name: 'Corner Canyon',
    city: 'Draper',
    region: 'Salt Lake Valley',
    description: 'One of the most popular riding destinations in Utah with a wide range of trails for all skill levels. Located in the southeast corner of the Salt Lake Valley.',
    parkingLat: 40.4677,
    parkingLng: -111.8580,
    parkingAddress: '14800 Corner Canyon Rd, Draper, UT 84020',
    trails: [
      {
        id: 'chutes-and-ladders',
        name: 'Chutes & Ladders',
        difficulty: 'beginner',
        direction: 'loop',
        lengthMiles: 5.2,
        elevationGainFt: 650,
        estimatedTimeMin: 60,
        description: 'A classic beginner loop at Corner Canyon. Smooth singletrack with gentle climbs and fun swoopy descents. Great first trail for new mountain bikers.',
        howToRide: 'Start at the Hammond Canyon trailhead. Follow the signs for Chutes & Ladders. The loop is well-marked — ride clockwise for the best flow. Take the lower connector back to the parking area.',
        features: ['smooth singletrack', 'beginner-friendly berms', 'some roots'],
        trailheadLat: 40.4681,
        trailheadLng: -111.8562,
        trailheadAddress: 'Hammond Canyon Trailhead, Draper, UT',
        dataSource: 'trailforks',
        dataConfidence: 85,
        dataNote: 'Trail data sourced from Trailforks community reports. Length and elevation verified. Conditions may vary seasonally.',
      },
      {
        id: 'ghost-falls',
        name: 'Ghost Falls',
        difficulty: 'intermediate',
        direction: 'out-and-back',
        lengthMiles: 7.8,
        elevationGainFt: 1200,
        estimatedTimeMin: 90,
        description: 'A rewarding intermediate trail with a sustained climb and fast descent. Features a waterfall viewpoint about halfway up. Rocky in sections.',
        howToRide: 'Climb up via the Ghost Falls trail from the south trailhead. The first mile is the steepest — pace yourself. At the top, enjoy the views before descending the same way. Watch for sharp switchbacks on the way down.',
        features: ['rocky sections', 'waterfall viewpoint', 'steep climb', 'fast descent', 'sharp curves'],
        trailheadLat: 40.4710,
        trailheadLng: -111.8540,
        trailheadAddress: 'Ghost Falls Trailhead, Draper, UT',
        dataSource: 'trailforks',
        dataConfidence: 90,
        dataNote: 'High confidence — frequently reported trail with consistent data from multiple sources.',
      },
      {
        id: 'ann-canyon',
        name: 'Ann Canyon',
        difficulty: 'intermediate',
        direction: 'loop',
        lengthMiles: 6.1,
        elevationGainFt: 900,
        estimatedTimeMin: 75,
        description: 'A flowy intermediate loop that connects several trails through Ann Canyon. Known for fun berms and occasional technical rock sections.',
        howToRide: 'Start at the Corner Canyon main trailhead. Head up the fire road to the canyon entrance, then follow Ann Canyon trail counterclockwise for the best flow on the descent.',
        features: ['berms', 'rocky sections', 'technical features', 'some jumps'],
        trailheadLat: 40.4695,
        trailheadLng: -111.8570,
        trailheadAddress: 'Corner Canyon Main Trailhead, Draper, UT',
        dataSource: 'trailforks',
        dataConfidence: 80,
        dataNote: 'Data sourced from Trailforks. Some sections under trail maintenance — check local reports before riding.',
      },
    ],
  },
  {
    id: 'round-valley',
    name: 'Round Valley',
    city: 'Park City',
    region: 'Wasatch Back',
    description: 'A network of cross-country trails just minutes from downtown Park City. Known for incredible views, smooth singletrack, and beginner-friendly routes that connect to more advanced terrain.',
    parkingLat: 40.6461,
    parkingLng: -111.4980,
    parkingAddress: 'Round Valley Trailhead, Park City, UT 84060',
    trails: [
      {
        id: 'round-valley-express',
        name: 'Round Valley Express',
        difficulty: 'beginner',
        direction: 'loop',
        lengthMiles: 4.5,
        elevationGainFt: 400,
        estimatedTimeMin: 45,
        description: 'The quintessential beginner trail in Park City. Smooth, flowy singletrack with minimal technical sections. Perfect for building confidence and fitness.',
        howToRide: 'Start at the Round Valley trailhead off Bitner Road. Follow the green (easy) markers. The loop is mostly flat with one small climb near the midpoint. Excellent views of the Wasatch range throughout.',
        features: ['smooth singletrack', 'beginner-friendly', 'mountain views', 'well-marked'],
        trailheadLat: 40.6465,
        trailheadLng: -111.4975,
        trailheadAddress: 'Round Valley Trailhead, Bitner Rd, Park City, UT',
        dataSource: 'trailforks',
        dataConfidence: 92,
        dataNote: 'Very high confidence. One of the most documented trails in Utah with consistent community reporting.',
      },
      {
        id: 'mid-mountain',
        name: 'Mid-Mountain Trail',
        difficulty: 'intermediate',
        direction: 'one-way',
        lengthMiles: 14.3,
        elevationGainFt: 1800,
        estimatedTimeMin: 180,
        description: 'An epic point-to-point trail traversing the mid-mountain zone above Park City. Connects multiple ski resorts with stunning alpine views. Requires a car shuttle or ride back.',
        howToRide: 'Start at the Glenwild trailhead (or Deer Valley) and ride east toward Park City Mountain. This is a one-way trail — plan for a shuttle. The trail undulates significantly; several long climbs are offset by beautiful descending sections.',
        features: ['alpine views', 'technical sections', 'water crossings', 'rocky', 'exposed ridge', 'long distance'],
        trailheadLat: 40.6830,
        trailheadLng: -111.5640,
        trailheadAddress: 'Glenwild Trailhead, Park City, UT',
        dataSource: 'trailforks',
        dataConfidence: 88,
        dataNote: 'Data confidence high for main corridor. Some connecting spur trails may have limited data.',
      },
    ],
  },
  {
    id: 'millcreek-canyon',
    name: 'Millcreek Canyon',
    city: 'Salt Lake City',
    region: 'Wasatch Front',
    description: 'A beloved canyon just 20 minutes from downtown SLC. Offers everything from mellow doubletrack to expert-level singletrack. Dogs allowed on even-numbered days.',
    parkingLat: 40.6868,
    parkingLng: -111.7560,
    parkingAddress: 'Millcreek Canyon Rd, Salt Lake City, UT 84109',
    trails: [
      {
        id: 'big-water-trail',
        name: 'Big Water Trail',
        difficulty: 'intermediate',
        direction: 'out-and-back',
        lengthMiles: 8.2,
        elevationGainFt: 1500,
        estimatedTimeMin: 120,
        description: 'A sustained climb up a beautiful canyon with a rewarding descent. Mostly hardpacked dirt with some rocky and rooty sections near the top.',
        howToRide: 'Park at the upper Millcreek trailhead. Head up the fire road, then transition to singletrack. The trail follows the creek for the first mile before climbing steeply. Turn around at the ridge or continue to connect with other trails.',
        features: ['creek crossings', 'rocky upper section', 'rooty lower section', 'sustained climb'],
        trailheadLat: 40.6910,
        trailheadLng: -111.7450,
        trailheadAddress: 'Upper Millcreek Trailhead, SLC, UT',
        dataSource: 'mtb-project',
        dataConfidence: 82,
        dataNote: 'Data sourced from MTB Project. Trail conditions can be wet in spring — check recent reports.',
      },
      {
        id: 'pipeline-trail',
        name: 'Pipeline Trail',
        difficulty: 'beginner',
        direction: 'one-way',
        lengthMiles: 3.8,
        elevationGainFt: 200,
        estimatedTimeMin: 40,
        description: 'A flat-to-gentle trail that follows an old water pipeline route. Excellent for beginners or a casual pedal. Great views of the Salt Lake Valley.',
        howToRide: 'Access from the lower Millcreek trailhead. The trail is mostly flat and follows the pipeline grade. Suitable for all fitness levels. Can be ridden as an out-and-back or combined with other trails for a longer loop.',
        features: ['flat', 'valley views', 'beginner-friendly', 'well-maintained'],
        trailheadLat: 40.6875,
        trailheadLng: -111.7520,
        trailheadAddress: 'Lower Millcreek Trailhead, SLC, UT',
        dataSource: 'mtb-project',
        dataConfidence: 78,
        dataNote: 'Moderate confidence. MTB Project data cross-referenced with local trail reports. Conditions generally reliable.',
      },
    ],
  },
  {
    id: 'bonneville-shoreline',
    name: 'Bonneville Shoreline Trail',
    city: 'Salt Lake City',
    region: 'Wasatch Front',
    description: 'A long traversing trail that follows the ancient shoreline of Lake Bonneville along the base of the Wasatch Mountains. Accessible from many SLC neighborhoods.',
    parkingLat: 40.7484,
    parkingLng: -111.8280,
    parkingAddress: 'Various access points along Wasatch Blvd, SLC, UT',
    trails: [
      {
        id: 'bst-north',
        name: 'BST North (City Creek to Red Butte)',
        difficulty: 'beginner',
        direction: 'one-way',
        lengthMiles: 6.5,
        elevationGainFt: 600,
        estimatedTimeMin: 75,
        description: 'The northern section of the iconic Bonneville Shoreline Trail. Gentle grade, incredible views of the Salt Lake Valley. A local favorite for after-work rides.',
        howToRide: 'Start at City Creek Canyon trailhead. Head north along the bench. The trail undulates gently — mostly rideable with a few short hike-a-bike sections. End at Red Butte Garden for a natural turnaround, or continue south.',
        features: ['city views', 'some loose gravel', 'exposed hillside', 'beginner-friendly'],
        trailheadLat: 40.7730,
        trailheadLng: -111.8640,
        trailheadAddress: 'City Creek Canyon Trailhead, SLC, UT',
        dataSource: 'trailforks',
        dataConfidence: 75,
        dataNote: 'Moderate confidence. BST is maintained by volunteers — conditions vary by section. Check Salt Lake Trails Alliance for current status.',
      },
    ],
  },
]

// Helper: flatten all trails into a single array (useful for search)
export function getAllTrails() {
  return trailAreas.flatMap(area =>
    area.trails.map(trail => ({ ...trail, area: area.name, areaId: area.id, city: area.city, region: area.region }))
  )
}

// Helper: get a single area by ID
export function getAreaById(id) {
  return trailAreas.find(area => area.id === id)
}

// Helper: get a single trail by area ID + trail ID
export function getTrailById(areaId, trailId) {
  const area = getAreaById(areaId)
  if (!area) return null
  const trail = area.trails.find(t => t.id === trailId)
  if (!trail) return null
  return { ...trail, area: area.name, areaId: area.id, city: area.city, region: area.region, parkingLat: area.parkingLat, parkingLng: area.parkingLng, parkingAddress: area.parkingAddress }
}

// Difficulty color mapping — used across the UI
export const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  advanced: { label: 'Advanced', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
}
