import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Lightbulb, Music, Send, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions: {
    thumbsUp: number;
    music: number;
    lightbulb: number;
  };
  lineNumber?: number;
}

export function CommentSystem() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Alex Chen',
      avatar: 'AC',
      content: 'This fibonacci implementation creates a beautiful ascending melody! The recursive pattern translates perfectly to musical intervals.',
      timestamp: '5 min ago',
      reactions: { thumbsUp: 3, music: 2, lightbulb: 1 },
      lineNumber: 4
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      content: 'Love how the loop generates a rhythmic pattern. What if we add some conditional harmonies based on the number values?',
      timestamp: '12 min ago',
      reactions: { thumbsUp: 5, music: 3, lightbulb: 2 },
      lineNumber: 8
    },
    {
      id: 3,
      author: 'Mike Rodriguez',
      avatar: 'MR',
      content: 'The timing of this algorithm creates natural musical phrasing. Amazing work!',
      timestamp: '1 hour ago',
      reactions: { thumbsUp: 2, music: 4, lightbulb: 0 }
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: 'You',
        avatar: 'YU',
        content: newComment,
        timestamp: 'now',
        reactions: { thumbsUp: 0, music: 0, lightbulb: 0 }
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const addReaction = (commentId: number, reactionType: keyof Comment['reactions']) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? {
            ...comment,
            reactions: {
              ...comment.reactions,
              [reactionType]: comment.reactions[reactionType] + 1
            }
          }
        : comment
    ));
  };

  const reactionIcons = {
    thumbsUp: Heart,
    music: Music,
    lightbulb: Lightbulb
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Comments</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* New Comment Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment about the code or music..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={addComment}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border border-border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        {comment.lineNumber && (
                          <Badge variant="secondary" className="text-xs">
                            Line {comment.lineNumber}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {comment.content}
                      </p>
                      
                      {/* Reactions */}
                      <div className="flex items-center space-x-1">
                        {Object.entries(comment.reactions).map(([type, count]) => {
                          const IconComponent = reactionIcons[type as keyof typeof reactionIcons];
                          return (
                            <Button
                              key={type}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-accent"
                              onClick={() => addReaction(comment.id, type as keyof Comment['reactions'])}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {count}
                            </Button>
                          );
                        })}
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {comments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet.</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}