"use client";

import { useState } from "react";
import { MessageSquare, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  user_email: string;
  content: string;
  createdAt: Date;
}

export function CommentThread({ initialComments }: { claimId: string, initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsPending(true);
    // In a real app, this would call a server action or API route.
    // For MVP demonstration, we mock the optimistic update.
    setTimeout(() => {
      const mockComment: Comment = {
        id: Math.random().toString(),
        user_email: "current_user@example.com",
        content: newComment,
        createdAt: new Date(),
      };
      setComments([mockComment, ...comments]);
      setNewComment("");
      setIsPending(false);
    }, 500);
  };

  return (
    <div className="glass-card bg-accent/5 border-none p-8 md:p-12 mt-12">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Community Discourse</h3>
          <p className="text-muted-foreground text-sm font-medium">Discuss the provenance and linguistic merit of this term.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 relative">
        <Textarea 
          placeholder="Share your research or perspective on this coined term..."
          className="min-h-[120px] rounded-2xl glass-input p-6 text-base focus:ring-blue-500/50 resize-none pb-16"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="absolute bottom-4 right-4">
          <Button 
            type="submit" 
            disabled={isPending || !newComment.trim()}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-500/20"
          >
            {isPending ? "Posting..." : <><Send size={16} /> Post Comment</>}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-medium italic">No discourse recorded yet. Be the first to comment.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-6 rounded-2xl bg-background/40 border border-border/50 group transition-colors hover:bg-background/60">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {comment.user_email[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{comment.user_email}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-amber-500 hover:bg-amber-500/10" title="Flag as inappropriate">
                  <AlertTriangle size={14} />
                </Button>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-300">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
