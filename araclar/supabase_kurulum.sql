-- Kelimearası ortak istatistikler: Supabase SQL Editor'e yapıştırıp "Run" de.
-- Sadece GÜNLÜK bulmacalar karşılaştırılır (sınırsız modda herkesin bulmacası farklı).

create table if not exists public.results (
    id          bigint generated always as identity primary key,
    game        text     not null check (game in (
                    'wordle','ikile','dortle','sekizle','kelime500','tic_tac_word','parolla','betweenle',
                    'spelling_bee','fruit_grids','slitherlink','shihaku','queens','sudoku','nonogram','pips')),
    day         date     not null,
    won         boolean  not null,
    guesses     smallint check (guesses between 1 and 40),
    seconds     integer  check (seconds between 1 and 21600),
    created_at  timestamptz not null default now()
);
create index if not exists results_game_day on public.results (game, day);

-- Herkes sadece EKLEYEBİLİR; okuyamaz, değiştiremez, silemez.
alter table public.results enable row level security;
drop policy if exists "anon insert" on public.results;
create policy "anon insert" on public.results for insert to anon
    with check (day between (now() at time zone 'Europe/Istanbul')::date - 1
                        and (now() at time zone 'Europe/Istanbul')::date + 1);

-- Toplu istatistik: tek tek kayıtları değil, sadece özetleri döndürür.
create or replace function public.game_stats(p_game text, p_day date, p_seconds int default null, p_guesses int default null)
returns json language sql stable security definer set search_path = public as $$
    with r as (select * from results where game = p_game and day = p_day)
    select json_build_object(
        'players',        (select count(*) from r),
        'wins',           (select count(*) from r where won),
        'median_seconds', (select percentile_cont(0.5) within group (order by seconds) from r where won and seconds is not null),
        'guesses',        (select coalesce(json_object_agg(guesses, n), '{}'::json)
                             from (select guesses, count(*) n from r where won and guesses is not null group by guesses) t),
        'slower_than_you',(select count(*) from r where won and p_seconds is not null and seconds > p_seconds),
        'more_guesses',   (select count(*) from r where won and p_guesses is not null and guesses > p_guesses)
    );
$$;
revoke all on function public.game_stats(text, date, int, int) from public;
grant execute on function public.game_stats(text, date, int, int) to anon;

-- Yeni Supabase projelerinde tablolar anon role otomatik açılmıyor; izinleri açıkça ver.
grant usage on schema public to anon;
grant insert on table public.results to anon;
grant execute on function public.game_stats(text, date, int, int) to anon;
