import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, type PanInfo, type Variants } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export type HeroCarouselSlide = {
  key: string;
  imageUrl: string;
  subtitle?: string;
  heading: string;
  /** Large secondary line; "/" separates items, e.g. "8:00 / 9:45 / 11:30". */
  highlight?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

type Props = {
  slides: HeroCarouselSlide[];
  /** Used when a slide has no button of its own. */
  liveUrl: string;
  onOpenEvents: () => void;
  /** Milliseconds each slide stays on screen. */
  interval?: number;
};

// Slides travel left → right: the next slide enters from the left edge and pushes the current one
// off to the right. Going back reverses it.
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
  center: { x: '0%' },
  exit: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
};
const SLIDE_TRANSITION = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };
const SWIPE_DISTANCE = 60;

export default function HeroCarousel({ slides, liveUrl, onOpenEvents, interval = 6500 }: Props) {
  const reduceMotion = useReducedMotion();
  const count = slides.length;
  const multiple = count > 1;

  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  // Respect "reduce motion": don't start auto-playing; visitors can still press play.
  const [userPaused, setUserPaused] = useState(() => !!reduceMotion);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);

  const current = Math.min(index, count - 1);
  const playing = multiple && !userPaused && !hovered && !focused && !hidden;

  const go = useCallback((dir: number) => {
    setPage(([i]) => [(i + dir + count) % count, dir]);
  }, [count]);
  const goTo = (target: number) => {
    if (target !== current) setPage([target, target > current ? 1 : -1]);
  };

  // Pause while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Warm the cache so the next slide's image is ready before it slides in.
  useEffect(() => {
    if (!multiple) return;
    const img = new Image();
    img.src = slides[(current + 1) % count].imageUrl;
  }, [current, count, multiple, slides]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Dragging right pulls in the slide waiting on the left (next); dragging left goes back.
    if (info.offset.x > SWIPE_DISTANCE) go(1);
    else if (info.offset.x < -SWIPE_DISTANCE) go(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!multiple) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  if (!count) return null;
  const slide = slides[current];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Welcome to Kingdom Seekers Fellowship"
      onKeyDown={onKeyDown}
      onPointerEnter={e => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
      className="relative isolate h-[85vh] min-h-[580px] w-full overflow-hidden rounded-[1.5rem] bg-deep-navy sm:h-[90vh] sm:rounded-[2.5rem] md:min-h-[640px] lg:min-h-[720px]"
    >
      <div aria-live={playing ? 'off' : 'polite'} className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : SLIDE_TRANSITION}
            drag={multiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            role="group"
            aria-roledescription="slide"
            aria-label={`${current + 1} of ${count}`}
            className="absolute inset-0 flex touch-pan-y items-end pb-24 pt-24 sm:pb-28 md:pb-32 lg:pb-36"
          >
            <SlideBackground slide={slide} animate={!reduceMotion} duration={interval} eager={current === 0} />
            <SlideContent slide={slide} isFirst={current === 0} liveUrl={liveUrl} onOpenEvents={onOpenEvents} />
          </motion.div>
        </AnimatePresence>
      </div>

      {multiple && (
        <div className="absolute inset-x-0 bottom-6 z-40 sm:bottom-8">
          <div className="container mx-auto flex items-center justify-between gap-4 px-6 sm:px-12 md:px-16 lg:px-24">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.heading}`}
                  aria-current={i === current ? 'true' : undefined}
                  className="group relative flex h-8 items-center"
                >
                  <span className={`relative block h-1 overflow-hidden rounded-full bg-ksf-white/30 transition-all duration-500 ${i === current ? 'w-12 sm:w-16' : 'w-5 group-hover:bg-ksf-white/60'}`}>
                    {i === current && (
                      <span
                        key={`${s.key}-${current}`}
                        // The progress bar's CSS animation is the timer: when it finishes, advance.
                        onAnimationEnd={() => go(1)}
                        style={{ animationDuration: `${interval}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                        className="absolute inset-0 origin-left animate-hero-progress rounded-full bg-ksf-white"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ControlButton label={userPaused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setUserPaused(p => !p)}>
                {userPaused ? <Play size={16} /> : <Pause size={16} />}
              </ControlButton>
              <ControlButton label="Previous slide" onClick={() => go(-1)}><ChevronLeft size={20} /></ControlButton>
              <ControlButton label="Next slide" onClick={() => go(1)}><ChevronRight size={20} /></ControlButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ksf-white/25 bg-ksf-white/10 text-ksf-white backdrop-blur-md transition hover:bg-ksf-white hover:text-ksf-dark-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ksf-white sm:h-11 sm:w-11">
      {children}
    </button>
  );
}

function SlideBackground({ slide, animate, duration, eager }: {
  slide: HeroCarouselSlide; animate: boolean; duration: number; eager: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.img
        src={slide.imageUrl}
        alt=""
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        initial={{ scale: animate ? 1.12 : 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: animate ? duration / 1000 + 1 : 0, ease: 'linear' }}
        className="h-full w-full select-none object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
    </div>
  );
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] } }),
};

