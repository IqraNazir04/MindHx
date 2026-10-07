"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGate from "../components/AdminGate";
import ProgressCharts from "../components/ProgressCharts";
import QuestionnaireAnswersList from "../components/QuestionnaireAnswersList";
import {
  createResource, deleteResource, fetchAdminAnalytics, fetchAdminResources, fetchAdminUserCheckIns, fetchAdminUsers, updateResource,
  type AdminAnalytics, type AdminUserCheckIns, type AdminUserSummary, type ResourceInput, type ResourceRecord, type ResourceType,
} from "../lib/admin";
import { logout, type CurrentUser } from "../lib/auth";
import {
  REFERENCE_INTENTS, deleteReferenceDocument, fetchReferenceDocuments, setReferenceDocumentActive, uploadReferenceDocument,
  type ReferenceDocument, type ReferenceIntent,
} from "../lib/admin";
import { resizeImageToDataUrl } from "../lib/resizeImage";

const RESOURCE_TYPES: ResourceType[] = ["meditation", "therapy", "medication", "general"];
const BAND_LABEL: Record<string, string> = { low: "Low", watch: "Watch", elevated: "Elevated", crisis: "Crisis" };

export default function AdminClient() {
  return <AdminGate>{(user) => <AdminDashboard admin={user} />}</AdminGate>;
}

