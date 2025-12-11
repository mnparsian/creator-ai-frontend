import { useState } from 'react';
import { GenerateContentRequest, ContentType } from '../../types/content';

interface ContentFormProps {
    onGenerate: (data: GenerateContentRequest) => void;
    isLoading: boolean;
}

export default function ContentForm({ onGenerate, isLoading }: ContentFormProps) {
    const [contentType, setContentType] = useState<ContentType>('YOUTUBE_SCRIPT');
    const [brandVoice, setBrandVoice] = useState('neutral');
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({ contentType, brandVoice, idea });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content Type
                </label>
                <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentType)}
                    className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-50"
                >
                    <option value="YOUTUBE_SCRIPT">YouTube Script</option>
                    <option value="TIKTOK_SCRIPT">TikTok/Reels Script</option>
                    <option value="INSTAGRAM_CAPTION">Instagram Caption</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Brand Voice
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['neutral', 'cinematic', 'funny', 'professional'].map((voice) => (
                        <button
                            key={voice}
                            type="button"
                            onClick={() => setBrandVoice(voice)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${brandVoice === voice
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {voice.charAt(0).toUpperCase() + voice.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Idea or Rough Text
                </label>
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-50 resize-none"
                    placeholder="Enter your content idea..."
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !idea.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-medium rounded-xl px-4 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Content'}
            </button>
        </form>
    );
}
