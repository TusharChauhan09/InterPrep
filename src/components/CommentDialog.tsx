import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("3");

  const addComment = useMutation(api.comments.addComment);
  const users = useQuery(api.users.getUsers);
  const existingComments = useQuery(api.comments.getComments, { interviewId });

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter comment");

    try {
      await addComment({
        interviewId,
        content: comment.trim(),
        rating: parseInt(rating),
      });

      toast.success("Comment submitted");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit comment");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-3.5 w-3.5 ${starValue <= rating ? "fill-amber text-amber" : "text-border"}`}
        />
      ))}
    </div>
  );

  if (existingComments === undefined || users === undefined) return null;

  const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="w-full h-9 border border-border bg-background text-xs font-bold uppercase tracking-[0.1em] hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={monoFont}
        >
          <MessageSquareIcon className="h-3 w-3" />
          Add Comment
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle
            className="text-2xl uppercase"
            style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
          >
            Interview Comment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {existingComments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="mono-label">Previous Comments</span>
                <span
                  className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border border-border text-muted-foreground"
                  style={monoFont}
                >
                  {existingComments.length} Comment{existingComments.length !== 1 ? "s" : ""}
                </span>
              </div>

              <ScrollArea className="h-[240px]">
                <div className="space-y-3">
                  {existingComments.map((comment, index) => {
                    const interviewer = getInterviewerInfo(users, comment.interviewerId);
                    return (
                      <div key={index} className="border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 rounded-none border border-border">
                              <AvatarImage src={interviewer.image} />
                              <AvatarFallback className="rounded-none text-[10px] font-bold">{interviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{interviewer.name}</p>
                              <p className="mono-label">
                                {format(comment._creationTime, "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          {renderStars(comment.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="mono-label">Rating</label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      <div className="flex items-center gap-2">{renderStars(value)}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="mono-label">Your Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed comment about the candidate..."
                className="h-32"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            className="h-10 px-5 border border-border bg-background text-xs font-bold uppercase tracking-[0.1em] hover:bg-muted transition-colors cursor-pointer"
            style={monoFont}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 px-5 bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity cursor-pointer"
            style={monoFont}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CommentDialog;
