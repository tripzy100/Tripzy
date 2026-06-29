"use client";

import * as React from "react";
import { FileText, Plus, Edit2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

export default function AdminBlogCmsPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = React.useState([
    { id: "a1", title: "Top 10 Self Drive Routes in Maharashtra", category: "Travel Guides", status: "PUBLISHED", date: "2026-06-25" },
    { id: "a2", title: "Safety Tips for Long Road Trips in Monsoon", category: "Safety", status: "DRAFT", date: "2026-06-29" },
  ]);

  const toggleStatus = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const newStatus = art.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          showToast(`Article status updated to ${newStatus}`, "success");
          return { ...art, status: newStatus };
        }
        return art;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gradient">Blog CMS Manager</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Compose articles, update SEO description tags, edit categories, and publish content.
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Compose Post
        </Button>
      </div>

      {/* Articles table list */}
      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Post Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Created Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground/80">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-muted/10">
                <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" /> {art.title}
                </td>
                <td className="p-4">{art.category}</td>
                <td className="p-4 font-mono text-xs">{art.date}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    art.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {art.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Button size="sm" variant="ghost" title="Edit Article">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button onClick={() => toggleStatus(art.id)} size="sm" variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" /> Toggle Publish
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type AdminBlogCmsPageType = typeof AdminBlogCmsPage;
