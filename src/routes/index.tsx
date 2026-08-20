import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  candidates,
  currentUser,
  diversityScore,
  rankCandidates,
  type Mode,
  type Profile,
} from "@/lib/connectify-data";

export const Route = createFileRoute("/")({
  component: DiscoveryPage,
});

function Avatar({
  profile,
  className = "",
}: {
  profile: Profile;
  className?: string;
}) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`grid place-items-center rounded-full font-serif text-zinc-900/80 ring-1 ring-black/5 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
      }}
    >
      <span className="drop-shadow-sm">{initials}</span>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const options: { key: Mode; label: string; hint: string }[] = [
    { key: "similar", label: "Similar Interests", hint: "People who overlap with you" },
    { key: "different", label: "Different Perspectives", hint: "Break your bubble" },
  ];
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Discovery Mode
      </h3>
      <div className="flex flex-col gap-2">
        {options.map((o) => {
          const active = mode === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              className={`w-full text-left p-4 rounded-xl transition-colors ring-1 ${
                active
                  ? "bg-brand-soft ring-brand-ring"
                  : "bg-zinc-50 ring-black/5 hover:bg-zinc-50/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-medium ${active ? "text-brand" : "text-zinc-900"}`}
                >
                  {o.label}
                </span>
                <div
                  className={`size-4 rounded-full border-4 ${
                    active ? "border-brand" : "border-zinc-200"
                  }`}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{o.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiversityCard({ score }: { score: number }) {
  const label =
    score >= 60 ? "Broad and open" : score >= 35 ? "Growing" : "Narrow — try Different mode";
  return (
    <div className="p-6 rounded-2xl bg-zinc-50 ring-1 ring-black/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Network Diversity
        </h3>
        <span className="text-brand font-serif text-lg">{score}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function EchoWarning() {
  return (
    <div className="p-4 rounded-xl bg-warn-soft ring-1 ring-amber-950/5">
      <div className="flex gap-3">
        <div className="shrink-0 size-4 mt-0.5 bg-warn rounded-full" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-900">Echo Chamber Alert</p>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            Your last few connections all share your interests. Try Different Perspectives to
            broaden your circle.
          </p>
        </div>
      </div>
    </div>
  );
}

function SwipeCard({ profile }: { profile: Profile }) {
  return (
    <div className="h-full w-full bg-zinc-50 rounded-[24px] ring-1 ring-black/5 overflow-hidden flex flex-col shadow-sm">
      <div className="h-3/5 relative">
        <Avatar profile={profile} className="w-full h-full text-6xl rounded-none" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium ring-1 ring-black/5">
            {profile.role}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium ring-1 ring-black/5">
            {profile.distanceKm} km away
          </span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="font-serif text-3xl leading-tight text-balance mb-2">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-zinc-600 leading-relaxed text-pretty max-w-[48ch]">
            {profile.bio}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <span
              key={i}
              className="px-3 py-1 bg-zinc-200/50 rounded-md text-[11px] font-medium text-zinc-500"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyDeck({ onReset }: { onReset: () => void }) {
  return (
    <div className="h-full w-full bg-zinc-50 rounded-[24px] ring-1 ring-black/5 flex flex-col items-center justify-center p-10 text-center">
      <h2 className="font-serif text-2xl mb-2">You've seen everyone for now</h2>
      <p className="text-zinc-500 text-sm mb-6 text-pretty">
        Switch modes or refresh the deck to see profiles again.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-full bg-zinc-900 text-zinc-50 text-sm font-medium"
      >
        Refresh deck
      </button>
    </div>
  );
}

function ProfileModal({
  profile,
  onClose,
  onSave,
  onSignOut,
}: {
  profile: Profile;
  onClose: () => void;
  onSave: (p: Profile) => void;
  onSignOut: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [interestsText, setInterestsText] = useState(profile.interests.join(", "));

  const handleSave = () => {
    onSave({
      ...draft,
      interests: interestsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setInterestsText(profile.interests.join(", "));
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-zinc-50 rounded-[32px] ring-1 ring-black/5 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="flex justify-center mb-6">
          <Avatar profile={profile} className="size-24 text-2xl ring-4 ring-zinc-50" />
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Name
              </label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Age
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={draft.age}
                  onChange={(e) =>
                    setDraft({ ...draft, age: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Role
                </label>
                <input
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Bio
              </label>
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                rows={3}
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Interests (comma separated)
              </label>
              <input
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Instagram
              </label>
              <input
                value={draft.instagram}
                onChange={(e) => setDraft({ ...draft, instagram: e.target.value })}
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white ring-1 ring-black/10 focus:ring-brand outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-full bg-zinc-200 text-zinc-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full bg-brand text-white font-medium"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="font-serif text-3xl leading-none mb-1">
                {profile.name}, {profile.age}
              </h2>
              <p className="text-sm text-zinc-500">{profile.role}</p>
            </div>
            <p className="text-zinc-600 text-center text-pretty">{profile.bio}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-zinc-200/60 rounded-md text-xs font-medium text-zinc-600"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-zinc-100 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Instagram</span>
              <span className="font-medium text-brand">{profile.instagram}</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full py-3.5 rounded-full bg-zinc-900 text-zinc-50 font-medium"
            >
              Edit Profile
            </button>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="mt-5 w-full py-3 text-sm font-medium text-red-700 transition-colors hover:text-red-800"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function MatchModal({
  profile,
  me,
  onClose,
}: {
  profile: Profile;
  me: Profile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-zinc-50 rounded-[32px] ring-1 ring-black/5 p-10 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="flex justify-center -space-x-4 mb-8">
          <Avatar profile={me} className="size-24 text-2xl ring-4 ring-zinc-50 z-10" />
          <Avatar profile={profile} className="size-24 text-2xl ring-4 ring-zinc-50 z-20" />
        </div>
        <h2 className="font-serif text-4xl mb-4 leading-none">It's a Connection!</h2>
        <p className="text-zinc-600 mb-8 text-pretty">
          You and {profile.name} both want to meet. Say hi on Instagram.
        </p>
        <div className="bg-zinc-100 rounded-2xl p-4 border border-zinc-950/5 flex items-center justify-between mb-8">
          <span className="text-zinc-400 text-sm">Instagram</span>
          <a
            href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand hover:underline"
          >
            {profile.instagram}
          </a>
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-full bg-zinc-900 text-zinc-50 font-medium transition-transform active:scale-95"
        >
          Back to Swiping
        </button>
      </div>
    </div>
  );
}

function DiscoveryPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Profile>(currentUser);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("similar");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [connections, setConnections] = useState<Profile[]>([]);
  const [lastSimilarStreak, setLastSimilarStreak] = useState(0);
  const [matchOpen, setMatchOpen] = useState<Profile | null>(null);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [view, setView] = useState<"discovery" | "network">("discovery");

  useEffect(() => {
    setIsSignedIn(localStorage.getItem("connectify-authenticated") === "true");
  }, []);

  const deck = useMemo(
    () => rankCandidates(me, candidates, mode, seen),
    [me, mode, seen],
  );
  const top = deck[0];
  const diversity = diversityScore(me, connections);
  const showEcho = lastSimilarStreak >= 3;

  const handleSwipe = (direction: "left" | "right") => {
    if (!top) return;
    setSwipeDir(direction);
    // brief animation delay
    window.setTimeout(() => {
      setSwipeDir(null);
      setSeen((prev) => new Set(prev).add(top.id));
      if (direction === "right") {
        // Simulated mutual match: everyone likes you back in the demo.
        setConnections((prev) => [top, ...prev]);
        setMatchOpen(top);
        // Track streaks of similar-mode connections for the echo warning.
        if (mode === "similar") setLastSimilarStreak((n) => n + 1);
        else setLastSimilarStreak(0);
      }
    }, 180);
  };

  const resetDeck = () => setSeen(new Set());

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-brand-soft">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-950/5 bg-zinc-100/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-brand rounded-full ring-1 ring-brand" />
          <span className="font-serif text-xl font-medium tracking-tight">connectify</span>
        </div>
        <div className="hidden md:flex items-center bg-zinc-200/50 p-1 rounded-full ring-1 ring-black/5">
          <button
            onClick={() => setView("discovery")}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
              view === "discovery"
                ? "bg-zinc-50 shadow-sm ring-1 ring-black/5"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Discovery
          </button>
          <button
            onClick={() => setView("network")}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
              view === "network"
                ? "bg-zinc-50 shadow-sm ring-1 ring-black/5"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Network {connections.length > 0 && `(${connections.length})`}
          </button>
        </div>
        <div className="flex items-center gap-4">
          {!isSignedIn && (
            <Link
              to="/login"
              className="hidden text-sm font-medium text-zinc-500 transition-colors hover:text-brand sm:block"
            >
              Sign in
            </Link>
          )}
          <button
            onClick={() => setProfileOpen(true)}
            className="rounded-full ring-2 ring-transparent hover:ring-brand-ring transition-all"
            aria-label="Open your profile"
          >
            <Avatar profile={me} className="size-10 text-xs" />
          </button>
        </div>
      </nav>

      {view === "discovery" ? (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            <ModeToggle mode={mode} onChange={setMode} />
            <DiversityCard score={diversity} />
            {showEcho && <EchoWarning />}
          </aside>

          <section className="lg:col-span-6 space-y-6 flex flex-col items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[440px] aspect-[3/4]">
              {deck[1] && (
                <div className="absolute inset-0 translate-y-2 translate-x-1 bg-zinc-200 rounded-[24px] ring-1 ring-black/5 -z-10" />
              )}
              <div
                key={top?.id ?? "empty"}
                className="h-full transition-all duration-200"
                style={{
                  transform:
                    swipeDir === "right"
                      ? "translateX(60%) rotate(12deg)"
                      : swipeDir === "left"
                        ? "translateX(-60%) rotate(-12deg)"
                        : "none",
                  opacity: swipeDir ? 0 : 1,
                }}
              >
                {top ? <SwipeCard profile={top} /> : <EmptyDeck onReset={resetDeck} />}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => handleSwipe("left")}
                disabled={!top}
                className="size-16 rounded-full bg-zinc-50 ring-1 ring-black/5 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors shadow-sm disabled:opacity-40"
                aria-label="Skip"
              >
                <span className="text-xl">✕</span>
              </button>
              <button
                onClick={() => handleSwipe("right")}
                disabled={!top}
                className="h-16 px-8 rounded-full bg-brand text-white flex items-center justify-center font-medium shadow-lg shadow-brand-ring ring-1 ring-brand transition-transform active:scale-95 disabled:opacity-40"
              >
                Connect
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {deck.length} {deck.length === 1 ? "profile" : "profiles"} left in this mode
            </p>
          </section>

          <aside className="lg:col-span-3 space-y-6 order-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              New Connections
            </h3>
            {connections.length === 0 ? (
              <p className="text-sm text-zinc-500 text-pretty">
                Your matches will land here. Swipe right on someone you'd like to meet.
              </p>
            ) : (
              <div className="space-y-3">
                {connections.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-zinc-200/50 transition-colors cursor-pointer"
                    style={{ opacity: 1 - idx * 0.15 }}
                    onClick={() => setMatchOpen(c)}
                  >
                    <Avatar profile={c} className="size-12 text-xs shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-brand font-medium">{c.instagram}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h1 className="font-serif text-4xl leading-none mb-2">Your Network</h1>
              <p className="text-zinc-500 text-sm">
                {connections.length === 0
                  ? "No connections yet — head back to Discovery to start swiping."
                  : `${connections.length} ${connections.length === 1 ? "connection" : "connections"} · Diversity ${diversity}%`}
              </p>
            </div>
            <button
              onClick={() => setView("discovery")}
              className="text-sm font-medium text-brand hover:underline"
            >
              ← Back to Discovery
            </button>
          </div>

          {connections.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 ring-1 ring-black/5 p-16 text-center">
              <p className="font-serif text-2xl mb-2">Nothing here yet</p>
              <p className="text-zinc-500 text-sm">
                Swipe right on someone in Discovery and they'll show up here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setMatchOpen(c)}
                  className="text-left bg-zinc-50 rounded-2xl ring-1 ring-black/5 p-6 hover:ring-brand-ring transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar profile={c} className="size-14 text-sm shrink-0" />
                    <div className="min-w-0">
                      <p className="font-serif text-xl leading-tight">
                        {c.name}, {c.age}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{c.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2 mb-4 text-pretty">
                    {c.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.interests.slice(0, 3).map((i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-200/50 rounded-md text-[10px] font-medium text-zinc-500"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-950/5">
                    <span className="text-xs text-zinc-400">Instagram</span>
                    <span className="text-xs font-medium text-brand">{c.instagram}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      )}

      {matchOpen && (
        <MatchModal profile={matchOpen} me={me} onClose={() => setMatchOpen(null)} />
      )}
      {profileOpen && (
        <ProfileModal
          profile={me}
          onClose={() => setProfileOpen(false)}
          onSave={(p) => setMe(p)}
          onSignOut={() => {
            localStorage.removeItem("connectify-authenticated");
            setProfileOpen(false);
            navigate({ to: "/login" });
          }}
        />
      )}
    </div>
  );
}
