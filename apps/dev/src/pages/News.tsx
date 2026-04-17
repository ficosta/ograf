import {
  ArrowUpRight,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Lock,
  MapPin,
  Megaphone,
  MessagesSquare,
  Mic,
  Newspaper,
  Play,
  Plus,
} from "lucide-react";
import {
  EVENTS,
  NEWS_ITEMS,
  PRESENTATIONS,
  RESOURCES,
  VIDEOS,
  type Event,
  type NewsItem,
  type NewsType,
  type Presentation,
  type Video,
} from "../content/news";

const TODAY = new Date().toISOString().slice(0, 10);

const TYPE_STYLES: Record<NewsType, string> = {
  announcement: "bg-blue-50 text-blue-700 ring-blue-600/20",
  article: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  community: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const TYPE_LABELS: Record<NewsType, string> = {
  announcement: "Announcement",
  article: "Article",
  community: "Community",
};

function typeIcon(type: NewsType) {
  if (type === "announcement") return Megaphone;
  if (type === "community") return MessagesSquare;
  return Newspaper;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatEventDate(start: string, end?: string): string {
  const s = new Date(start);
  const sFormatted = s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!end) return sFormatted;
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${e.toLocaleDateString(
      undefined,
      { day: "numeric", year: "numeric" },
    )}`;
  }
  return `${sFormatted} – ${e.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

function partitionEvents(events: readonly Event[]): {
  upcoming: readonly Event[];
  past: readonly Event[];
} {
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    const endDate = e.endDate ?? e.date;
    if (endDate >= TODAY) upcoming.push(e);
    else past.push(e);
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  past.sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

function groupNewsByYear(items: readonly NewsItem[]): Record<string, NewsItem[]> {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  return sorted.reduce<Record<string, NewsItem[]>>((acc, item) => {
    const year = item.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});
}

function EventCard({ event, past = false }: { event: Event; past?: boolean }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-900/10 ${past ? "opacity-75" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
          <Calendar className="h-3.5 w-3.5" />
          <time>{formatEventDate(event.date, event.endDate)}</time>
          {past && (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              Past
            </span>
          )}
        </div>
        <ArrowUpRight
          className="h-4 w-4 flex-none text-slate-300 transition-colors group-hover:text-blue-600"
          strokeWidth={2}
        />
      </div>
      <h3 className="mt-3 font-display text-lg font-medium text-slate-900 transition-colors group-hover:text-blue-600">
        {event.title}
      </h3>
      <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 flex-none" />
          {event.location}
        </span>
        {event.speaker && (
          <span className="inline-flex items-center gap-1.5">
            <Mic className="h-3.5 w-3.5 flex-none" />
            {event.speaker}
          </span>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm text-slate-700">{event.summary}</p>
    </a>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const Icon = typeIcon(item.type);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-900/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <time>{formatDate(item.date)}</time>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-slate-700">{item.source}</span>
        </div>
        <ArrowUpRight
          className="h-4 w-4 flex-none text-slate-300 transition-colors group-hover:text-blue-600"
          strokeWidth={2}
        />
      </div>
      <h3 className="mt-3 font-display text-lg font-medium text-slate-900 transition-colors group-hover:text-blue-600">
        {item.title}
      </h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_STYLES[item.type]}`}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
          {TYPE_LABELS[item.type]}
        </span>
      </div>
      <p className="mt-4 flex-1 text-sm text-slate-700">{item.summary}</p>
    </a>
  );
}

function VideoCard({ video }: { video: Video }) {
  const embedSrc = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`;
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
      <div className="relative aspect-video bg-slate-900">
        <iframe
          src={embedSrc}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Play className="h-3 w-3 fill-slate-400 text-slate-400" />
          <span className="font-medium text-slate-700">{video.author}</span>
        </div>
        <h3 className="mt-2 font-display text-base font-medium text-slate-900">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-700">{video.summary}</p>
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Watch on YouTube
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function PresentationCard({ item }: { item: Presentation }) {
  const hasLocal = Boolean(item.localUrl);
  return (
    <div className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-slate-900/10">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
          <Calendar className="h-3.5 w-3.5" />
          <time>{formatDate(item.date)}</time>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
            hasLocal
              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
              : "bg-amber-50 text-amber-700 ring-amber-600/20"
          }`}
        >
          {hasLocal ? (
            <>
              <FileText className="h-3 w-3" strokeWidth={2.5} />
              Local copy
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" strokeWidth={2.5} />
              EBU sign-in
            </>
          )}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-medium text-slate-900">{item.title}</h3>
      {item.speaker && (
        <p className="mt-1 text-xs text-slate-500">
          <Mic className="mr-1 inline h-3 w-3" />
          {item.speaker}
        </p>
      )}
      <p className="mt-3 flex-1 text-sm text-slate-700">{item.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {hasLocal ? (
          <a
            href={item.localUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
            Open PDF
          </a>
        ) : (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
            View on EBU
          </a>
        )}
        {hasLocal && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
          >
            source
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function News() {
  const { upcoming, past } = partitionEvents(EVENTS);
  const newsByYear = groupNewsByYear(NEWS_ITEMS);
  const newsYears = Object.keys(newsByYear).sort().reverse();

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
          News, events & talks.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          Everything OGraf, in one place — announcements, editorial coverage, conference sessions, presentation decks, and demo videos.
        </p>
      </div>

      {/* Stats */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-5">
            <div className="text-center">
              <p className="font-display text-4xl font-light text-blue-600">{NEWS_ITEMS.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                News items
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-emerald-600">{upcoming.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Upcoming events
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-slate-900">{past.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Past events
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-amber-600">
                {PRESENTATIONS.length}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Decks
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-light text-rose-600">{VIDEOS.length}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Videos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      {(upcoming.length > 0 || past.length > 0) && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {upcoming.length > 0 && (
              <div className="mb-16">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50">
                    <Calendar className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                      Upcoming events
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 sm:text-base">
                      Conferences, talks, and meetups with OGraf on the agenda.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((e) => (
                    <EventCard key={`${e.date}-${e.title}`} event={e} />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-slate-100">
                    <Calendar className="h-6 w-6 text-slate-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                      Past events
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 sm:text-base">
                      Sessions and roundtables worth catching the recordings or decks for.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((e) => (
                    <EventCard key={`${e.date}-${e.title}`} event={e} past />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Videos */}
      {VIDEOS.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-rose-50">
                <Play className="h-6 w-6 fill-rose-600 text-rose-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                  Videos & demos
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  OGraf in motion — workflow demos and walkthroughs from the ecosystem.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {VIDEOS.map((v) => (
                <VideoCard key={v.youtubeId} video={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Presentations */}
      {PRESENTATIONS.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-amber-50">
                <FileText className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                  Presentations & decks
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  EBU webinars, NTS sessions, and tech-i magazine features. Local copies served here when possible; the rest link to the EBU archive.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRESENTATIONS.map((p) => (
                <PresentationCard key={`${p.date}-${p.title}`} item={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-50">
              <Newspaper className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                Latest news
              </h2>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Announcements, deep dives, and industry coverage.
              </p>
            </div>
          </div>

          {newsYears.map((year) => (
            <div key={year} className="mb-12 last:mb-0">
              <h3 className="mb-6 font-display text-xl font-medium tracking-tight text-slate-900">
                {year}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {newsByYear[year].map((item) => (
                  <NewsCard key={item.url} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      {RESOURCES.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-slate-100">
                <Link2 className="h-6 w-6 text-slate-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                  Reference links
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  Official spec, repos, and pages to watch for fresh OGraf coverage.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RESOURCES.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-900/5"
                >
                  <Link2 className="mt-0.5 h-4 w-4 flex-none text-slate-400 group-hover:text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-900 group-hover:text-blue-600">
                      {r.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">{r.description}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 flex-none text-slate-300 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
            Spotted something we missed?
          </h2>
          <p className="mt-3 text-slate-700">
            Article, talk, deck, video, or community thread — if it's OGraf-relevant, we want to list it. Open an issue and we'll add it.
          </p>
          <a
            href="https://github.com/ebu/ograf/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Submit on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
