"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type Draft = {
  author: string | number | readonly string[] | undefined;
  title: string;
  content: string;
  published: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const emptyDraft: Draft = {
  author: "",
  title: "",
  content: "",
  published: true,
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts.");
      }
      const data = (await response.json()) as Post[];
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const openCreate = () => {
    setEditingPost(null);
    setDraft(emptyDraft);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setDraft({
      author: post.author,
      title: post.title,
      content: post.content,
      published: post.published,
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!draft.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!draft.content.trim()) {
      setFormError("Content is required.");
      return;
    }
    setSaving(true);
    try {
      const method = editingPost ? "PATCH" : "POST";
      const endpoint = editingPost
        ? `${API_URL}/posts/${editingPost.id}`
        : `${API_URL}/posts`;
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });
      if (!response.ok) {
        throw new Error("Failed to save the post.");
      }
      setDialogOpen(false);
      setEditingPost(null);
      setDraft(emptyDraft);
      await loadPosts();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the post.");
      }
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const statusLabel = useMemo(() => {
    return draft.published ? "Published" : "Draft";
  }, [draft.published]);

  return (
    <main className="min-h-screen px-6 py-12 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Blog Studio
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Craft, publish, and refine your stories in one clean workspace.
              </h1>
              <p className="text-base text-muted-foreground">
                Manage posts with full CRUD powered by Nest.js + PostgreSQL and
                a shadcn/ui-driven interface.
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? "Edit Post" : "Create Post"}
                  </DialogTitle>
                  <DialogDescription>
                    Keep your writing crisp. Update the fields below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Post title"
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={draft.author}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          author: event.target.value,
                        }))
                      }
                    />
                  </div>
                
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write something memorable..."
                      value={draft.content}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          content: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Visibility</p>
                      <p className="text-xs text-muted-foreground">
                        Choose whether to publish immediately.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.published}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            published: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      {statusLabel}
                    </label>
                  </div>
                  {formError ? (
                    <p className="text-sm text-destructive">{formError}</p>
                  ) : null}
                </div>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setDialogOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => void handleSubmit()} disabled={saving}>
                    {saving ? "Saving..." : "Save Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Latest Posts</h2>
            <Button
              variant="outline"
              onClick={() => void loadPosts()}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
          <Separator />
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : posts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No posts yet</CardTitle>
                <CardDescription>
                  Start by creating your first story.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <Card key={post.id} className="flex h-full flex-col">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => openEdit(post)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => void handleDelete(post.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