function SlideContent({ slide, isFirst, liveUrl, onOpenEvents }: {
  slide: HeroCarouselSlide; isFirst: boolean; liveUrl: string; onOpenEvents: () => void;
}) {
  const Heading = isFirst ? 'h1' : 'h2';
  const highlights = (slide.highlight ?? '').split('/').map(s => s.trim()).filter(Boolean);
  const primaryCls = 'inline-flex min-h-[48px] items-center justify-center rounded-full bg-ksf-white px-10 py-4 text-center font-accent text-xs font-black uppercase tracking-[3px] text-ksf-dark-text shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:bg-bold-red hover:text-ksf-white active:scale-95 sm:px-14 sm:py-5 sm:text-sm';
  const link = slide.buttonLink?.trim();
  const isInternal = !!link && link.startsWith('/') && !link.startsWith('//');

  return (
    <div className="container relative z-10 mx-auto px-6 sm:px-12 md:px-16 lg:px-24">
      <motion.div className="max-w-5xl text-ksf-white" initial="hidden" animate="visible" custom={0.35} variants={contentVariants}>
        {slide.subtitle && (
          <span className="mb-4 block font-accent text-[10px] font-black uppercase tracking-[6px] text-bold-red sm:mb-6 sm:text-xs">
            {slide.subtitle}
          </span>
        )}

        <Heading className="mb-6 font-headlines text-4xl font-black leading-[0.85] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          {slide.heading}
        </Heading>

        {highlights.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-4 font-headlines text-3xl font-black tracking-tighter sm:mb-12 sm:gap-6 sm:text-5xl md:gap-8 md:text-6xl lg:text-7xl">
            {highlights.map((h, i) => (
              <React.Fragment key={`${h}-${i}`}>
                {i > 0 && <span className="select-none font-thin text-ksf-white/20" aria-hidden>/</span>}
                <span className="cursor-default transition-colors hover:text-bold-red">{h}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {slide.description && (
          <p className="mb-10 max-w-2xl font-body text-sm font-medium leading-relaxed tracking-tight opacity-80 sm:mb-14 sm:text-base md:text-lg lg:text-xl">
            {slide.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          {link && slide.buttonText ? (
            isInternal
              ? <Link to={link} className={primaryCls}>{slide.buttonText}</Link>
              : <a href={link} target="_blank" rel="noopener noreferrer" className={primaryCls}>{slide.buttonText}</a>
          ) : (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={primaryCls}>Watch Us Live</a>
          )}
          <button
            type="button"
            onClick={onOpenEvents}
            className="group flex items-center gap-4 rounded-full border border-ksf-white/20 bg-ksf-white/10 px-8 py-4 font-accent text-xs font-black uppercase tracking-[3px] text-ksf-white backdrop-blur-md transition-all hover:bg-bold-red active:scale-95 sm:px-12 sm:py-5 sm:text-sm"
          >
            Upcoming Events
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
