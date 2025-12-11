export type ContentType = 'YOUTUBE_SCRIPT' | 'TIKTOK_SCRIPT' | 'INSTAGRAM_CAPTION';

export interface GenerateContentRequest {
    contentType: ContentType;
    idea: string;
    brandVoice: string;
}

export interface GeneratedContent {
    title?: string;
    hooks?: string[];
    outline?: string;
    longScript?: string;
    shortScript?: string;
    caption?: string;
    description?: string;
    keywords?: string[];
    hashtags?: string[];
    rtl?: boolean;
    copyButton?: boolean;
    storyboard?: StoryboardItem[];
    analysis?: Analysis;
    meta?: Meta;
}

export interface StoryboardItem {
    scene: number;
    shot: string;
    camera: string;
    duration_seconds: number;
    visual: string;
    voiceover: string;
}

export interface Analysis {
    retention_score: number;
    viral_score: number;
    platform_match: number;
    improvement_suggestions: string[];
}

export interface Meta {
    estimated_word_count: number;
    reading_time_minutes: number;
    content_category: string;
    tone_detected: string;
}

export interface ContentHistoryResponse {
    id: string;
    contentType: ContentType;
    createdAt: string;
    content: GeneratedContent;
}
