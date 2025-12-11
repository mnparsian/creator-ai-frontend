import { GeneratedContent } from "../../types/content";
import OutputTitle from "./output/OutputTitle";
import OutputHooks from "./output/OutputHooks";
import OutputOutline from "./output/OutputOutline";
import OutputScript from "./output/OutputScript";
import OutputStoryboard from "./output/OutputStoryboard";
import OutputSEO from "./output/OutputSEO";
import OutputAnalysis from "./output/OutputAnalysis";

interface ContentOutputProps {
    content: GeneratedContent | null;
    isLoading: boolean;
}

export default function ContentOutput({ content, isLoading }: ContentOutputProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Generating high-quality content...</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                <span className="text-4xl mb-4">✨</span>
                <p>Enter your idea and click Generate to see magic happen.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Tone & Meta Badge */}
            {content.meta && (
                <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">
                        {content.meta.tone_detected} Tone
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
                        {content.meta.content_category}
                    </span>
                    {content.meta.estimated_word_count && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">
                            ~{content.meta.estimated_word_count} words
                        </span>
                    )}
                </div>
            )}

            <OutputTitle title={content.title} />
            <OutputHooks hooks={content.hooks} />
            <OutputAnalysis analysis={content.analysis} />
            <OutputOutline outline={content.outline} />
            <OutputScript
                longScript={content.longScript}
                shortScript={content.shortScript}
                caption={content.caption}
            />
            <OutputStoryboard storyboard={content.storyboard} />
            <OutputSEO
                description={content.description}
                keywords={content.keywords}
                hashtags={content.hashtags}
            />
        </div>
    );
}
