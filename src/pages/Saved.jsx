const savedPreview = [
  ['😌', 'Quiet Waterfront', 'Calm'],
  ['🎨', 'Creative Corner', 'Creative'],
  ['✨', 'Inspiring View', 'Inspiring'],
];

export default function Saved({ user }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-3 py-8 sm:px-5 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-[rgba(22,22,22,0.07)] bg-[#FFFDFC] shadow-[0_28px_70px_rgba(22,22,22,0.11)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.42fr_0.58fr] lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#B4232C]">
              Saved Places
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-[#171326]">
              Places worth coming back to.
            </h1>
            <p className="mt-4 max-w-md text-base font-semibold leading-7 text-[#6F6A66]">
              {user?.username
                ? `${user.username}, your saved Mood Pins will collect here as the product grows.`
                : 'Your saved Mood Pins will collect here once you are signed in.'}
            </p>
          </div>

          <div className="grid gap-3">
            {savedPreview.map(([emoji, title, mood]) => (
              <article
                key={title}
                className="flex items-center gap-4 rounded-3xl border border-[#E4DDD7] bg-[#FAF8F6] p-4 shadow-[0_10px_24px_rgba(22,22,22,0.045)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-[0_10px_22px_rgba(22,22,22,0.08)]">
                  {emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-black text-[#171326]">
                    {title}
                  </h2>
                  <p className="text-sm font-bold text-[#6F6A66]">{mood}</p>
                </div>
                <span className="text-xl text-[#B4232C]">♥</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
