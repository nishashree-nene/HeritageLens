export type UserRole = 'visitor' | 'student' | 'contributor' | 'expert' | 'admin';
export type Language = 'en' | 'ta';
export type HeritageType = 'temple' | 'fort' | 'palace' | 'museum' | 'archaeological' | 'sculpture' | 'traditional_art' | 'festival' | 'food_heritage' | 'handicraft' | 'intangible';
export type PreservationStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'at_risk';
export type VerificationStatus = 'verified' | 'partial' | 'interpretive' | 'pending' | 'rejected';
export type ContributionStatus = 'pending' | 'under_verification' | 'approved' | 'rejected';
export type ReconstructionConfidence = 'high' | 'medium' | 'low' | 'interpretive';
export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'image_identification';

export interface Profile {
  id: string; user_id: string; name: string; avatar_url?: string;
  role: UserRole; preferred_language: Language; created_at: string;
}

export interface HeritageSite {
  id: string; name_en: string; name_ta: string; slug: string;
  description_en: string; description_ta: string; history_en: string; history_ta: string;
  location_name: string; latitude: number; longitude: number;
  heritage_type: HeritageType; historical_period: string; construction_date?: string;
  builder?: string; dynasty?: string; current_condition: string;
  preservation_status: PreservationStatus; featured_image: string; images?: string[];
  past_image?: string;
  ar_available: boolean; model_available: boolean; verification_status: VerificationStatus;
  is_unesco: boolean; tags?: string[]; created_at: string; updated_at: string;
  timelines?: HeritageTimeline[]; artifacts?: Artifact[]; stories?: Story[];
  quizzes?: Quiz[]; nearby_places?: NearbyPlace[]; sources?: HeritageSource[];
  reconstructions?: Reconstruction[];
}

export interface HeritageTimeline {
  id: string; heritage_site_id: string; year_label: string;
  title_en: string; title_ta: string; description_en: string; description_ta: string; sort_order: number;
}

export interface HistoricalEvent {
  id: string; heritage_site_id: string; title_en: string; title_ta: string;
  description_en: string; description_ta: string; date_label: string;
  importance: 'high' | 'medium' | 'low'; source_reference?: string;
}

export interface Reconstruction {
  id: string; heritage_site_id: string; title: string; model_url?: string;
  thumbnail_url: string; period: string; confidence_level: ReconstructionConfidence;
  evidence_summary: string; method: string; verification_status: VerificationStatus; created_at: string;
}

export interface Artifact {
  id: string; heritage_site_id: string; name_en: string; name_ta: string;
  description_en: string; description_ta: string; image_url: string; model_url?: string;
  historical_period: string; source_reference?: string;
}

export interface HeritageSource {
  id: string; heritage_site_id: string; title: string;
  source_type: 'archaeological' | 'literary' | 'inscription' | 'photographic' | 'scholarly' | 'government';
  url?: string; citation: string; publisher?: string; year?: string;
}

export interface Story {
  id: string; heritage_site_id: string; title_en: string; title_ta: string;
  content_en: string; content_ta: string; audio_en_url?: string; audio_ta_url?: string;
  verification_status: VerificationStatus; author?: string;
}

export interface NearbyPlace {
  id: string; heritage_site_id: string; name: string;
  category: 'monument' | 'museum' | 'artisan' | 'handicraft' | 'performance' | 'food' | 'festival' | 'accessibility';
  latitude: number; longitude: number; distance: number; description: string;
  image_url?: string; opening_info?: string;
}

export interface Quiz {
  id: string; heritage_site_id: string; title: string; description: string; questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string; quiz_id: string; question: string; question_ta: string;
  question_type: QuizQuestionType; explanation: string; sort_order: number;
  image_url?: string; options?: QuizOption[];
}

export interface QuizOption {
  id: string; question_id: string; option_text: string; option_text_ta: string; is_correct: boolean;
}

export interface Badge {
  id: string; name: string; description: string; icon: string; color?: string;
}

export interface Contribution {
  id: string; user_id?: string; heritage_site_id?: string;
  type: 'story' | 'photograph' | 'audio' | 'video' | 'artifact' | 'correction' | 'tradition';
  title: string; description: string; location?: string; language: Language;
  source_reference?: string; media_urls?: string[]; status: ContributionStatus;
  reviewer_id?: string; review_notes?: string; created_at: string;
  reviewed_at?: string; contributor_name?: string;
}

export interface AIGuideMessage {
  id: string; role: 'user' | 'assistant'; content: string; language: Language; timestamp: string;
}

export interface AIGuideRequest {
  question: string; siteId: string; language: Language; conversationHistory?: AIGuideMessage[];
}

export interface AIGuideResponse {
  answer: string; confidence: 'high' | 'medium' | 'low'; sources?: string[];
  suggestions?: string[]; isDemo: boolean;
}

export interface RecognitionResult {
  siteId: string | null;
  siteName: string;
  confidence: number;
  location: string;
  period: string;
  /** Rich fields returned by the AI backend */
  overview?: string | null;
  notable_facts?: string[];
  architectural_style?: string | null;
  builder?: string | null;
  cultural_significance?: string | null;
  visitor_info?: string | null;
  is_heritage_site?: boolean;
  isDemo: boolean;
  matchMethod: 'visual' | 'location' | 'demo' | 'vision-ai';
  provider?: string;
}

export interface MapMarker {
  id: string; name: string; latitude: number; longitude: number;
  type: HeritageType; ar_available: boolean; model_available: boolean;
  slug: string; image?: string; distance?: number;
}
