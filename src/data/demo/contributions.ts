import type { Contribution } from '../../types';
export const DEMO_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contrib-001', user_id: 'user-1', heritage_site_id: 'site-001', type: 'story',
    title: 'The Festival of Karthigai Deepam at Brihadeeswarar',
    description: 'Every year during Karthigai Deepam, thousands of oil lamps are lit around the temple complex creating a breathtaking sea of light. My grandmother used to tell stories of how, in her childhood, the entire city of Thanjavur would gather here and the reflection of lamps in the temple tank would make it look like stars had descended to earth. This tradition has been observed here for over 1,000 years.',
    location: 'Thanjavur, Tamil Nadu', language: 'en',
    source_reference: 'Family oral tradition; local community knowledge',
    status: 'pending', created_at: '2024-09-15T10:30:00Z', contributor_name: 'Meenakshi Sundaram',
  },
  {
    id: 'contrib-002', user_id: 'user-2', heritage_site_id: 'site-002', type: 'photograph',
    title: 'Shore Temple at Sunrise — January 2024',
    description: 'Photograph taken at sunrise showing the Shore Temple against the golden Bay of Bengal. The morning light reveals weathering patterns not visible at other times of day, showing the cumulative effect of centuries of salt spray erosion on the granite carvings.',
    location: 'Mahabalipuram, Tamil Nadu', language: 'en',
    source_reference: 'Original photograph — January 14, 2024',
    status: 'under_verification', created_at: '2024-01-15T08:00:00Z', contributor_name: 'Arjun Krishnamurthy',
  },
  {
    id: 'contrib-003', user_id: 'user-3', heritage_site_id: 'site-003', type: 'tradition',
    title: 'Local Legend of the Gingee Fort Treasure',
    description: 'According to local oral tradition, during Rajaram\'s 8-year siege of Gingee Fort, the Maratha treasury was buried somewhere within the Rajagiri citadel. Local villagers have passed down stories of secret passages and hidden chambers for generations.',
    location: 'Gingee, Villupuram, Tamil Nadu', language: 'en',
    source_reference: 'Local community oral tradition',
    status: 'approved', reviewer_id: 'admin-001',
    review_notes: 'Oral tradition documented. Historical context of the siege is verified. Treasure legend marked as unverified local tradition.',
    created_at: '2024-08-20T14:00:00Z', reviewed_at: '2024-08-25T10:00:00Z', contributor_name: 'Selvam Rajan',
  },
  {
    id: 'contrib-004', user_id: 'user-4', heritage_site_id: 'site-004', type: 'story',
    title: 'The Musical Pillars of Meenakshi Temple',
    description: 'The 1000-pillar hall (which actually has 985 pillars) contains a unique cluster of musical pillars. When you tap each pillar with your knuckles, each produces a distinct musical note. Local guides say these pillars can reproduce all notes of classical Carnatic music. The engineering behind this acoustic phenomenon is not fully understood even today.',
    location: 'Madurai, Tamil Nadu', language: 'en',
    source_reference: 'Personal observation; Archaeological Survey of India audio documentation',
    status: 'approved', reviewer_id: 'admin-001',
    review_notes: 'Musical pillars are a well-documented architectural feature. Account aligns with published documentation.',
    created_at: '2024-07-10T11:00:00Z', reviewed_at: '2024-07-15T16:00:00Z', contributor_name: 'Dr. Padma Venkataraman',
  },
];