function AdminDashboard({ admin }: { admin: CurrentUser }) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [users, setUsers] = useState<AdminUserSummary[] | null>(null);
  const [usersError, setUsersError] = useState("");
  const [resources, setResources] = useState<ResourceRecord[] | null>(null);
  const [resourcesError, setResourcesError] = useState("");
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingUser, setViewingUser] = useState<AdminUserSummary | null>(null);

  function loadResources() {
    fetchAdminResources()
      .then(setResources)
      .catch((err) => setResourcesError(err instanceof Error ? err.message : "Could not load resources."));
  }

  useEffect(() => {
    fetchAdminAnalytics()
      .then(setAnalytics)
      .catch((err) => setAnalyticsError(err instanceof Error ? err.message : "Could not load analytics."));
    fetchAdminUsers()
      .then(setUsers)
      .catch((err) => setUsersError(err instanceof Error ? err.message : "Could not load users."));
    loadResources();
  }, []);

  async function handleDelete(resource: ResourceRecord) {
    if (!window.confirm(`Delete "${resource.title}"? This can't be undone.`)) return;
    try {
      await deleteResource(resource.id);
      setResources((current) => current?.filter((item) => item.id !== resource.id) ?? null);
    } catch (err) {
      setResourcesError(err instanceof Error ? err.message : "Could not delete this resource.");
    }
  }

  function handleSignOut() {
    logout();
    router.push("/admin/login");
  }

  const maxBandCount = analytics ? Math.max(1, ...Object.values(analytics.band_counts)) : 1;
  const maxPageCount = analytics && analytics.top_pages.length > 0 ? Math.max(...analytics.top_pages.map((item) => item.count)) : 1;

  return (
    <>
    <main className="resource-page">
      <header className="admin-header">
        <div className="admin-header-brand"><span className="brand-mark">M</span> MindHx <span className="admin-login-tag">Admin</span></div>
        <div className="admin-header-right">
          <span>{admin.email}</span>
          <button className="dashboard-signout" onClick={handleSignOut} type="button">Sign out</button>
        </div>
      </header>
      <section className="resource-hero">
        <p className="eyebrow">ADMIN</p>
        <h1>Website overview<br /><em>for {admin.email}.</em></h1>
        <p>Analytics drawn from saved accounts, check-in history, and site visits, plus the resource posts you publish here.</p>
      </section>

      <section className="admin-section">
        <h2>Analytics</h2>
        {analyticsError && <p className="assessment-error">{analyticsError}</p>}
        {!analytics && !analyticsError && <p className="dashboard-loading">Loading analytics…</p>}
        {analytics && (
          <>
            <div className="admin-stat-grid">
              <div className="admin-stat-tile"><strong>{analytics.total_pageviews}</strong><span>Total site visits</span></div>
              <div className="admin-stat-tile"><strong>{analytics.pageviews_7d}</strong><span>Visits, 7 days</span></div>
              <div className="admin-stat-tile"><strong>{analytics.pageviews_30d}</strong><span>Visits, 30 days</span></div>
              <div className="admin-stat-tile"><strong>{analytics.total_users}</strong><span>Total accounts</span></div>
              <div className="admin-stat-tile"><strong>{analytics.new_users_7d}</strong><span>New accounts, 7 days</span></div>
              <div className="admin-stat-tile"><strong>{analytics.new_users_30d}</strong><span>New accounts, 30 days</span></div>
              <div className="admin-stat-tile"><strong>{analytics.total_checkins}</strong><span>Total check-ins</span></div>
              <div className="admin-stat-tile"><strong>{analytics.checkins_7d}</strong><span>Check-ins, 7 days</span></div>
              <div className="admin-stat-tile"><strong>{analytics.checkins_30d}</strong><span>Check-ins, 30 days</span></div>
            </div>
            <div className="admin-columns">
              <div>
                <h3>Most-visited pages (30 days)</h3>
                {analytics.top_pages.length === 0 && <p className="dashboard-loading">No visits recorded yet.</p>}
                {analytics.top_pages.map((item) => (
                  <div className="admin-bar-row" key={item.path}>
                    <span>{item.path}</span>
                    <span className="admin-bar-track"><i style={{ width: `${(item.count / maxPageCount) * 100}%` }} /></span>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3>Check-in bands</h3>
                {Object.keys(analytics.band_counts).length === 0 && <p className="dashboard-loading">No check-ins saved yet.</p>}
                {Object.entries(analytics.band_counts).map(([band, count]) => (
                  <div className="admin-bar-row" key={band}>
                    <span>{BAND_LABEL[band] ?? band}</span>
                    <span className="admin-bar-track"><i style={{ width: `${(count / maxBandCount) * 100}%` }} /></span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-top-themes">
              <h3>Top themes</h3>
              {analytics.top_themes.length === 0 && <p className="dashboard-loading">No themes recorded yet.</p>}
              <div className="theme-row">{analytics.top_themes.map((item) => <span key={item.theme}>{item.theme.replaceAll("_", " ")} ({item.count})</span>)}</div>
            </div>
          </>
        )}
      </section>

      <section className="admin-section">
        <h2>Users</h2>
        <p className="admin-section-note">Every registered account - read-only here. Select a check-in count to see that person&apos;s questionnaire answers. Never the password, transcript, or written reflection from any check-in.</p>
        {usersError && <p className="assessment-error">{usersError}</p>}
        {users === null && !usersError && <p className="dashboard-loading">Loading users…</p>}
        {users?.length === 0 && <p className="dashboard-loading">No accounts yet.</p>}
        {users && users.length > 0 && (
          <div className="admin-user-table">
            <div className="admin-user-row admin-user-head">
              <span>Email</span><span>Name</span><span>Check-ins</span><span>Role</span><span>Joined</span><span>Last sign-in</span>
            </div>
            {users.map((user) => (
              <div className="admin-user-row" key={user.id}>
                <span>{user.email}</span>
                <span>{user.full_name || "—"}</span>
                <span>
                  {user.checkin_count > 0
                    ? <button className="admin-user-responses" type="button" onClick={() => setViewingUser(user)}>{user.checkin_count} · View</button>
                    : 0}
                </span>
                <span>{user.is_admin ? <b className="admin-user-badge">Admin</b> : "Member"}</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                <span>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Resource posts</h2>
          <button className="check-in-button" type="button" onClick={() => { setEditing(null); setShowForm(true); }}>Add resource <span>→</span></button>
        </div>
        <p className="admin-section-note">Shown on the public /resources page - additive to the site&apos;s existing meditation/therapies content, not a replacement for it.</p>
        {resourcesError && <p className="assessment-error">{resourcesError}</p>}
        {resources === null && !resourcesError && <p className="dashboard-loading">Loading resources…</p>}
        {resources?.length === 0 && <p className="dashboard-loading">No resources yet - add the first one.</p>}
        {resources && resources.length > 0 && (
          <div className="admin-resource-list">
            {resources.map((resource) => (
              <article className="admin-resource-row" key={resource.id}>
                {resource.image_data_url && <img className="admin-resource-thumb" src={resource.image_data_url} alt="" />}
                <div>
                  <b>{resource.title}</b>
                  <span className="admin-resource-meta">{resource.resource_type} · /{resource.slug} · {resource.published ? "published" : "draft"}</span>
                  {resource.summary && <p>{resource.summary}</p>}
                </div>
                <div className="admin-resource-actions">
                  <button type="button" onClick={() => { setEditing(resource); setShowForm(true); }}>Edit</button>
                  <button type="button" onClick={() => handleDelete(resource)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <ReferenceDocumentsSection />
    </main>
    {showForm && (
      <ResourceFormModal
        initial={editing}
        onClose={() => setShowForm(false)}
        onSaved={() => { setShowForm(false); loadResources(); }}
      />
    )}
    {viewingUser && <UserResponsesModal user={viewingUser} onClose={() => setViewingUser(null)} />}
    </>
  );
}

function UserResponsesModal({ user, onClose }: { user: AdminUserSummary; onClose: () => void }) {
  const [data, setData] = useState<AdminUserCheckIns | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminUserCheckIns(user.id)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this person's check-ins."));
  }, [user.id]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-responses-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close" type="button">×</button>
        <p className="eyebrow">ADMIN · QUESTIONNAIRE RESPONSES</p>
        <h2>{user.full_name || user.email}</h2>
        {user.full_name && <p>{user.email}</p>}
        {error && <p className="assessment-error">{error}</p>}
        {!data && !error && <p className="dashboard-loading">Loading check-ins…</p>}
        {data && data.checkins.length > 0 && <ProgressCharts entries={data.checkins} />}
        {data?.checkins.map((checkIn) => (
          <article className="admin-response-checkin" key={checkIn.id}>
            <header>
              <b>{new Date(checkIn.created_at).toLocaleString()}</b>
              <span>{BAND_LABEL[checkIn.band] ?? checkIn.band} · combined {Math.round(checkIn.risk_score * 100)}%</span>
            </header>
            {checkIn.answers
              ? <QuestionnaireAnswersList answers={checkIn.answers} audience="admin" />
              : <p className="dashboard-loading">No individual answers saved for this check-in (saved before answers were recorded, or questionnaires incomplete).</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

function ResourceFormModal({ initial, onClose, onSaved }: { initial: ResourceRecord | null; onClose: () => void; onSaved: () => void }) {
  const [resourceType, setResourceType] = useState<ResourceType>(initial?.resource_type ?? "meditation");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(initial?.image_data_url ?? null);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    setError("");
    try {
      // Larger than an avatar (256px) since this is a post's hero image,
      // not a small circular thumbnail - still resized/compressed
      // client-side before it ever reaches the backend.
      const dataUrl = await resizeImageToDataUrl(file, 800, 0.8);
      setImageDataUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process this image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const input: ResourceInput = { resourceType, slug: slug.trim(), title: title.trim(), summary, body, imageDataUrl, published };
    try {
      if (initial) {
        await updateResource(initial.id, input);
      } else {
        await createResource(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this resource.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close" type="button">×</button>
        <p className="eyebrow">ADMIN</p>
        <h2>{initial ? "Edit resource" : "Add resource"}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Type</span>
            <select value={resourceType} onChange={(event) => setResourceType(event.target.value as ResourceType)}>
              {RESOURCE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span>Slug (lowercase, hyphens only)</span>
            <input type="text" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="box-breathing" />
          </label>
          <label>
            <span>Title</span>
            <input type="text" required value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            <span>Summary</span>
            <input type="text" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="One or two sentences" />
          </label>
          <label>
            <span>Body</span>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={6} />
          </label>
          <label>
            <span>Image (optional)</span>
            {imageDataUrl && <img className="admin-image-preview" src={imageDataUrl} alt="" />}
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploadingImage} />
            {imageDataUrl && <button type="button" className="admin-image-remove" onClick={() => setImageDataUrl(null)}>Remove image</button>}
          </label>
          <label className="admin-published-toggle">
            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
            <span>Published (visible on the public site)</span>
          </label>
          {error && <p className="assessment-error auth-error">{error}</p>}
          <button className="check-in-button" type="submit" disabled={loading || uploadingImage}>{loading ? "Saving…" : initial ? "Save changes" : "Add resource"} <span>→</span></button>
        </form>
      </div>
    </div>
  );
}

function ReferenceDocumentsSection() {
  const [documents, setDocuments] = useState<ReferenceDocument[] | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [intent, setIntent] = useState<ReferenceIntent>("anxiety");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    fetchReferenceDocuments()
      .then(setDocuments)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load documents."));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError("");
    try {
      await uploadReferenceDocument({ file, title: title.trim(), intent, sourceName: sourceName.trim() });
      setTitle("");
      setSourceName("");
      setFile(null);
      (event.target as HTMLFormElement).reset();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleToggle(document: ReferenceDocument) {
    try {
      const updated = await setReferenceDocumentActive(document.id, !document.active);
      setDocuments((current) => current?.map((item) => (item.id === updated.id ? updated : item)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this document.");
    }
  }

  async function handleDelete(document: ReferenceDocument) {
    if (!window.confirm(`Delete "${document.title}"? The chat will stop citing it.`)) return;
    try {
      await deleteReferenceDocument(document.id);
      setDocuments((current) => current?.filter((item) => item.id !== document.id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this document.");
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading">
        <h2>Reference documents</h2>
      </div>
      <p className="admin-section-note">Upload approved guidance as a PDF (or .txt / .md, up to 2 MB) to train the MindHx chat. The text is split into passages, and for each question the chat uses the passages that best match it, citing the title and source. Choose &quot;any topic&quot; for general material; other topics also make the passages more likely to be used for that subject. Only the extracted text is stored, and deactivating a document stops the chat using it.</p>
      {error && <p className="assessment-error">{error}</p>}
      <form className="admin-upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept=".txt,.md,.markdown,.pdf,text/plain,text/markdown,application/pdf"
          onChange={(event) => {
            const picked = event.target.files?.[0] ?? null;
            setFile(picked);
            if (picked && !title.trim()) {
              const base = picked.name.replace(/\.[^./\\]+$/, "").replace(/[-_]+/g, " ").trim();
              if (base) setTitle(base.replace(/\b\w/g, (letter) => letter.toUpperCase()));
            }
          }}
          aria-label="PDF or text file"
        />
        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title (shown to the chat as the source)" maxLength={200} aria-label="Title" />
        <input type="text" value={sourceName} onChange={(event) => setSourceName(event.target.value)} placeholder="Source (e.g. clinic handout, guideline name)" maxLength={200} aria-label="Source name" />
        <select value={intent} onChange={(event) => setIntent(event.target.value as ReferenceIntent)} aria-label="Topic">
          {REFERENCE_INTENTS.map((item) => <option key={item} value={item}>{item === "general" ? "any topic" : item.replaceAll("_", " ")}</option>)}
        </select>
        <button className="check-in-button" type="submit" disabled={!file || !title.trim() || uploading}>{uploading ? "Uploading and indexing…" : "Upload PDF to train chatbot"} <span>→</span></button>
      </form>
      {!uploading && (!file || !title.trim()) && <p className="admin-upload-hint">{!file ? "Choose a file, then add a title (filled in for you from the file name - edit it if you like)." : "Add a title to enable the upload button."}</p>}
      {documents === null && !error && <p className="dashboard-loading">Loading documents…</p>}
      {documents?.length === 0 && <p className="dashboard-loading">No reference documents yet.</p>}
      {documents && documents.length > 0 && (
        <div className="admin-resource-list">
          {documents.map((document) => (
            <article className="admin-resource-row" key={document.id}>
              <div>
                <b>{document.title}</b>
                <span className="admin-resource-meta">{document.intent.replaceAll("_", " ")} · {document.source_name || "no source given"} · {document.characters.toLocaleString()} characters · {document.active ? "active" : "inactive"}</span>
              </div>
              <div className="admin-resource-actions">
                <button type="button" onClick={() => handleToggle(document)}>{document.active ? "Deactivate" : "Activate"}</button>
                <button type="button" onClick={() => handleDelete(document)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
