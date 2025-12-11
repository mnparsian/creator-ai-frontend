import CopyButton from "../../CopyButton";
import { StoryboardItem } from "../../../types/content";

export default function OutputStoryboard({ storyboard }: { storyboard?: StoryboardItem[] }) {
    if (!storyboard || storyboard.length === 0) return null;

    const copyText = storyboard.map(s => `Scene ${s.scene}: [${s.duration_seconds}s] ${s.visual} | Shot: ${s.shot} | VO: ${s.voiceover}`).join('\n');

    return (
        <div className="relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 pb-16 shadow-sm">
            <CopyButton text={copyText} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">🎬 Storyboard</h3>
            <div className="space-y-4">
                {storyboard.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-700 dark:text-slate-200">Scene {item.scene}</span>
                            <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">{item.duration_seconds}s</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase">Visual</p>
                                <p className="font-medium text-slate-800 dark:text-slate-300">{item.visual}</p>
                                <p className="text-slate-500 text-xs mt-1">SHOT: {item.shot} | {item.camera}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase">Voiceover</p>
                                <p className="italic text-slate-600 dark:text-slate-400">"{item.voiceover}"</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
